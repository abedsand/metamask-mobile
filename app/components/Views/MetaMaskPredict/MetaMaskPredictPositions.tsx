import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

import { useTheme } from '../../../util/theme';
import NavigationBar, { NavigationIcon } from './NavigationBar';
import Button, {
  ButtonVariants,
} from '../../../component-library/components/Buttons/Button';
import { Side, UserPosition } from '../../../util/predict/types';
import {
  getPositions,
  getTickSize,
} from '../../../util/predict/utils/polymarket';
import { useSelector } from 'react-redux';
import { selectSelectedInternalAccount } from '../../../selectors/accountsController';
import { usePolymarket } from '../../../util/predict/hooks';

interface MetaMaskPredictPositionsProps {
  selectedIcon?: NavigationIcon;
  onNavigate?: (icon: NavigationIcon) => void;
}

const MetaMaskPredictPositions: React.FC<MetaMaskPredictPositionsProps> = ({
  selectedIcon: propSelectedIcon,
  onNavigate,
}) => {
  const [positions, setPositions] = useState<UserPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeemingPosition, setRedeemingPosition] =
    useState<UserPosition | null>(null);
  const selectedAccount = useSelector(selectSelectedInternalAccount);
  const { placeOrder, redeemPosition } = usePolymarket();
  const [sellingPosition, setSellingPosition] = useState<UserPosition | null>(
    null,
  );

  const { colors } = useTheme();
  const [selectedIcon, setSelectedIcon] = React.useState<NavigationIcon>(
    propSelectedIcon || NavigationIcon.Bank,
  );

  useEffect(() => {
    if (propSelectedIcon) {
      setSelectedIcon(propSelectedIcon);
    }
  }, [propSelectedIcon]);

  const fetchPositions = useCallback(async () => {
    try {
      setLoading(true);
      const positionsData = await getPositions({
        address: selectedAccount?.address ?? '',
        limit: 100,
      });
      setPositions(positionsData);
    } catch (error) {
      console.error('Error fetching positions:', error);
      setPositions([]);
    } finally {
      setLoading(false);
    }
  }, [selectedAccount]);

  // Call getTrades on mount
  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  const handleSell = async (position: UserPosition) => {
    // eslint-disable-next-line no-console
    console.log('Selling position:', position);
    setSellingPosition(position);
    const tickSizeData = await getTickSize(position.asset);
    if (!tickSizeData) {
      console.error('No tick size found');
      return;
    }
    await placeOrder({
      tokenId: position.asset,
      min_size: Number(position.size),
      tickSize: tickSizeData.minimum_tick_size,
      side: Side.SELL,
      negRisk: position.negativeRisk,
      amount: Number(position.size),
    });
    setSellingPosition(null);
  };

  const handleRedeem = async (position: UserPosition) => {
    setRedeemingPosition(position);
    await redeemPosition(position);
    setRedeemingPosition(null);
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
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    },
    positionHeader: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      gap: 12,
    },
    positionInfo: {
      flex: 1,
      marginLeft: 0,
    },
    positionActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
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
      width: '100%',
      flex: 1,
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
      alignItems: 'flex-start',
    },
    positionInfoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
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
                  <Text style={styles.positionTitle}>{position.title}</Text>
                </View>
                <View style={styles.positionInfoContainer}>
                  <View style={styles.positionInfo}>
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
                        label={'Redeem'}
                        loading={redeemingPosition?.asset === position.asset}
                      />
                    )}
                    <Button
                      variant={ButtonVariants.Secondary}
                      onPress={() => handleSell(position)}
                      label="Sell"
                      loading={sellingPosition?.asset === position.asset}
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
