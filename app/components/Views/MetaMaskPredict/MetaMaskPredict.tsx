import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import BigNumber from 'bignumber.js';
import { useNavigation } from '@react-navigation/native';

import Button, {
  ButtonVariants,
  ButtonSize,
  ButtonWidthTypes,
} from '../../../component-library/components/Buttons/Button';
import { useTheme } from '../../../util/theme';
import NavigationBar, { NavigationIcon } from './NavigationBar';
import Routes from '../../../constants/navigation/Routes';
import { Market } from '../../../util/predict/types';
import { usePolymarket } from '../../../util/predict/hooks/usePolymarket';

import { GAMMA_API_ENDPOINT } from '../../../util/predict/constants/polymarket';
interface MetaMaskPredictProps {
  selectedIcon?: NavigationIcon;
  onNavigate?: (icon: NavigationIcon) => void;
}

const MetaMaskPredict: React.FC<MetaMaskPredictProps> = ({
  selectedIcon: propSelectedIcon,
  onNavigate,
}) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [marketData, setMarketData] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState<NavigationIcon>(
    propSelectedIcon || NavigationIcon.Storefront,
  );
  const { apiKey, createApiKey, isNetworkSupported, networkError } = usePolymarket();

  React.useEffect(() => {
    if (propSelectedIcon) {
      setSelectedIcon(propSelectedIcon);
    }
  }, [propSelectedIcon]);

  const getMarkets = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${GAMMA_API_ENDPOINT}/markets?limit=5&closed=false&active=true`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const marketsData = await response.json();
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
    marketContainer: {
      alignSelf: 'flex-start',
      width: '100%',
      marginBottom: 20,
    },
    scrollableContainer: {
      flex: 1,
      marginTop: 20,
    },
    noApiKeyContainer: {
      flex: 1,
      alignItems: 'center',
      gap: 12,
    },
  });

  if (!isNetworkSupported) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.noApiKeyContainer}>
            <Text style={styles.title}>Markets</Text>
            <Text style={styles.placeholderText}>
              {networkError || 'Polymarket is not available on this network'}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  if (!apiKey) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.noApiKeyContainer}>
            <Text style={styles.title}>Markets</Text>
            <Text style={styles.placeholderText}>
              Enable Predict to explore the current markets
            </Text>
            <Button
              variant={ButtonVariants.Primary}
              size={ButtonSize.Lg}
              width={ButtonWidthTypes.Auto}
              onPress={() => createApiKey()}
              label={`Enable Predict`}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Markets</Text>
        <Text style={styles.placeholderText}>Explore the current markets</Text>
        <NavigationBar
          selectedIcon={selectedIcon}
          onIconPress={setSelectedIcon}
          onNavigate={onNavigate}
        />
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <ScrollView
            style={styles.scrollableContainer}
            showsVerticalScrollIndicator={false}
          >
            {marketData.map((market: Market) => (
              <View key={market.id}>
                <View style={styles.marketContainer}>
                  <Text style={styles.marketTitle}>{market.question}</Text>
                  <Text style={styles.marketPricing}>
                    {getDaysLeft(market.endDate)}&nbsp;$
                    {calculateVolume(market.volume)} Vol
                  </Text>
                  <View style={styles.buttons}>
                    <Button
                      variant={ButtonVariants.Primary}
                      size={ButtonSize.Lg}
                      width={ButtonWidthTypes.Auto}
                      style={styles.buyNoButton}
                      onPress={() =>
                        navigation.navigate(Routes.PREDICT_BET, {
                          marketId: market.conditionId,
                        })
                      }
                      label={`Buy No`}
                    />
                    <Button
                      variant={ButtonVariants.Primary}
                      size={ButtonSize.Lg}
                      width={ButtonWidthTypes.Auto}
                      style={styles.buyYesButton}
                      onPress={() =>
                        navigation.navigate(Routes.PREDICT_BET, {
                          marketId: market.conditionId,
                        })
                      }
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
