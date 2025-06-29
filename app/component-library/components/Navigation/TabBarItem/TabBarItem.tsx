/* eslint-disable react/prop-types */

// Third party dependencies.
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

// External dependencies.
import { useStyles } from '../../../hooks';
import TextComponent, { TextVariant } from '../../Texts/Text';

// Internal dependencies
import styleSheet from './TabBarItem.styles';
import { TabBarItemProps } from './TabBarItem.types';
import Avatar, { AvatarVariant } from '../../Avatars/Avatar';

const TabBarItem = ({
  style,
  icon,
  iconSize,
  iconColor,
  iconBackgroundColor,
  label,
  ...props
}: TabBarItemProps) => {
  const { styles } = useStyles(styleSheet, { style });

  return (
    <TouchableOpacity {...props} style={styles.base}>
      <View style={styles.content}>
        <Avatar
          variant={AvatarVariant.Icon}
          name={icon}
          size={iconSize}
          backgroundColor={iconBackgroundColor}
          iconColor={iconColor}
        />
        <TextComponent
          variant={TextVariant.BodySM}
          style={styles.label}
          color={iconColor}
        >
          {label}
        </TextComponent>
      </View>
    </TouchableOpacity>
  );
};

export default TabBarItem;
