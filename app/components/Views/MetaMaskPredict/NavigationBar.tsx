import React from 'react';
import { View, StyleSheet } from 'react-native';

import ButtonIcon, {
  ButtonIconSizes,
} from '../../../component-library/components/Buttons/ButtonIcon';
import { IconName } from '../../../component-library/components/Icons/Icon';
import { useTheme } from '../../../util/theme';
import { WalletViewSelectorsIDs } from '../../../../e2e/selectors/wallet/WalletView.selectors';

export enum NavigationIcon {
  Storefront = 'Storefront',
  Bank = 'Bank',
  Chart = 'Chart',
  Money = 'Money',
  Setting = 'Setting',
}

interface NavigationBarProps {
  selectedIcon: NavigationIcon;
  onIconPress: (icon: NavigationIcon) => void;
  onNavigate?: (icon: NavigationIcon) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  selectedIcon,
  onIconPress,
  onNavigate,
}) => {
  const { colors } = useTheme();

  const navigationItems = [
    { icon: NavigationIcon.Storefront, iconName: IconName.Storefront },
    { icon: NavigationIcon.Bank, iconName: IconName.Bank },
    { icon: NavigationIcon.Chart, iconName: IconName.Chart },
    { icon: NavigationIcon.Money, iconName: IconName.Money },
    { icon: NavigationIcon.Setting, iconName: IconName.Setting },
  ];

  const handleIconPress = (icon: NavigationIcon) => {
    onIconPress(icon);

    if (onNavigate) {
      onNavigate(icon);
    }
  };

  const styles = StyleSheet.create({
    navigation: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
      gap: 12,
      marginTop: 20,
    },
    buttonCircularBorder: {
      borderRadius: 100,
      backgroundColor: colors.background.muted,
      padding: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectedButton: {
      backgroundColor: colors.primary.default,
    },
  });

  return (
    <View style={styles.navigation}>
      {navigationItems.map((item) => (
        <View
          key={item.icon}
          style={[
            styles.buttonCircularBorder,
            selectedIcon === item.icon && styles.selectedButton,
          ]}
        >
          <ButtonIcon
            testID={WalletViewSelectorsIDs.SORT_BY}
            size={ButtonIconSizes.Lg}
            onPress={() => handleIconPress(item.icon)}
            iconName={item.iconName}
          />
        </View>
      ))}
    </View>
  );
};

export default NavigationBar;
