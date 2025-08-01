import React, { useState, useCallback } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import NavigationBar, { NavigationIcon } from './NavigationBar';
import { useTheme } from '../../../util/theme';
import Button, {
  ButtonVariants,
  ButtonSize,
  ButtonWidthTypes,
} from '../../../component-library/components/Buttons/Button';
import { usePolymarketAuth } from '../../../util/predict/hooks';
import {
  selectIsPolymarketStaging,
  selectIsGeolocationCheck,
  selectGeolocationData,
} from '../../../selectors/predict';
import {
  setPolymarketStaging,
  setGeolocationCheck,
} from '../../../actions/predict';
import { formatCountryCode } from '../../../util/predict/geolocation';

interface MetaMaskPredictSettingsProps {
  selectedIcon?: NavigationIcon;
  onNavigate?: (icon: NavigationIcon) => void;
}

const MetaMaskPredictSettings: React.FC<MetaMaskPredictSettingsProps> = ({
  selectedIcon: propSelectedIcon,
  onNavigate,
}) => {
  const { colors, brandColors } = useTheme();
  const dispatch = useDispatch();
  const isPolymarketStaging = useSelector(selectIsPolymarketStaging);
  const isGeolocationCheck = useSelector(selectIsGeolocationCheck);
  const countryCode = useSelector(selectGeolocationData);
  const { approveAllowances, createApiKey } = usePolymarketAuth();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.default,
      padding: 20,
    },
    header: {
      marginBottom: 20,
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
    settingsSection: {
      marginTop: 16,
    },
    settingsTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text.default,
    },
    settingsText: {
      marginTop: 4,
      fontSize: 14,
      color: colors.text.alternative,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    switchElement: {
      marginLeft: 16,
    },
    switch: {
      alignSelf: 'flex-start',
    },
    desc: {
      marginTop: 8,
    },
    accessory: {
      marginTop: 16,
    },
    scrollableContainer: {
      flex: 1,
    },
  });

  const [selectedIcon, setSelectedIcon] = useState<NavigationIcon>(
    propSelectedIcon || NavigationIcon.Setting,
  );

  const handleApproveAllowances = useCallback(async () => {
    await approveAllowances();
  }, [approveAllowances]);

  const handleResetApiKey = useCallback(async () => {
    await createApiKey();
    Alert.alert('API Key Reset', 'Your API key has been reset');
  }, [createApiKey]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.placeholderText}>
          Predict settings and preferences
        </Text>
        <NavigationBar
          selectedIcon={selectedIcon}
          onIconPress={setSelectedIcon}
          onNavigate={onNavigate}
        />
      </View>
      <ScrollView
        style={styles.scrollableContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.settingsSection}>
          <View style={styles.titleContainer}>
            <Text style={styles.settingsTitle}>Use Staging Environment</Text>
            <View style={styles.switchElement}>
              <Switch
                value={isPolymarketStaging}
                onValueChange={(value) => {
                  dispatch(setPolymarketStaging(value));
                }}
                trackColor={{
                  true: colors.primary.default,
                  false: colors.border.muted,
                }}
                thumbColor={brandColors.white}
                style={styles.switch}
                ios_backgroundColor={colors.border.muted}
              />
            </View>
          </View>
          <Text style={styles.settingsText}>
            Toggle between staging and production environments.
          </Text>
        </View>
        <View style={styles.settingsSection}>
          <View style={styles.titleContainer}>
            <Text style={styles.settingsTitle}>Check for Location</Text>
            <View style={styles.switchElement}>
              <Switch
                value={isGeolocationCheck}
                onValueChange={(value) => {
                  dispatch(setGeolocationCheck(value));
                }}
                trackColor={{
                  true: colors.primary.default,
                  false: colors.border.muted,
                }}
                thumbColor={brandColors.white}
                style={styles.switch}
                ios_backgroundColor={colors.border.muted}
              />
            </View>
          </View>
          <Text style={styles.settingsText}>
            Toggle location check on or off.
          </Text>
          {isGeolocationCheck && countryCode && (
            <Text style={styles.settingsText}>
              Detected location: {formatCountryCode(countryCode)}
            </Text>
          )}
        </View>
        <View style={styles.settingsSection}>
          <Text style={styles.settingsTitle}>Approve Allowances</Text>

          <Text style={styles.settingsText}>
            Restart the allowance approval flow
          </Text>
          <View style={styles.accessory}>
            <Button
              variant={ButtonVariants.Secondary}
              size={ButtonSize.Lg}
              width={ButtonWidthTypes.Full}
              onPress={handleApproveAllowances}
              label="Approve Allowances"
            />
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.settingsTitle}>Reset API Key</Text>

          <Text style={styles.settingsText}>
            Clear your current API key and generate a new one
          </Text>
          <View style={styles.accessory}>
            <Button
              variant={ButtonVariants.Secondary}
              size={ButtonSize.Lg}
              width={ButtonWidthTypes.Full}
              onPress={handleResetApiKey}
              label="Reset API Key"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MetaMaskPredictSettings;
