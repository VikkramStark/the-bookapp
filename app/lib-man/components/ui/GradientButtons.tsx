import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';

type ButtonId = 'penalty' | 'available' | 'borrowed' | 'Accept' | 'Decline'|'Return'|'Borrow';

interface GradientButtonProps {
  id: ButtonId;
  onPress?: () => void;
  disabled?: boolean;
  children?: React.ReactNode; // Add children prop
}

const buttonDataMap: Record<ButtonId, { colours: readonly [string, string, string]; text: string }> = {
  penalty: {
    colours: [COLORS.red[300], COLORS.red[400], COLORS.red[600]],
    text: 'Penalty',
  },
  available: {
    colours: [COLORS.green[300], COLORS.green[400], COLORS.green[600]],
    text: 'Available',
  },
  borrowed: {
    colours: [COLORS.yellow[300], COLORS.yellow[400], COLORS.yellow[600]],
    text: 'Borrowed',
  },
  Accept: {
    colours: [COLORS.green[300], COLORS.green[400], COLORS.green[600]],
    text: 'Accept',
  },
  Decline: {
    colours: [COLORS.red[300], COLORS.red[400], COLORS.red[600]],
    text: 'Decline',
  },
  Return: {
    colours: [COLORS.green[300], COLORS.green[400], COLORS.green[600]],
    text: 'Return',
  },
  Borrow: {
    colours: ['#808080','#0e0e0e','#000000'],
    text: 'Borrow',
  },

};

const defaultButtonData = {
  colours: ['#808080', '#505050', '#303030'] as const,
  text: 'Unknown',
};

const GradientButton: React.FC<GradientButtonProps> = ({ id, onPress, disabled, children }) => {
  const button = buttonDataMap[id] || defaultButtonData;
  return (
    <Pressable onPress={onPress} className="overflow-hidden rounded-md">
      {/* <LinearGradient className="p-4" colors={button.colours}> */}
      <LinearGradient colors={button.colours}>
        <Text className="rounded-lg text-green-50 p-4">{button.text}</Text>
      </LinearGradient>
    </Pressable>
  );
};

export default GradientButton;