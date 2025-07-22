import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import Button, {
  ButtonVariants,
  ButtonSize,
  ButtonWidthTypes,
} from '../../../component-library/components/Buttons/Button';
import { useTheme } from '../../../util/theme';
import {
  Market,
  OrderSummary,
  Side,
  TickSize,
  Token,
} from '../../../util/predict/types';
import ethereumImage from '../../../images/ethereum.png';
import { usePolymarket } from '../../../util/predict/hooks/usePolymarket';
import { CLOB_ENDPOINT } from '../../../util/predict/constants';
import Routes from '../../../constants/navigation/Routes';
import {
  calculatePotentialProfit,
  getOrderBook,
} from '../../../util/predict/utils/polymarket';

interface MetaMaskPredictBetRouteParams {
  marketId: string;
}

const MetaMaskPredictBet: React.FC = () => {
  const { colors } = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const [selectedAmount, setSelectedAmount] = useState<number>(1);
  const [market, setMarket] = useState<Market | null>(null);
  const { placeOrder } = usePolymarket();
  const { marketId } = route.params as MetaMaskPredictBetRouteParams;
  const [isBuying, setIsBuying] = useState<boolean>(false);
  const [orderBooks, setOrderBooks] = useState<
    { asks?: OrderSummary[]; bids?: OrderSummary[] }[]
  >([]);

  useEffect(() => {
    const fetchOrderBooks = async () => {
      if (!market?.tokens) return;
      const orderBooksData = (await Promise.all(
        market.tokens.map((token: Token) => getOrderBook(token.token_id)),
      )) as { asks?: OrderSummary[]; bids?: OrderSummary[] }[];
      setOrderBooks(orderBooksData);
    };
    fetchOrderBooks();
  }, [market]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.default,
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text.default,
      textAlign: 'center',
      marginTop: 42,
      marginBottom: 12,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    placeholderText: {
      fontSize: 16,
      color: colors.text.alternative,
      textAlign: 'center',
      marginBottom: 20,
    },
    backButton: {
      marginTop: 20,
    },
    buttons: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 20,
      gap: 12,
      display: 'flex',
    },
    buyNoButton: {
      color: colors.text.default,
      backgroundColor: colors.error.default,
    },
    buyYesButton: {
      color: colors.text.default,
      backgroundColor: colors.success.default,
    },
    amountButton: {
      color: colors.text.default,
      borderWidth: 1,
      borderColor: colors.border.default,
      backgroundColor: colors.background.default,
      flex: 1,
    },
    amountButtonSelected: {
      color: colors.text.default,
      borderWidth: 1,
      borderColor: colors.border.default,
      backgroundColor: colors.background.pressed,
      flex: 1,
    },
    marketContainer: {
      backgroundColor: colors.background.pressed,
      padding: 12,
      borderRadius: 12,
      alignSelf: 'flex-start',
      width: '100%',
      marginBottom: 20,
    },
    tokenContainer: {
      backgroundColor: colors.background.pressed,
      padding: 12,
      borderRadius: 12,
      alignSelf: 'flex-start',
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
    },
    tokenTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text.default,
      textAlign: 'left',
    },
    marketTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text.default,
      textAlign: 'left',
      marginBottom: 6,
    },
    marketPricing: {
      fontSize: 14,
      color: colors.text.alternative,
      textAlign: 'left',
    },
    tokenImage: {
      width: 24,
      height: 24,
      marginRight: 8,
    },
    tokenView: {
      flexDirection: 'column',
      width: '100%',
      alignItems: 'center',
      flex: 1,
    },
    potentialProfit: {
      fontSize: 12,
      color: colors.text.alternative,
      textAlign: 'left',
    },
  });

  const getMarket = useCallback(async () => {
    if (!marketId) {
      return;
    }

    const response = await fetch(`${CLOB_ENDPOINT}/markets/${marketId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const marketData = await response.json();
    // await setMarketTitle(marketId, marketData.question);
    setMarket(marketData);
  }, [marketId]);

  const handleBuy = useCallback(
    async (token: Token) => {
      if (!market) {
        return;
      }
      setIsBuying(true);
      try {
        const response = await placeOrder({
          tokenId: token.token_id,
          min_size: Number(market?.minimum_order_size),
          tickSize: market?.minimum_tick_size as TickSize,
          side: Side.BUY,
          negRisk: market?.neg_risk || false,
          amount: selectedAmount,
        });
        if (response.error) {
          Alert.alert('Error', response.error);
          setIsBuying(false);
          return;
        }
        if (response.status === 'live') {
          navigation.navigate(Routes.PREDICT_VIEW);
        }
        if (response.status === 'matched') {
          navigation.navigate(Routes.PREDICT_VIEW);
        }
        setIsBuying(false);
      } catch (error) {
        Alert.alert('Error', (error as Error).message);
        setIsBuying(false);
      }
    },
    [market, navigation, placeOrder, selectedAmount],
  );

  useEffect(() => {
    getMarket();
  }, [getMarket]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Place Bet</Text>
        <Text style={styles.placeholderText}>
          Select an amount and the outcome you think will happen to bet on this
          prediction market.
        </Text>
        <View style={styles.marketContainer}>
          <Text style={styles.marketTitle}>
            {market && `${market.question}`}
          </Text>
          <Text style={styles.marketPricing}>
            321 days left&nbsp;$321.00 Vol
          </Text>
        </View>
        <View style={styles.tokenContainer}>
          <Image source={ethereumImage} style={styles.tokenImage} />
          <Text style={styles.tokenTitle}>USDC</Text>
        </View>
        <View style={styles.buttons}>
          <Button
            variant={ButtonVariants.Link}
            size={ButtonSize.Lg}
            width={ButtonWidthTypes.Auto}
            style={
              selectedAmount === 1
                ? styles.amountButtonSelected
                : styles.amountButton
            }
            onPress={() => {
              setSelectedAmount(1);
            }}
            label={`$1`}
          />
          <Button
            variant={ButtonVariants.Link}
            size={ButtonSize.Lg}
            width={ButtonWidthTypes.Auto}
            style={
              selectedAmount === 5
                ? styles.amountButtonSelected
                : styles.amountButton
            }
            onPress={() => {
              setSelectedAmount(5);
            }}
            label={`$5`}
          />
          <Button
            variant={ButtonVariants.Link}
            size={ButtonSize.Lg}
            width={ButtonWidthTypes.Auto}
            style={
              selectedAmount === 10
                ? styles.amountButtonSelected
                : styles.amountButton
            }
            onPress={() => {
              setSelectedAmount(10);
            }}
            label={`$10`}
          />
          <Button
            variant={ButtonVariants.Link}
            size={ButtonSize.Lg}
            width={ButtonWidthTypes.Auto}
            style={
              selectedAmount === 0
                ? styles.amountButtonSelected
                : styles.amountButton
            }
            onPress={() => {
              setSelectedAmount(0);
            }}
            label={`Other`}
          />
        </View>
        <View style={styles.buttons}>
          {market?.tokens ? (
            market.tokens.map((token: Token, index: number) => (
              <View key={token.token_id} style={styles.tokenView}>
                <Button
                  variant={ButtonVariants.Primary}
                  size={ButtonSize.Lg}
                  width={ButtonWidthTypes.Full}
                  style={
                    token.outcome === 'Yes'
                      ? styles.buyYesButton
                      : styles.buyNoButton
                  }
                  onPress={() => handleBuy(token)}
                  label={`Buy ${token.outcome}: $${token.price}`}
                  loading={isBuying}
                />
                {orderBooks[index] && (
                  <Text style={styles.potentialProfit}>
                    Potential Profit: $
                    {calculatePotentialProfit(
                      orderBooks[index],
                      Side.BUY,
                      selectedAmount,
                    ).potentialProfit.toFixed(2)}
                  </Text>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.placeholderText}>Loading tokens...</Text>
          )}
        </View>
        <Button
          variant={ButtonVariants.Link}
          size={ButtonSize.Lg}
          width={ButtonWidthTypes.Full}
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          label="Cancel"
        />
      </View>
    </View>
  );
};

export default MetaMaskPredictBet;
