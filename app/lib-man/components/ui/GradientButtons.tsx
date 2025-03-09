import { View, Text } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';

type ButtonId = 'penalty' | 'available' | 'holding' | 'Accept' | 'Decline';

type GradientButtonProps = {
  id: ButtonId;
};

const buttonDataMap: Record<ButtonId, { colours: readonly [string, string, string]; text: string }> = {
  penalty: {
    colours: [COLORS.red[300], COLORS.red[400], COLORS.red[600]],
    text: 'Penalty',
  },
  available: {
    colours: [COLORS.green[300], COLORS.green[400], COLORS.green[600]],
    text: 'Available',
  },
  holding: {
    colours: [COLORS.yellow[300], COLORS.yellow[400], COLORS.yellow[600]],
    text: 'Holding',
  },
  Accept: {
    colours: [COLORS.green[300], COLORS.green[400], COLORS.green[600]],
    text: 'Accept',
  },
  Decline: {
    colours: [COLORS.red[300], COLORS.red[400], COLORS.red[600]],
    text: 'Decline',
  },
};

const GradientButton = ({ id }: GradientButtonProps) => {
  const button = buttonDataMap[id];
  return (
    <View className="overflow-hidden rounded-md">
      <LinearGradient className="p-4" colors={button.colours}>
        <Text className="rounded-lg text-green-50">{button.text}</Text>
      </LinearGradient>
    </View>
  );
};

export default GradientButton;  