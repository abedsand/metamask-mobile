import { Interface } from '@ethersproject/abi';
import { Hex } from '@metamask/utils';
import { parseUnits } from 'ethers/lib/utils';

import { OrderData, RoundConfig, SignatureType } from '../types';
import {
  OrderSummary,
  OrderType,
  Side,
  TickSize,
  UserMarketOrder,
  UserPosition,
  UtilsSide,
} from '../types/polymarket';
import {
  CLOB_ENDPOINT,
  COLLATERAL_TOKEN_DECIMALS,
  DATA_API_ENDPOINT,
} from '../constants';

export const encodeApprove = ({
  spender,
  amount,
}: {
  spender: string;
  amount: bigint | string;
}): Hex =>
  new Interface([
    'function approve(address spender, uint256 amount)',
  ]).encodeFunctionData('approve', [spender, amount]) as Hex;

export const encodeErc1155Approve = ({
  spender,
  approved,
}: {
  spender: string;
  approved: boolean;
}): Hex =>
  new Interface([
    'function setApprovalForAll(address operator, bool approved)',
  ]).encodeFunctionData('setApprovalForAll', [spender, approved]) as Hex;

export const encodeRedeemPositions = ({
  collateralToken,
  parentCollectionId,
  conditionId,
  indexSets,
}: {
  collateralToken: string;
  parentCollectionId: string;
  conditionId: string;
  indexSets: (bigint | string | number)[];
}): Hex =>
  new Interface([
    'function redeemPositions(address collateralToken, bytes32 parentCollectionId, bytes32 conditionId, uint256[] indexSets)',
  ]).encodeFunctionData('redeemPositions', [
    collateralToken,
    parentCollectionId,
    conditionId,
    indexSets,
  ]) as Hex;

export const generateSalt = (): Hex =>
  `0x${BigInt(Math.floor(Math.random() * 1000000)).toString(16)}`;

function replaceAll(s: string, search: string, replace: string) {
  return s.split(search).join(replace);
}

/**
 * Builds the canonical Polymarket CLOB HMAC signature
 *
 * @param secret
 * @param timestamp
 * @param method
 * @param requestPath
 * @param body
 * @returns string
 */
export const buildPolyHmacSignature = async (
  secret: string,
  timestamp: number,
  method: string,
  requestPath: string,
  body?: string,
): Promise<string> => {
  let message = timestamp + method + requestPath;
  if (body !== undefined) {
    message += body;
  }
  const base64Secret = Buffer.from(secret, 'base64');
  // @ts-expect-error - createHmac is not available in the type definitions
  const hmac = global.crypto.createHmac('sha256', base64Secret);
  const sig = hmac.update(message).digest('base64');

  // NOTE: Must be url safe base64 encoding, but keep base64 "=" suffix
  // Convert '+' to '-'
  // Convert '/' to '_'
  const sigUrlSafe = replaceAll(replaceAll(sig, '+', '-'), '/', '_');
  return sigUrlSafe;
};

export const decimalPlaces = (num: number): number => {
  if (Number.isInteger(num)) {
    return 0;
  }

  const arr = num.toString().split('.');
  if (arr.length <= 1) {
    return 0;
  }

  return arr[1].length;
};

export const roundNormal = (num: number, decimals: number): number => {
  if (decimalPlaces(num) <= decimals) {
    return num;
  }
  return Math.round((num + Number.EPSILON) * 10 ** decimals) / 10 ** decimals;
};

export const roundDown = (num: number, decimals: number): number => {
  if (decimalPlaces(num) <= decimals) {
    return num;
  }
  return Math.floor(num * 10 ** decimals) / 10 ** decimals;
};

export const roundUp = (num: number, decimals: number): number => {
  if (decimalPlaces(num) <= decimals) {
    return num;
  }
  return Math.ceil(num * 10 ** decimals) / 10 ** decimals;
};

export const priceValid = (price: number, tickSize: TickSize): boolean =>
  price >= parseFloat(tickSize) && price <= 1 - parseFloat(tickSize);

export const getMarketOrderRawAmounts = (
  side: Side,
  amount: number,
  price: number,
  roundConfig: RoundConfig,
): { side: UtilsSide; rawMakerAmt: number; rawTakerAmt: number } => {
  // force 2 decimals places
  const rawPrice = roundDown(price, roundConfig.price);

  if (side === Side.BUY) {
    const rawMakerAmt = roundDown(amount, roundConfig.size);
    let rawTakerAmt = rawMakerAmt / rawPrice;
    if (decimalPlaces(rawTakerAmt) > roundConfig.amount) {
      rawTakerAmt = roundUp(rawTakerAmt, roundConfig.amount + 4);
      if (decimalPlaces(rawTakerAmt) > roundConfig.amount) {
        rawTakerAmt = roundDown(rawTakerAmt, roundConfig.amount);
      }
    }
    return {
      side: UtilsSide.BUY,
      rawMakerAmt,
      rawTakerAmt,
    };
  }
  const rawMakerAmt = roundDown(amount, roundConfig.size);
  let rawTakerAmt = rawMakerAmt * rawPrice;
  if (decimalPlaces(rawTakerAmt) > roundConfig.amount) {
    rawTakerAmt = roundUp(rawTakerAmt, roundConfig.amount + 4);
    if (decimalPlaces(rawTakerAmt) > roundConfig.amount) {
      rawTakerAmt = roundDown(rawTakerAmt, roundConfig.amount);
    }
  }

  return {
    side: UtilsSide.SELL,
    rawMakerAmt,
    rawTakerAmt,
  };
};

