import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';

import NavigationBar, { NavigationIcon } from './NavigationBar';
import { useTheme } from '../../../util/theme';
import Button, {
  ButtonVariants,
} from '../../../component-library/components/Buttons/Button';
import { useSelector } from 'react-redux';
import { selectSelectedInternalAccount } from '../../../selectors/accountsController';

export const DATA_API_ENDPOINT = 'https://data-api.polymarket.com';

export interface Activity {
  proxyWallet: string;
  timestamp: number;
  conditionId: string;
  type: string; // e.g., 'TRADE', 'REDEEM', could be an enum if there are fixed types
  size: number;
  usdcSize: number;
  transactionHash: string;
  price: number;
  asset: string;
  side: string; // e.g., 'BUY' or 'SELL', could be an enum if Side is imported
  outcomeIndex: number;
  title: string;
  slug: string;
  icon: string;
  eventSlug: string;
  outcome: string;
  name: string;
  pseudonym: string;
  bio: string;
  profileImage: string;
  profileImageOptimized: string;
}

interface MetaMaskPredictProfitProps {
  selectedIcon?: NavigationIcon;
  onNavigate?: (icon: NavigationIcon) => void;
}

const MetaMaskPredictProfit: React.FC<MetaMaskPredictProfitProps> = ({
  selectedIcon: propSelectedIcon,
  onNavigate,
}) => {
  const { colors } = useTheme();
  const selectedAccount = useSelector(selectSelectedInternalAccount);
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [spent, setSpent] = useState(0);
  const [earns, setEarns] = useState(0);
  const [pnl, setPnl] = useState(0);

  const getActivity = useCallback(async () => {
    setLoading(true);
    const response = await fetch(
      `${DATA_API_ENDPOINT}/activity/?limit=100&sortDirection=DESC&user=${selectedAccount?.address}`,
    );
    const responseData = await response.json();
    setActivity(responseData);

    const spentData = responseData.reduce((acc: number, item: Activity) => {
      if (item.type === 'TRADE') {
        if (item.side === 'BUY') {
          return acc + item.usdcSize;
        }
      }
      return acc;
    }, 0);
    setSpent(spentData);

    const earnsData = responseData.reduce((acc: number, item: Activity) => {
      if (item.type === 'TRADE') {
        if (item.side === 'SELL') {
          return acc + item.usdcSize;
        }
      }
      if (item.type === 'REDEEM') {
        return acc + item.usdcSize;
      }
      return acc;
    }, 0);
    setEarns(earnsData);

    setPnl(earnsData - spentData);

    setLoading(false);
  }, [selectedAccount]);

  useEffect(() => {
    getActivity();
  }, [getActivity]);

  const handleViewOnPolygonscan = (transactionHash: string) => {
    Linking.openURL(`https://polygonscan.com/tx/${transactionHash}`);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.default,
      padding: 20,
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text.default,
      textAlign: 'center',
      marginTop: 42,
      marginBottom: 12,
    },
    placeholderText: {
      fontSize: 16,
      color: colors.text.alternative,
      textAlign: 'center',
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 16,
      marginBottom: 20,
    },
    statItem: {
      alignItems: 'center',
      gap: 4,
    },
    statLabel: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 2,
    },
    statValue: {
      fontSize: 14,
      fontWeight: '500',
    },
    statLabelSpent: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 2,
      color: colors.error.default,
    },
    statValueSpent: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.error.default,
    },
    statLabelEarns: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 2,
      color: colors.success.default,
    },
    statValueEarns: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.success.default,
    },
    statLabelProfit: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 2,
      color: pnl >= 0 ? colors.success.default : colors.error.default,
    },
    statValueProfit: {
      fontSize: 14,
      fontWeight: '500',
      color: pnl >= 0 ? colors.success.default : colors.error.default,
    },
    activityCard: {
      backgroundColor: colors.background.default,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border.default,
    },
    activityHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    activityTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text.default,
      marginBottom: 4,
    },
    activityTimestamp: {
      fontSize: 12,
      color: colors.text.alternative,
    },
    activityDetails: {
      flexDirection: 'column',
    },
    activityType: {
      fontSize: 14,
      color: colors.text.default,
      marginBottom: 4,
    },
    activityAmount: {
      fontSize: 14,
      fontWeight: '500',
    },
    scrollView: {
      flex: 1,
    },
    loadingContainer: {
      flexDirection: 'row',
      gap: 16,
      padding: 16,
    },
    loadingText: {
      fontSize: 14,
      color: colors.text.alternative,
    },
    mainContentContainer: {
      flexDirection: 'column',
      gap: 16,
    },
    activityListContainer: {
      flexDirection: 'column',
      gap: 8,
    },
    activityHeaderContent: {
      flex: 1,
    },
    activityTypeContainer: {
      flexDirection: 'row',
    },
    activityAmountBuy: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.error.default,
    },
    activityAmountSell: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.success.default,
    },
  });

  const [selectedIcon, setSelectedIcon] = useState<NavigationIcon>(
    propSelectedIcon || NavigationIcon.Money,
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profit</Text>
        <Text style={styles.placeholderText}>Your profit overview</Text>
        <NavigationBar
          selectedIcon={selectedIcon}
          onIconPress={setSelectedIcon}
          onNavigate={onNavigate}
        />

        <ScrollView style={styles.scrollView}>
          {loading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          )}

          {!loading && (
            <View style={styles.mainContentContainer}>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabelSpent}>Spent</Text>
                  <Text style={styles.statValueSpent}>${spent.toFixed(2)}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabelEarns}>Earns</Text>
                  <Text style={styles.statValueEarns}>${earns.toFixed(2)}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabelProfit}>Profit</Text>
                  <Text style={styles.statValueProfit}>
                    {pnl >= 0 ? '' : '-'}${Math.abs(pnl).toFixed(2)}
                  </Text>
                </View>
              </View>

              <View style={styles.activityListContainer}>
                {activity.map((item) => (
                  <View key={item.transactionHash} style={styles.activityCard}>
                    <View style={styles.activityHeader}>
                      <View style={styles.activityHeaderContent}>
                        <Text style={styles.activityTitle}>{item.title}</Text>
                        <Text style={styles.activityTimestamp}>
                          {new Date(item.timestamp * 1000).toLocaleString()}
                        </Text>
                      </View>
                      <Button
                        variant={ButtonVariants.Link}
                        onPress={() =>
                          handleViewOnPolygonscan(item.transactionHash)
                        }
                        label="View on Polygonscan"
                      />
                    </View>
                    <View style={styles.activityDetails}>
                      <View style={styles.activityTypeContainer}>
                        <Text style={styles.activityType}>{item.type}</Text>
                        {item.side && (
                          <Text style={styles.activityType}>: {item.side}</Text>
                        )}
                      </View>
                      <Text
                        style={
                          item.side === 'BUY'
                            ? styles.activityAmountBuy
                            : styles.activityAmountSell
                        }
                      >
                        ${item.usdcSize.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default MetaMaskPredictProfit;
