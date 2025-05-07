import React from 'react';
import { StyleSheet, View, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  footer?: React.ReactNode;
}

/**
 * Reusable card component with customizable styling
 */
const Card: React.FC<CardProps> = ({ title, children, style, titleStyle, footer }) => {
  const { theme, spacing } = useTheme();
  
  return (
    <View
      style={[
        styles.container,
        { 
          backgroundColor: theme.card,
          borderColor: theme.border,
          padding: spacing.md,
          marginBottom: spacing.md,
          borderRadius: spacing.sm,
        },
        style,
      ]}
    >
      {title && (
        <Text
          style={[
            styles.title,
            { 
              color: theme.text,
              marginBottom: spacing.sm,
              fontSize: 16,
              fontWeight: 'bold'
            },
            titleStyle,
          ]}
        >
          {title}
        </Text>
      )}
      
      <View style={styles.content}>{children}</View>
      
      {footer && (
        <View style={[styles.footer, { marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: theme.border }]}>
          {footer}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {},
  content: {},
  footer: {},
});

export default Card;
