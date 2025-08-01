import { SignTypedDataVersion } from '@metamask/keyring-controller';
import { TransactionType } from '@metamask/transaction-controller';
import { hexToNumber } from '@metamask/utils';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectSelectedInternalAccount } from '../../../../selectors/accountsController';
import {
  selectEvmChainId,
  selectSelectedNetworkClientId,
} from '../../../../selectors/networkController';
import { selectIsPolymarketStaging } from '../../../../selectors/predict';
import StorageWrapper from '../../../../store/storage-wrapper';
import { signTypedMessage } from '../../../../util/keyring-controller';
import {
  buildPolyHmacSignature,
  encodeApprove,
  encodeErc1155Approve,
  getPolymarketEndpoints,
} from '../../../../util/predict/utils/polymarket';
import { addTransaction } from '../../../../util/transaction-controller';

import {
  ApiKeyCreds,
  ApiKeyRaw,
  L2HeaderArgs,
} from '../../../../util/predict/types';
import {
  API_KEY_STORAGE_KEY,
  ClobAuthDomain,
  EIP712Domain,
  getContractConfig,
  MSG_TO_SIGN,
} from '../../constants';

export const usePolymarketAuth = () => {
  const account = useSelector(selectSelectedInternalAccount);
  const selectedNetworkClientId = useSelector(selectSelectedNetworkClientId);
  const chainId = useSelector(selectEvmChainId);
  const isPolymarketStaging = useSelector(selectIsPolymarketStaging);

  // Get dynamic endpoints based on staging state
  const { CLOB_ENDPOINT } = getPolymarketEndpoints(isPolymarketStaging);

  const contractConfig = useMemo(() => {
    try {
      return getContractConfig(hexToNumber(chainId));
    } catch (error) {
      return null;
    }
  }, [chainId]);

  const [apiKeyStorage, setApiKeyStorage] = useState<Record<
    string,
    ApiKeyCreds
  > | null>(null);

  // Load apiKeyStorage from StorageWrapper on mount
  useEffect(() => {
    (async () => {
      const stored = await StorageWrapper.getItem(API_KEY_STORAGE_KEY);
      setApiKeyStorage(stored ? JSON.parse(stored) : null);
    })();
  }, [account?.address]);

  const apiKey = useMemo(() => {
    if (apiKeyStorage) {
      return apiKeyStorage[account?.address ?? ''];
    }
    return null;
  }, [apiKeyStorage, account?.address]);

  const getL1Headers = async () => {
    const domain = {
      name: 'ClobAuthDomain',
      version: '1',
      chainId: hexToNumber(chainId),
    };

    const types = {
      EIP712Domain,
      ...ClobAuthDomain,
    };

    const message = {
      address: account?.address ?? '',
      timestamp: `${Math.floor(Date.now() / 1000)}`,
      nonce: 0,
      message: MSG_TO_SIGN,
    };

    const signature = await signTypedMessage(
      {
        data: {
          domain,
          types,
          message,
          primaryType: 'ClobAuth',
        },
        from: account?.address ?? '',
      },
      SignTypedDataVersion.V4,
    );

    const headers = {
      POLY_ADDRESS: account?.address ?? '',
      POLY_SIGNATURE: signature,
      POLY_TIMESTAMP: `${message.timestamp}`,
      POLY_NONCE: `${message.nonce}`,
    };

    return headers;
  };

  const storeApiKey = async (apiKeyRaw: ApiKeyRaw) => {
    const newApiKey = {
      key: apiKeyRaw.apiKey,
      secret: apiKeyRaw.secret,
      passphrase: apiKeyRaw.passphrase,
    };
    const currentApiKeyStorage = await StorageWrapper.getItem(
      API_KEY_STORAGE_KEY,
    );
    let currentApiKeyStorageObject: { [key: string]: ApiKeyCreds } = {};
    if (currentApiKeyStorage) {
      currentApiKeyStorageObject = JSON.parse(currentApiKeyStorage);
    }
    currentApiKeyStorageObject[account?.address ?? ''] = newApiKey;
    await StorageWrapper.setItem(
      API_KEY_STORAGE_KEY,
      JSON.stringify(currentApiKeyStorageObject),
    );
    // Update state
    setApiKeyStorage(currentApiKeyStorageObject);
    return newApiKey;
  };

  const deriveApiKey = async () => {
    const headers = await getL1Headers();
    const response = await fetch(`${CLOB_ENDPOINT}/auth/derive-api-key`, {
      method: 'GET',
      headers,
    });
    const apiKeyRaw = await response.json();
    return await storeApiKey(apiKeyRaw);
  };

  const createApiKey = async () => {
    const headers = await getL1Headers();
    const response = await fetch(`${CLOB_ENDPOINT}/auth/api-key`, {
      method: 'POST',
      headers,
      body: '',
    });

    if (response.status === 400) {
      return await deriveApiKey();
    }
    const apiKeyRaw = await response.json();
    await storeApiKey(apiKeyRaw);
    return apiKeyRaw;
  };

  const createL2Headers = async (
    l2HeaderArgs: L2HeaderArgs,
    timestamp?: number,
  ) => {
    let ts = Math.floor(Date.now() / 1000);
    if (timestamp !== undefined) {
      ts = timestamp;
    }
    const { address } = account ?? {};

    const sig = await buildPolyHmacSignature(
      apiKey?.secret || '',
      ts,
      l2HeaderArgs.method,
      l2HeaderArgs.requestPath,
      l2HeaderArgs.body,
    );

    const headers = {
      POLY_ADDRESS: address ?? '',
      POLY_SIGNATURE: sig,
      POLY_TIMESTAMP: `${ts}`,
      POLY_API_KEY: apiKey?.key || '',
      POLY_PASSPHRASE: apiKey?.passphrase || '',
    };

    return headers;
  };

  const approveCollateralExchange = async (amount?: bigint) => {
    if (!contractConfig) return;

    const encodedCallData = encodeApprove({
      spender: contractConfig.exchange,
      amount: amount ?? 100n * 1_000_000n, // 100 USDC as BigInt with 6 decimals
    });

    const transactionMeta = await addTransaction(
      {
        from: account?.address ?? '',
        to: contractConfig.collateral,
        data: encodedCallData,
        value: '0x0',
      },
      {
        networkClientId: selectedNetworkClientId,
        type: TransactionType.tokenMethodApprove,
        requireApproval: false,
      },
    );

    return transactionMeta;
  };

  const approveCollateralConditionalToken = async () => {
    if (!contractConfig) return;

    const encodedCallData = encodeApprove({
      spender: contractConfig.conditionalTokens,
      amount: 100n * 1_000_000n, // 100 USDC as BigInt with 6 decimals
    });

    const transactionMeta = await addTransaction(
      {
        from: account?.address ?? '',
        to: contractConfig.collateral,
        data: encodedCallData,
        value: '0x0',
      },
      {
        networkClientId: selectedNetworkClientId,
        type: TransactionType.tokenMethodApprove,
        requireApproval: false,
      },
    );

    return transactionMeta;
  };

  const approveConditionalExchange = async () => {
    if (!contractConfig) return;

    const encodedCallData = encodeErc1155Approve({
      spender: contractConfig.exchange,
      approved: true,
    });

    const transactionMeta = await addTransaction(
      {
        from: account?.address ?? '',
        to: contractConfig.conditionalTokens,
        data: encodedCallData,
        value: '0x0',
      },
      {
        networkClientId: selectedNetworkClientId,
        type: TransactionType.tokenMethodApprove,
        requireApproval: false,
      },
    );

    return transactionMeta;
  };

  const approveCollateralNegRiskExchange = async () => {
    if (!contractConfig) return;

    const encodedCallData = encodeApprove({
      spender: contractConfig.negRiskExchange,
      amount: 100n * 1_000_000n, // 100 USDC as BigInt with 6 decimals
    });

    const transactionMeta = await addTransaction(
      {
        from: account?.address ?? '',
        to: contractConfig.collateral,
        data: encodedCallData,
        value: '0x0',
      },
      {
        networkClientId: selectedNetworkClientId,
        type: TransactionType.tokenMethodApprove,
        requireApproval: false,
      },
    );

    return transactionMeta;
  };

  const approveNegRiskAdapterToken = async () => {
    if (!contractConfig) return;

    const encodedCallData = encodeApprove({
      spender: contractConfig.negRiskAdapter,
      amount: 10n * 1_000_000n, // 10 USDC as BigInt with 6 decimals
    });

    const transactionMeta = await addTransaction(
      {
        from: account?.address ?? '',
        to: contractConfig.collateral,
        data: encodedCallData,
        value: '0x0',
      },
      {
        networkClientId: selectedNetworkClientId,
        type: TransactionType.tokenMethodApprove,
        requireApproval: false,
      },
    );

    return transactionMeta;
  };

  const approveConditionalNegRiskExchange = async () => {
    if (!contractConfig) return;

    const encodedCallData = encodeErc1155Approve({
      spender: contractConfig.negRiskExchange,
      approved: true,
    });

    const transactionMeta = await addTransaction(
      {
        from: account?.address ?? '',
        to: contractConfig.conditionalTokens,
        data: encodedCallData,
        value: '0x0',
      },
      {
        networkClientId: selectedNetworkClientId,
        type: TransactionType.tokenMethodApprove,
        requireApproval: false,
      },
    );

    return transactionMeta;
  };

  const approveConditionalNegRiskAdapter = async () => {
    if (!contractConfig) return;

    const encodedCallData = encodeErc1155Approve({
      spender: contractConfig.negRiskAdapter,
      approved: true,
    });

    const transactionMeta = await addTransaction(
      {
        from: account?.address ?? '',
        to: contractConfig.conditionalTokens,
        data: encodedCallData,
        value: '0x0',
      },
      {
        networkClientId: selectedNetworkClientId,
        type: TransactionType.tokenMethodApprove,
        requireApproval: false,
      },
    );

    return transactionMeta;
  };

  const approveAllowances = async () => {
    await approveCollateralConditionalToken();
    await approveCollateralExchange();
    await approveConditionalExchange();
    await approveCollateralNegRiskExchange();
    await approveNegRiskAdapterToken();
    await approveConditionalNegRiskExchange();
    await approveConditionalNegRiskAdapter();
  };

  return {
    createApiKey,
    deriveApiKey,
    approveAllowances,
    approveCollateralExchange,
    createL2Headers,
    apiKey,
  };
};
