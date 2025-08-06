import React from 'react';
import {
  Box,
  BoxFlexDirection,
  Button,
  ButtonBase,
  ButtonVariant,
  Icon,
  IconName,
  IconSize,
  TextVariant,
  type ButtonBaseProps,
  type BoxProps,
  type ButtonProps,
  BoxJustifyContent,
} from '@metamask/design-system-react-native';

interface KeypadContainerProps extends BoxProps {
  children?: React.ReactNode;
}

const KeypadContainer: React.FC<KeypadContainerProps> = (props) => (
  <Box gap={3} {...props} />
);

interface KeypadRowProps {
  children?: React.ReactNode;
}

const KeypadRow: React.FC<KeypadRowProps> = (props) => (
  <Box
    flexDirection={BoxFlexDirection.Row}
    justifyContent={BoxJustifyContent.Between}
    gap={3}
    {...props}
  />
);

type KeypadButtonProps = Omit<ButtonProps, 'variant' | 'children'> & {
  children: React.ReactNode;
  boxWrapperProps?: BoxProps;
};

const KeypadButton: React.FC<KeypadButtonProps> = ({
  children,
  boxWrapperProps,
  ...props
}) => (
  // Required wrapper to ensure the KeypadButton takes up space available in KeypadRow
  <Box twClassName="flex-1" {...boxWrapperProps}>
    <Button
      isFullWidth
      textProps={{
        variant: TextVariant.DisplayMd,
        // fontWeight: FontWeight.Medium, // TODO: @MetaMask/design-system-engineers this still doesn't work for some reason?
        twClassName: 'font-medium', // Workaround for font weight
      }}
      {...props}
      variant={ButtonVariant.Secondary} // Can't override variant
    >
      {children}
    </Button>
  </Box>
);

type KeypadDeleteButtonProps = Omit<ButtonBaseProps, 'children'> & {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  delayLongPress?: number;
  testID?: string;
  boxWrapperProps?: BoxProps;
};

const KeypadDeleteButton: React.FC<KeypadDeleteButtonProps> = ({
  onPress,
  onLongPress,
  delayLongPress,
  testID,
  boxWrapperProps,
  ...props
}) => (
  // Required wrapper to ensure the KeypadButton takes up space available in KeypadRow
  <Box twClassName="flex-1" {...boxWrapperProps}>
    <ButtonBase
      isFullWidth
      textProps={{
        variant: TextVariant.DisplayMd,
      }}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={delayLongPress}
      twClassName="bg-transparent"
      testID={testID}
      {...props}
    >
      <Icon name={IconName.Backspace} size={IconSize.Xl} />
    </ButtonBase>
  </Box>
);

type KeypadType = React.FC<KeypadContainerProps> & {
  Row: React.FC<KeypadRowProps>;
  Button: React.FC<KeypadButtonProps>;
  DeleteButton: React.FC<KeypadDeleteButtonProps>;
};

const Keypad = KeypadContainer as KeypadType;
Keypad.Row = KeypadRow;
Keypad.Button = KeypadButton;
Keypad.DeleteButton = KeypadDeleteButton;

export default Keypad;
export type {
  KeypadContainerProps,
  KeypadButtonProps,
  KeypadDeleteButtonProps,
};
