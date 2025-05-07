import React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import Card from './Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconColor?: string;
  iconBackground?: string;
  change?: number;
  style?: ViewStyle;
}

/**
 * Stats card for displaying analytics data with icons and change indicators
 */
const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  iconColor,
  iconBackground,
  change,
  style,
}) => {
  const { theme, spacing } = useTheme();
  
  // Determine if change is positive, negative, or neutral
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  
  // Determine the color for the change indicator
  const changeColor = isPositive 
    ? theme.success 
    : isNegative 
      ? theme.error 
      : theme.secondaryText;
  
  // Default icon colors if not provided
  const defaultIconColor = theme.primary;
  const defaultIconBackground = `${theme.primary}20`; // 20% opacity
  
  return (
    <Card style={[styles.container, style]}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.secondaryText }]}>
            {title}
          </Text>
          <Text style={[styles.value, { color: theme.text }]}>
            {value}
          </Text>
          
          {change !== undefined && (
            <View style={styles.changeContainer}>
              <Ionicons 
                name={isPositive ? 'arrow-up' : isNegative ? 'arrow-down' : 'remove'} 
                size={14} 
                color={changeColor} 
              />
              <Text style={[styles.changeText, { color: changeColor }]}>
                {Math.abs(change).toFixed(1)}%
              </Text>
              <Text style={[styles.period, { color: theme.secondaryText }]}>
                vs last week
              </Text>
            </View>
          )}
        </View>
        
        <View 
          style={[
            styles.iconContainer, 
            { 
              backgroundColor: iconBackground || defaultIconBackground,
            }
          ]}
        >
          <Ionicons 
            name={icon as any} 
            size={24} 
            color={iconColor || defaultIconColor} 
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 100,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 2,
    marginRight: 4,
  },
  period: {
    fontSize: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StatsCard;
