import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import BigNumber from 'bignumber.js';

import Button, {
  ButtonVariants,
  ButtonSize,
  ButtonWidthTypes,
} from '../../../component-library/components/Buttons/Button';
import { useTheme } from '../../../util/theme';
import ButtonIcon, {
  ButtonIconSizes,
} from '../../../component-library/components/Buttons/ButtonIcon';
import { IconName } from '../../../component-library/components/Icons/Icon';
import { WalletViewSelectorsIDs } from '../../../../e2e/selectors/wallet/WalletView.selectors';

const GAMMA_API_ENDPOINT = 'https://gamma-api.polymarket.com';

const MetaMaskPredict = () => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [marketData, setMarketData] = useState([]);

  const getMarkets = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${GAMMA_API_ENDPOINT}/markets?limit=5&closed=false&active=true&tag_id=51`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const marketsData = await response.json();
      console.log('marketsData', marketsData);
      setMarketData(marketsData);
    } catch (error) {
      console.error('Error fetching trades:', error);
      setMarketData([]);
    } finally {
      setLoading(false);
    }
  };

  const getDaysLeft = (endDateString: string) => {
    if (!endDateString) {
      return '';
    }
    const endDate = new Date(endDateString);
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days}D left`;
  };

  const calculateVolume = (value: string | number | undefined) =>
    value ? new BigNumber(value).toNumber().toFixed(2) : '0.00';

  useEffect(() => {
    getMarkets();
  }, []);

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
    content: {
      flex: 1,
    },
    placeholderText: {
      fontSize: 16,
      color: colors.text.alternative,
      textAlign: 'center',
    },
    navigation: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
      gap: 12,
      marginTop: 20,
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
    buttons: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 20,
      gap: 12,
    },
    buttonCirclarBorder: {
      borderRadius: 100,
      padding: 24,
      backgroundColor: colors.background.muted,
    },
    marketContainer: {
      alignSelf: 'flex-start',
      width: '100%',
      marginBottom: 20,
    },
    scrollableContainer: {
      flex: 1,
      marginTop: 20,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Markets</Text>
        <Text style={styles.placeholderText}>Explore the current markets</Text>
        <View style={styles.navigation}>
          <ButtonIcon
            testID={WalletViewSelectorsIDs.SORT_BY}
            size={ButtonIconSizes.Lg}
            onPress={() => {}}
            iconName={IconName.Storefront}
            style={styles.buttonCirclarBorder}
          />
          <ButtonIcon
            testID={WalletViewSelectorsIDs.SORT_BY}
            size={ButtonIconSizes.Lg}
            onPress={() => {}}
            iconName={IconName.Bank}
            style={styles.buttonCirclarBorder}
          />
          <ButtonIcon
            testID={WalletViewSelectorsIDs.SORT_BY}
            size={ButtonIconSizes.Lg}
            onPress={() => {}}
            iconName={IconName.Chart}
            style={styles.buttonCirclarBorder}
          />
          <ButtonIcon
            testID={WalletViewSelectorsIDs.SORT_BY}
            size={ButtonIconSizes.Lg}
            onPress={() => {}}
            iconName={IconName.Money}
            style={styles.buttonCirclarBorder}
          />
          <ButtonIcon
            testID={WalletViewSelectorsIDs.SORT_BY}
            size={ButtonIconSizes.Lg}
            onPress={() => {}}
            iconName={IconName.Setting}
            style={styles.buttonCirclarBorder}
          />
        </View>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <ScrollView
            style={styles.scrollableContainer}
            showsVerticalScrollIndicator={false}
          >
            {marketData.map((market: any) => (
              <View key={market.id}>
                <View style={styles.marketContainer}>
                  <Text style={styles.marketTitle}>{market.question}</Text>
                  <Text style={styles.marketPricing}>
                    {getDaysLeft(market.endDate)}&nbsp;$
                    {calculateVolume(market.volume)} VolVol
                  </Text>
                  <View style={styles.buttons}>
                    <Button
                      variant={ButtonVariants.Primary}
                      size={ButtonSize.Lg}
                      width={ButtonWidthTypes.Auto}
                      style={styles.buyNoButton}
                      onPress={() => {}}
                      label={`Buy No`}
                    />
                    <Button
                      variant={ButtonVariants.Primary}
                      size={ButtonSize.Lg}
                      width={ButtonWidthTypes.Auto}
                      style={styles.buyYesButton}
                      onPress={() => {}}
                      label={`Buy Yes`}
                    />
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default MetaMaskPredict;
