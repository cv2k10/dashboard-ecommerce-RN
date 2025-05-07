import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'danger' | 'success';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress: () => void;
}

/**
 * Custom button component with different variants and states
 */
const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  onPress,
  ...rest
}) => {
  const { theme, spacing } = useTheme();
  
  // Determine background and text colors based on variant
  const getColors = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.primary,
          textColor: '#ffffff',
          borderColor: theme.primary,
        };
      case 'secondary':
        return {
          backgroundColor: theme.secondary,
          textColor: '#ffffff',
          borderColor: theme.secondary,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          textColor: theme.primary,
          borderColor: theme.primary,
        };
      case 'danger':
        return {
          backgroundColor: theme.error,
          textColor: '#ffffff',
          borderColor: theme.error,
        };
      case 'success':
        return {
          backgroundColor: theme.success,
          textColor: '#ffffff',
          borderColor: theme.success,
        };
      default:
        return {
          backgroundColor: theme.primary,
          textColor: '#ffffff',
          borderColor: theme.primary,
        };
    }
  };
  
  // Determine padding and font size based on size
  const getDimensions = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.md,
          fontSize: 12,
          iconSize: 14,
        };
      case 'large':
        return {
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.xl,
          fontSize: 18,
          iconSize: 22,
        };
      default:
        return {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.lg,
          fontSize: 16,
          iconSize: 18,
        };
    }
  };
  
  const { backgroundColor, textColor, borderColor } = getColors();
  const { paddingVertical, paddingHorizontal, fontSize, iconSize } = getDimensions();
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: disabled ? theme.inactive : backgroundColor,
          borderColor: disabled ? theme.inactive : borderColor,
          paddingVertical,
          paddingHorizontal,
          opacity: disabled ? 0.7 : 1,
          width: fullWidth ? '100%' : 'auto',
          borderWidth: variant === 'outlined' ? 1 : 0,
        },
        style,
      ]}
      activeOpacity={0.8}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons 
              name={icon as any} 
              size={iconSize} 
              color={textColor} 
              style={styles.iconLeft} 
            />
          )}
          <Text
            style={[
              styles.text,
              { color: textColor, fontSize },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons 
              name={icon as any} 
              size={iconSize} 
              color={textColor} 
              style={styles.iconRight} 
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  text: {
    fontWeight: '500',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button;
