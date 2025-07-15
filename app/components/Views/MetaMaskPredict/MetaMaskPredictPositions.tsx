import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

import { useTheme } from '../../../util/theme';
import NavigationBar, { NavigationIcon } from './NavigationBar';
import Button, {
  ButtonVariants,
} from '../../../component-library/components/Buttons/Button';
// import usePolymarket from '../../../hooks/usePolymarket';

export const CLOB_ENDPOINT = 'https://clob.polymarket.com';
export const DATA_API_ENDPOINT = 'https://data-api.polymarket.com';

interface MetaMaskPredictPositionsProps {
  selectedIcon?: NavigationIcon;
  onNavigate?: (icon: NavigationIcon) => void;
}

export interface UserPosition {
  proxyWallet: string;
  asset: string;
  conditionId: string;
  size: number;
  avgPrice: number;
  initialValue: number;
  currentValue: number;
  cashPnl: number;
  percentPnl: number;
  totalBought: number;
  realizedPnl: number;
  percentRealizedPnl: number;
  curPrice: number;
  redeemable: boolean;
  title: string;
  slug: string;
  icon: string;
  eventSlug: string;
  outcome: string;
  outcomeIndex: number;
  oppositeOutcome: string;
  oppositeAsset: string;
  endDate: string;
  negativeRisk: boolean;
}

const MetaMaskPredictPositions: React.FC<MetaMaskPredictPositionsProps> = ({
  selectedIcon: propSelectedIcon,
  onNavigate,
}) => {
  const [positions, setPositions] = useState<UserPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeemingPosition, setRedeemingPosition] =
    useState<UserPosition | null>(null);

  const { colors } = useTheme();
  const [selectedIcon, setSelectedIcon] = React.useState<NavigationIcon>(
    propSelectedIcon || NavigationIcon.Bank,
  );

  React.useEffect(() => {
    if (propSelectedIcon) {
      setSelectedIcon(propSelectedIcon);
    }
  }, [propSelectedIcon]);

  const getPositions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${DATA_API_ENDPOINT}/positions?limit=10&user=0x7c9e0b03d7505dad7e87777cd282628f75b2db3d`, // ${selectedAccount?.address}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const positionsData = await response.json();
      setPositions(positionsData);
    } catch (error) {
      console.error('Error fetching positions:', error);
      setPositions([]);
    } finally {
      setLoading(false);
    }
  };

  // Call getTrades on mount
  useEffect(() => {
    getPositions();
  }, []);

  const handleRedeem = (position: UserPosition) => {
    setRedeemingPosition(position);
    // TODO: Implement redeem logic
    setTimeout(() => setRedeemingPosition(null), 2000);
  };

  const handleSell = (position: UserPosition) => {
    // eslint-disable-next-line no-console
    console.log('Selling position:', position);
    // TODO: Implement sell logic
  };

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
    },
    placeholderText: {
      fontSize: 16,
      color: colors.text.alternative,
      textAlign: 'center',
    },
    placeholderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    positionCard: {
      backgroundColor: colors.background.default,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border.default,
    },
    positionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    positionInfo: {
      flex: 1,
      marginLeft: 12,
    },
    positionActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 12,
    },
    priceInfo: {
      flexDirection: 'row',
      gap: 16,
    },
    priceItem: {
      alignItems: 'center',
    },
    positionIcon: {
      width: 48,
      height: 48,
      borderRadius: 8,
    },
    positionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text.default,
      marginBottom: 4,
    },
    positionSubtext: {
      fontSize: 14,
      color: colors.text.alternative,
      marginBottom: 2,
    },
    positionValue: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text.default,
      marginBottom: 4,
    },
    positionPnl: {
      fontSize: 14,
      fontWeight: '500',
    },
    priceLabel: {
      fontSize: 12,
      color: colors.text.alternative,
      marginBottom: 2,
    },
    priceValue: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text.default,
    },
    scrollView: {
      flex: 1,
    },
    positionValueContainer: {
      marginLeft: 'auto',
      alignItems: 'flex-end',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Positions</Text>
        <Text style={styles.placeholderText}>Your current positions</Text>
        <NavigationBar
          selectedIcon={selectedIcon}
          onIconPress={setSelectedIcon}
          onNavigate={onNavigate}
        />

        <ScrollView style={styles.scrollView}>
          {loading && (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>Loading positions...</Text>
            </View>
          )}

          {positions &&
            positions.length > 0 &&
            positions.map((position: UserPosition) => (
              <View
                key={`${position.outcomeIndex}-${position.asset}`}
                style={styles.positionCard}
              >
                <View style={styles.positionHeader}>
                  <Image
                    source={{ uri: position.icon }}
                    style={styles.positionIcon}
                    resizeMode="cover"
                  />
                  <View style={styles.positionInfo}>
                    <Text style={styles.positionTitle}>{position.title}</Text>
                    <Text style={styles.positionSubtext}>
                      {position.outcome} {Math.round(position.avgPrice * 100)}¢
                    </Text>
                    <Text style={styles.positionSubtext}>
                      {position.size} shares
                    </Text>
                  </View>
                  <View style={styles.positionValueContainer}>
                    <Text style={styles.positionValue}>
                      ${position.currentValue.toFixed(2)}
                    </Text>
                    <Text
                      style={[
                        styles.positionPnl,
                        {
                          color:
                            position.cashPnl < 0
                              ? colors.error.default
                              : colors.success.default,
                        },
                      ]}
                    >
                      {position.cashPnl < 0 ? '' : '+'}$
                      {position.cashPnl.toFixed(2)} (
                      {position.cashPnl < 0 ? '' : '+'}
                      {position.percentRealizedPnl.toFixed(2)}%)
                    </Text>
                  </View>
                </View>

                <View style={styles.positionActions}>
                  <View style={styles.priceInfo}>
                    <View style={styles.priceItem}>
                      <Text style={styles.priceLabel}>Avg</Text>
                      <Text style={styles.priceValue}>
                        {Math.round(position.avgPrice * 100)}¢
                      </Text>
                    </View>
                    <View style={styles.priceItem}>
                      <Text style={styles.priceLabel}>Now</Text>
                      <Text style={styles.priceValue}>
                        {position.curPrice === null
                          ? '...'
                          : `${Math.round(position.curPrice * 100)}¢`}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.positionActions}>
                    {position.redeemable && (
                      <Button
                        variant={ButtonVariants.Primary}
                        onPress={() => handleRedeem(position)}
                        label={
                          redeemingPosition?.asset === position.asset
                            ? 'Redeeming...'
                            : 'Redeem'
                        }
                      />
                    )}
                    <Button
                      variant={ButtonVariants.Secondary}
                      onPress={() => handleSell(position)}
                      label="Sell"
                    />
                  </View>
                </View>
              </View>
            ))}

          {!loading && positions.length === 0 && (
            <Text style={styles.placeholderText}>No positions found.</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default MetaMaskPredictPositions;
