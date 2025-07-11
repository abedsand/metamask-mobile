import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import NavigationBar, { NavigationIcon } from './NavigationBar';
import { useTheme } from '../../../util/theme';

interface MetaMaskPredictOrdersProps {
  selectedIcon?: NavigationIcon;
  onNavigate?: (icon: NavigationIcon) => void;
}

const MetaMaskPredictOrders: React.FC<MetaMaskPredictOrdersProps> = ({
  selectedIcon: propSelectedIcon,
  onNavigate,
}) => {
  const { colors } = useTheme();

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
  });

  const [selectedIcon, setSelectedIcon] = useState<NavigationIcon>(
    propSelectedIcon || NavigationIcon.Storefront,
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Orders</Text>
        <Text style={styles.placeholderText}>Your current orders</Text>
        <NavigationBar
          selectedIcon={selectedIcon}
          onIconPress={setSelectedIcon}
          onNavigate={onNavigate}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Orders</Text>
        <Text style={styles.placeholderText}>Soon™️</Text>
      </View>
    </View>
  );
};

export default MetaMaskPredictOrders;
