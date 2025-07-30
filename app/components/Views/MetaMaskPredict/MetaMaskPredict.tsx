import { useNavigation } from '@react-navigation/native';
import BigNumber from 'bignumber.js';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import Button, {
  ButtonSize,
  ButtonVariants,
  ButtonWidthTypes,
} from '../../../component-library/components/Buttons/Button';
import SelectComponent from '../../../components/UI/SelectComponent';
import Routes from '../../../constants/navigation/Routes';
import { Market } from '../../../util/predict/types';
import { useTheme } from '../../../util/theme';
import NavigationBar, { NavigationIcon } from './NavigationBar';

import { selectIsPolymarketStaging } from '../../../selectors/predict';
import {
  POLYMARKET_STAGING_CONSTS,
  getPolymarketEndpoints,
} from '../../../util/predict/constants/polymarket';
import {
  usePolymarketApi,
  usePolymarketAuth,
} from '../../../util/predict/hooks';

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
  const isPolymarketStaging = useSelector(selectIsPolymarketStaging);
  const { GAMMA_API_ENDPOINT } = getPolymarketEndpoints(isPolymarketStaging);
  const [loading, setLoading] = useState(false);
  const [marketData, setMarketData] = useState([]); // useState<any[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<NavigationIcon>(
    propSelectedIcon || NavigationIcon.Storefront,
  );
  const [selectedCategory, setSelectedFilter] = useState('all');
  const [selectedLiquidity, setSelectedLiquidity] = useState('all');
  const [selectedSpread] = useState('all');
  const [selectedTerm, setSelectedTerm] = useState('all');
  const { apiKey, createApiKey } = usePolymarketAuth();
  const { isNetworkSupported, networkError } = usePolymarketApi();

  // Filter options for the dropdown
  const filterOptions = [
    { key: 'all', label: 'All Categories', value: 'all' },
    { key: 'crypto', label: 'Crypto', value: '21' },
    { key: 'sports', label: 'Sports', value: '1' },
  ];

  // Liquidity threshold options
  const liquidityOptions = [
    { key: 'all', label: 'All Liquidity', value: 'all' },
    { key: 'low', label: 'Low (< $1K)', value: 'low' },
    { key: 'medium', label: 'Medium ($1K - $10K)', value: 'medium' },
    { key: 'high', label: 'High (> $10K)', value: 'high' },
  ];

  // Traders spread options
  /*   const spreadOptions = [
    { key: 'all', label: 'All Spreads', value: 'all' },
    { key: 'tight', label: 'Tight (< 5%)', value: 'tight' },
    { key: 'medium', label: 'Medium (5-15%)', value: 'medium' },
    { key: 'wide', label: 'Wide (> 15%)', value: 'wide' },
  ]; */

  // Term options
  const termOptions = [
    { key: 'all', label: 'All Terms', value: 'all' },
    { key: 'short', label: 'Short Term (< 7 days)', value: 'short' },
    { key: 'medium', label: 'Medium Term (7-30 days)', value: 'medium' },
    { key: 'long', label: 'Long Term (> 30 days)', value: 'long' },
  ];

  React.useEffect(() => {
    if (propSelectedIcon) {
      setSelectedIcon(propSelectedIcon);
    }
  }, [propSelectedIcon]);

  const getMarkets = useCallback(async () => {
    try {
      setLoading(true);
      let url = `${GAMMA_API_ENDPOINT}/markets?limit=5&closed=false&active=true`;

      if (selectedCategory !== 'all') {
        url += `&tag_id=${selectedCategory}`;
      }

      if (selectedLiquidity !== 'all') {
        switch (selectedLiquidity) {
          case 'low':
            url += `&liquidity_num_min=0&liquidity_num_max=1000&`;
            break;
          case 'medium':
            url += `&liquidity_num_min=1000&liquidity_num_max=10000`;
            break;
          case 'high':
            url += `&liquidity_num_min=10000&liquidity_num_max=100000`;
            break;
        }
      }

      if (selectedSpread !== 'all') {
        url += `&spread=${selectedSpread}`;
      }

      if (selectedTerm !== 'all') {
        const now = new Date();
        switch (selectedTerm) {
          case 'short': {
            const shortEndDate = new Date(
              now.getTime() + 7 * 24 * 60 * 60 * 1000,
            );
            url += `&end_date_max=${shortEndDate.toISOString()}`;
            break;
          }
          case 'medium': {
            const mediumStartDate = new Date(
              now.getTime() + 7 * 24 * 60 * 60 * 1000,
            );
            const mediumEndDate = new Date(
              now.getTime() + 30 * 24 * 60 * 60 * 1000,
            );
            url += `&end_date_min=${mediumStartDate.toISOString()}&end_date_max=${mediumEndDate.toISOString()}`;
            break;
          }
          case 'long': {
            const longStartDate = new Date(
              now.getTime() + 30 * 24 * 60 * 60 * 1000,
            );
            const longEndDate = new Date(
              now.getTime() + 365 * 24 * 60 * 60 * 1000,
            ); // 1 year max
            url += `&end_date_min=${longStartDate.toISOString()}&end_date_max=${longEndDate.toISOString()}`;
            break;
          }
        }
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const marketsData = await response.json();
      setMarketData(marketsData); // setMarketData([marketsData]);
    } catch (error) {
      console.error('Error fetching trades:', error);
      setMarketData([]);
    } finally {
      setLoading(false);
    }
  }, [
    GAMMA_API_ENDPOINT,
    selectedCategory,
    selectedLiquidity,
    selectedSpread,
    selectedTerm,
  ]);

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
  }, [getMarkets]);

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
    filterRow: {
      marginBottom: 40,
    },
    filterLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text.default,
      marginBottom: 2,
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
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Markets</Text>
          <SelectComponent
            selectedValue={selectedCategory}
            onValueChange={setSelectedFilter}
            label="Filter Markets"
            options={filterOptions}
            defaultValue="All Markets"
          />
        </View>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Liquidity</Text>
          <SelectComponent
            selectedValue={selectedLiquidity}
            onValueChange={setSelectedLiquidity}
            label="Liquidity Threshold"
            options={liquidityOptions}
            defaultValue="All Liquidity"
          />
        </View>
        {/* <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Spread</Text>
              <SelectComponent
                selectedValue={selectedSpread}
                onValueChange={setSelectedSpread}
                label="Traders Spread"
                options={spreadOptions}
                defaultValue="All Spreads"
              />
            </View> */}
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Term</Text>
          <SelectComponent
            selectedValue={selectedTerm}
            onValueChange={setSelectedTerm}
            label="Term"
            options={termOptions}
            defaultValue="All Terms"
          />
        </View>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <>
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
                        style={styles.buyYesButton}
                        onPress={() =>
                          navigation.navigate(Routes.PREDICT_BET, {
                            marketId: !isPolymarketStaging
                              ? market.conditionId
                              : POLYMARKET_STAGING_CONSTS.CONDITION_ID,
                          })
                        }
                        label={`Buy Yes`}
                      />
                      <Button
                        variant={ButtonVariants.Primary}
                        size={ButtonSize.Lg}
                        width={ButtonWidthTypes.Auto}
                        style={styles.buyNoButton}
                        onPress={() =>
                          navigation.navigate(Routes.PREDICT_BET, {
                            marketId: !isPolymarketStaging
                              ? market.conditionId
                              : POLYMARKET_STAGING_CONSTS.CONDITION_ID,
                          })
                        }
                        label={`Buy No`}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </>
        )}
      </View>
    </View>
  );
};

export default MetaMaskPredict;
