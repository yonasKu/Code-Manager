import React from 'react';
import { IconButton } from 'react-native-paper';

type PaperIconProps = {
  name: string;
  size?: number;
  color?: string;
  onPress?: () => void;
  style?: any;
};

const PaperIcon = ({ name, size = 24, color = '#000', onPress, style }: PaperIconProps) => {
  return (
    <IconButton
      icon={name}
      size={size}
      iconColor={color}
      onPress={onPress}
      style={style}
    />
  );
};

export default PaperIcon;
