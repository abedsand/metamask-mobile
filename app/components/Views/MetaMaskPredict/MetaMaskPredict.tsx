import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

const MetaMaskPredict = () => {
  const { colors } = useTheme();

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
      marginBottom: 6,
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
      justifyContent: 'center',
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
      marginTop: 20,
      alignSelf: 'flex-start',
      width: '100%',
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
        <View style={styles.marketContainer}>
          <Text style={styles.marketTitle}>
            Will the price of ETH go up or down?
          </Text>
          <Text style={styles.marketPricing}>
            186D Left&nbsp;&nbsp;&nbsp;$654,321.00 Vol
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
        <View style={styles.marketContainer}>
          <Text style={styles.marketTitle}>
            Will Avater 3 be the top grossing movie of 2025?
          </Text>
          <Text style={styles.marketPricing}>
            186D Left&nbsp;&nbsp;&nbsp;$654,321.00 Vol
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
    </View>
  );
};

export default MetaMaskPredict;