/**
 * Translate simple user market order to args used to generate Orders
 */
export const buildMarketOrderCreationArgs = async ({
  signer,
  maker,
  signatureType,
  userMarketOrder,
  roundConfig,
}: {
  signer: string;
  maker: string;
  signatureType: SignatureType;
  userMarketOrder: UserMarketOrder;
  roundConfig: RoundConfig;
}): Promise<OrderData> => {
  const { side, rawMakerAmt, rawTakerAmt } = getMarketOrderRawAmounts(
    userMarketOrder.side,
    userMarketOrder.amount,
    userMarketOrder.price || 1,
    roundConfig,
  );

  const makerAmount = parseUnits(
    rawMakerAmt.toString(),
    COLLATERAL_TOKEN_DECIMALS,
  ).toString();
  const takerAmount = parseUnits(
    rawTakerAmt.toString(),
    COLLATERAL_TOKEN_DECIMALS,
  ).toString();

  let taker;
  if (typeof userMarketOrder.taker !== 'undefined' && userMarketOrder.taker) {
    taker = userMarketOrder.taker;
  } else {
    taker = '0x0000000000000000000000000000000000000000';
  }

  let feeRateBps;
  if (
    typeof userMarketOrder.feeRateBps !== 'undefined' &&
    userMarketOrder.feeRateBps
  ) {
    feeRateBps = userMarketOrder.feeRateBps.toString();
  } else {
    feeRateBps = '0';
  }

  let nonce;
  if (typeof userMarketOrder.nonce !== 'undefined' && userMarketOrder.nonce) {
    nonce = userMarketOrder.nonce.toString();
  } else {
    nonce = '0';
  }

  return {
    maker,
    taker,
    tokenId: userMarketOrder.tokenID,
    makerAmount,
    takerAmount,
    side,
    feeRateBps,
    nonce,
    signer,
    expiration: '0',
    signatureType,
  } as OrderData;
};

const getOrderBook = async (tokenID: string) => {
  const response = await fetch(`${CLOB_ENDPOINT}/book?token_id=${tokenID}`, {
    method: 'GET',
  });
  const responseData = await response.json();
  return responseData;
};

/**
 * calculateBuyMarketPrice calculates the market price to buy a $$ amount
 * @param positions
 * @param amountToMatch worth to buy
 * @returns
 */
export const calculateBuyMarketPrice = (
  positions: OrderSummary[],
  amountToMatch: number,
  orderType: OrderType,
) => {
  if (!positions.length) {
    throw new Error('no match');
  }
  let sum = 0;
  /*
  Asks:
  [
      { price: '0.6', size: '100' },
      { price: '0.55', size: '100' },
      { price: '0.5', size: '100' }
  ]
  So, if the amount to match is $150 that will be reached at first position so price will be 0.6
  */
  for (let i = positions.length - 1; i >= 0; i--) {
    const p = positions[i];
    sum += parseFloat(p.size) * parseFloat(p.price);
    if (sum >= amountToMatch) {
      return parseFloat(p.price);
    }
  }
  if (orderType === OrderType.FOK) {
    throw new Error('no match');
  }
  return parseFloat(positions[0].price);
};

/**
 * calculateSellMarketPrice calculates the market price to sell a shares
 * @param positions
 * @param amountToMatch sells to share
 * @returns
 */
export const calculateSellMarketPrice = (
  positions: OrderSummary[],
  amountToMatch: number,
  orderType: OrderType,
) => {
  if (!positions.length) {
    throw new Error('no match');
  }
  let sum = 0;
  /*
  Bids:
  [
      { price: '0.4', size: '100' },
      { price: '0.45', size: '100' },
      { price: '0.5', size: '100' }
  ]
  So, if the amount to match is 300 that will be reached at the first position so price will be 0.4
  */
  for (let i = positions.length - 1; i >= 0; i--) {
    const p = positions[i];
    sum += parseFloat(p.size);
    if (sum >= amountToMatch) {
      return parseFloat(p.price);
    }
  }
  if (orderType === OrderType.FOK) {
    throw new Error('no match');
  }
  return parseFloat(positions[0].price);
};

export const calculateMarketPrice = async (
  tokenID: string,
  side: Side,
  amount: number,
  orderType: OrderType = OrderType.FOK,
): Promise<number> => {
  const book = await getOrderBook(tokenID);
  if (!book) {
    throw new Error('no orderbook');
  }
  if (side === Side.BUY) {
    if (!book.asks) {
      throw new Error('no match');
    }
    return calculateBuyMarketPrice(book.asks, amount, orderType);
  }
  if (!book.bids) {
    throw new Error('no match');
  }
  return calculateSellMarketPrice(book.bids, amount, orderType);
};

export const getPositions = async ({
  address,
  limit = 10,
}: {
  address: string;
  limit?: number;
}): Promise<UserPosition[]> => {
  const response = await fetch(
    `${DATA_API_ENDPOINT}/positions?limit=${limit}&user=${address}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  const positionsData = await response.json();
  return positionsData;
};

export const getTickSize = async (tokenID: string) => {
  const response = await fetch(
    `${CLOB_ENDPOINT}/tick-size?token_id=${tokenID}`,
    {
      method: 'GET',
    },
  );
  const responseData = await response.json();
  return responseData;
};
