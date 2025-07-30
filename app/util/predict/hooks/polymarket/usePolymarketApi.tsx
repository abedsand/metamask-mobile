import { SignTypedDataVersion } from '@metamask/keyring-controller';
import { TransactionType } from '@metamask/transaction-controller';
import { hexToNumber } from '@metamask/utils';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectSelectedInternalAccount } from '../../../../selectors/accountsController';
import {
  selectEvmChainId,
  selectSelectedNetworkClientId,
} from '../../../../selectors/networkController';
import { selectIsPolymarketStaging } from '../../../../selectors/predict';
import { signTypedMessage } from '../../../../util/keyring-controller';
import {
  EIP712Domain,
  getContractConfig,
  getPolymarketEndpoints,
} from '../../../../util/predict/constants/polymarket';
import {
  OrderType,
  ROUNDING_CONFIG,
  Side,
  SignatureType,
  TickSize,
  UserPosition,
} from '../../../../util/predict/types';
import {
  buildMarketOrderCreationArgs,
  calculateMarketPrice,
  encodeRedeemPositions,
  generateSalt,
  priceValid,
  toBytes32,
} from '../../../../util/predict/utils/polymarket';
import { addTransaction } from '../../../../util/transaction-controller';
import { usePolymarketAuth } from './usePolymarketAuth';

export const usePolymarketApi = () => {
  const account = useSelector(selectSelectedInternalAccount);
  const selectedNetworkClientId = useSelector(selectSelectedNetworkClientId);
  const chainId = useSelector(selectEvmChainId);
  const isPolymarketStaging = useSelector(selectIsPolymarketStaging);
  const { createL2Headers, apiKey } = usePolymarketAuth();

  // Get dynamic endpoints based on staging state
  const { CLOB_ENDPOINT } = getPolymarketEndpoints(isPolymarketStaging);

  const [isNetworkSupported, setIsNetworkSupported] = useState(true);
  const [networkError, setNetworkError] = useState<string | null>(null);

  const contractConfig = useMemo(() => {
    try {
      return getContractConfig(hexToNumber(chainId));
    } catch (error) {
      setIsNetworkSupported(false);
      setNetworkError(String(error));
      return null;
    }
  }, [chainId]);

  const placeOrder = async ({
    tokenId,
    tickSize,
    side,
    negRisk,
    amount,
  }: {
    tokenId: string;
    tickSize: TickSize;
    side: Side;
    negRisk: boolean;
    amount: number;
  }) => {
    const price = await calculateMarketPrice(
      tokenId,
      side,
      amount,
      OrderType.FOK,
    );

    if (!priceValid(price, tickSize)) {
      throw new Error(
        `invalid price (${price}), min: ${parseFloat(tickSize)} - max: ${
          1 - parseFloat(tickSize)
        }`,
      );
    }

    const orderArgs = await buildMarketOrderCreationArgs({
      signer: account?.address ?? '',
      maker: account?.address ?? '',
      signatureType: SignatureType.EOA,
      userMarketOrder: {
        tokenID: tokenId,
        price,
        amount,
        side,
        orderType: OrderType.FOK,
      },
      roundConfig: ROUNDING_CONFIG[tickSize],
    });

    const order = {
      salt: hexToNumber(generateSalt()).toString(),
      maker: account?.address ?? '',
      signer: orderArgs.signer ?? account?.address ?? '',
      taker: orderArgs.taker,
      tokenId: orderArgs.tokenId,
      makerAmount: orderArgs.makerAmount,
      takerAmount: orderArgs.takerAmount,
      expiration: orderArgs.expiration ?? '0',
      nonce: orderArgs.nonce,
      feeRateBps: orderArgs.feeRateBps,
      side: orderArgs.side,
      signatureType: orderArgs.signatureType ?? SignatureType.EOA,
    };

    if (!contractConfig) return;

    const verifyingContract = negRisk
      ? contractConfig.negRiskExchange
      : contractConfig.exchange;

    const typedData = {
      primaryType: 'Order',
      domain: {
        name: 'Polymarket CTF Exchange',
        version: '1',
        chainId: hexToNumber(chainId),
        verifyingContract,
      },
      types: {
        EIP712Domain: [
          ...EIP712Domain,
          { name: 'verifyingContract', type: 'address' },
        ],
        Order: [
          { name: 'salt', type: 'uint256' },
          { name: 'maker', type: 'address' },
          { name: 'signer', type: 'address' },
          { name: 'taker', type: 'address' },
          { name: 'tokenId', type: 'uint256' },
          { name: 'makerAmount', type: 'uint256' },
          { name: 'takerAmount', type: 'uint256' },
          { name: 'expiration', type: 'uint256' },
          { name: 'nonce', type: 'uint256' },
          { name: 'feeRateBps', type: 'uint256' },
          { name: 'side', type: 'uint8' },
          { name: 'signatureType', type: 'uint8' },
        ],
      },
      message: order,
    };

    const signature = await signTypedMessage(
      { data: typedData, from: account?.address ?? '' },
      SignTypedDataVersion.V4,
    );

    const signedOrder = {
      ...order,
      signature,
    };

    const body = JSON.stringify({
      order: {
        ...signedOrder,
        side,
        salt: parseInt(signedOrder.salt, 10),
      },
      owner: apiKey?.key,
      orderType: OrderType.FOK,
    });

    const l2Headers = await createL2Headers({
      method: 'POST',
      requestPath: `/order`,
      body,
    });

    const response = await fetch(`${CLOB_ENDPOINT}/order`, {
      method: 'POST',
      headers: l2Headers,
      body,
    });

    const responseData = await response.json();

    return responseData;
  };

  const redeemPosition = async (position: UserPosition) => {
    if (!contractConfig) return;

    if (!position.redeemable) {
      console.error('Position is not redeemable');
      return;
    }

    const encodedCallData = encodeRedeemPositions({
      collateralToken: contractConfig.collateral,
      parentCollectionId: toBytes32('0x0'),
      conditionId: position.conditionId,
      indexSets: [position.outcomeIndex + 1],
    });

    try {
      const transactionMeta = await addTransaction(
        {
          from: account?.address ?? '',
          to: contractConfig.conditionalTokens,
          data: encodedCallData,
          value: '0x0',
        },
        {
          networkClientId: selectedNetworkClientId,
          type: TransactionType.contractInteraction,
          requireApproval: false,
        },
      );
      return transactionMeta;
    } catch (error) {
      console.error('Error redeeming position', error);
      return;
    }
  };

  const cancelOrder = async (orderId: string) => {
    const body = JSON.stringify({
      orderID: orderId,
    });
    const headers = await createL2Headers({
      method: 'DELETE',
      requestPath: `/order`,
      body,
    });
    const response = await fetch(`${CLOB_ENDPOINT}/order`, {
      method: 'DELETE',
      headers,
      body,
    });
    const responseData = await response.json();
    return responseData;
  };

  return {
    placeOrder,
    redeemPosition,
    cancelOrder,
    isNetworkSupported,
    networkError,
    contractConfig,
  };
};
