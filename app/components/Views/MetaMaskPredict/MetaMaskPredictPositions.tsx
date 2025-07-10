import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useTheme } from '../../../util/theme';
import NavigationBar, { NavigationIcon } from './NavigationBar';

interface MetaMaskPredictPositionsProps {
  selectedIcon?: NavigationIcon;
  onNavigate?: (icon: NavigationIcon) => void;
}

const MetaMaskPredictPositions: React.FC<MetaMaskPredictPositionsProps> = ({
  selectedIcon: propSelectedIcon,
  onNavigate,
}) => {
  const { colors } = useTheme();
  const [selectedIcon, setSelectedIcon] = React.useState<NavigationIcon>(
    propSelectedIcon || NavigationIcon.Bank,
  );

  React.useEffect(() => {
    if (propSelectedIcon) {
      setSelectedIcon(propSelectedIcon);
    }
  }, [propSelectedIcon]);

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
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={styles.placeholderText}>Positions coming soon...</Text>
        </View>
      </View>
    </View>
  );
};

export default MetaMaskPredictPositions;
