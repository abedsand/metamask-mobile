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
  getContractConfig,
  getPolymarketEndpoints,
} from '../../../../util/predict/constants/polymarket';
import {
  OrderData,
  OrderType,
  PlaceOrderResponse,
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
  getOrderTypedData,
  priceValid,
  toBytes32,
} from '../../../../util/predict/utils/polymarket';
import { addTransaction } from '../../../../util/transaction-controller';
import { usePolymarketAuth } from './usePolymarketAuth';
import Engine from '../../../../core/Engine';

export const usePolymarketApi = () => {
  const account = useSelector(selectSelectedInternalAccount);
  const selectedNetworkClientId = useSelector(selectSelectedNetworkClientId);
  const chainId = useSelector(selectEvmChainId);
  const isPolymarketStaging = useSelector(selectIsPolymarketStaging);
  const { createL2Headers, apiKey, approveCollateralExchange } =
    usePolymarketAuth();
  const [orderResponse, setOrderResponse] = useState<PlaceOrderResponse | null>(
    null,
  );

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
    order,
    negRisk,
    side,
  }: {
    order: OrderData & { salt: string };
    negRisk: boolean;
    side: Side;
  }) => {
    if (!contractConfig) return;

    const verifyingContract = negRisk
      ? contractConfig.negRiskExchange
      : contractConfig.exchange;

    const typedData = getOrderTypedData({
      order,
      chainId,
      verifyingContract,
    });

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

  const addOrder = async ({
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

    const order = await buildMarketOrderCreationArgs({
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

    const allowanceTxMeta = await approveCollateralExchange(
      BigInt(order.makerAmount),
    );

    Engine.controllerMessenger.subscribeOnceIf(
      'TransactionController:transactionConfirmed',
      async () => {
        const orderTxMeta = await placeOrder({ order, negRisk, side });
        setOrderResponse(orderTxMeta as PlaceOrderResponse);
      },
      (transactionMeta) =>
        transactionMeta.id === allowanceTxMeta?.transactionMeta.id,
    );
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
    addOrder,
    placeOrder,
    redeemPosition,
    cancelOrder,
    isNetworkSupported,
    networkError,
    orderResponse,
  };
};
