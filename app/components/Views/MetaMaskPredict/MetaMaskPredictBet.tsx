import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import Button, {
  ButtonVariants,
  ButtonSize,
  ButtonWidthTypes,
} from '../../../component-library/components/Buttons/Button';
import { useTheme } from '../../../util/theme';
import { Market } from '../../../util/predict/types';
import ethereumImage from '../../../images/ethereum.png';

const GAMMA_API_ENDPOINT = 'https://gamma-api.polymarket.com';

interface MetaMaskPredictBetRouteParams {
  marketId: string;
}

const MetaMaskPredictBet: React.FC = () => {
  const { colors } = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  //   const { marketId } = useParams<{ marketId: string }>();
  const [, setSelectedAmount] = useState<number>(10);
  const [market, setMarket] = useState<Market | null>(null);
  const { marketId } = route.params as MetaMaskPredictBetRouteParams;

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
    },
    buyNoButton: {
      color: colors.text.default,
      backgroundColor: colors.error.default,
      flex: 1,
    },
    buyYesButton: {
      color: colors.text.default,
      backgroundColor: colors.success.default,
      flex: 1,
    },
    amountButton: {
      color: colors.text.default,
      borderWidth: 1,
      borderColor: colors.border.default,
      backgroundColor: colors.background.default,
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
  });

  const getMarket = useCallback(async () => {
    if (!marketId) {
      return;
    }

    const response = await fetch(`${GAMMA_API_ENDPOINT}/markets/${marketId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const marketData = await response.json();
    // await setMarketTitle(marketId, marketData.question);
    setMarket(marketData);
  }, [marketId]);

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
            style={styles.amountButton}
            onPress={() => {
              setSelectedAmount(10);
            }}
            label={`$10`}
          />
          <Button
            variant={ButtonVariants.Link}
            size={ButtonSize.Lg}
            width={ButtonWidthTypes.Auto}
            style={styles.amountButton}
            onPress={() => {
              setSelectedAmount(50);
            }}
            label={`$50`}
          />
          <Button
            variant={ButtonVariants.Link}
            size={ButtonSize.Lg}
            width={ButtonWidthTypes.Auto}
            style={styles.amountButton}
            onPress={() => {
              setSelectedAmount(100);
            }}
            label={`$100`}
          />
          <Button
            variant={ButtonVariants.Link}
            size={ButtonSize.Lg}
            width={ButtonWidthTypes.Auto}
            style={styles.amountButton}
            onPress={() => {
              setSelectedAmount(0);
            }}
            label={`Other`}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            variant={ButtonVariants.Primary}
            size={ButtonSize.Lg}
            width={ButtonWidthTypes.Auto}
            style={styles.buyNoButton}
            onPress={() => {
              setSelectedAmount(0);
            }}
            label={`Buy No`}
          />
          <Button
            variant={ButtonVariants.Primary}
            size={ButtonSize.Lg}
            width={ButtonWidthTypes.Auto}
            style={styles.buyYesButton}
            onPress={() => {
              setSelectedAmount(0);
            }}
            label={`Buy Yes`}
          />
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
