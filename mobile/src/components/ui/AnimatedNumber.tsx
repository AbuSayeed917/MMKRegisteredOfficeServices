import { useEffect, useRef, useState } from "react";
import { Animated, Text, TextStyle } from "react-native";

type AnimatedNumberProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  style?: TextStyle;
  duration?: number;
  decimals?: number;
};

export function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  style,
  duration = 800,
  decimals = 0,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState("0");
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animValue.setValue(0);
    const listener = animValue.addListener(({ value: v }) => {
      const num = Math.round(v * Math.pow(10, decimals)) / Math.pow(10, decimals);
      setDisplay(decimals > 0 ? num.toFixed(decimals) : num.toLocaleString());
    });

    Animated.timing(animValue, {
      toValue: value,
      duration,
      useNativeDriver: false,
    }).start();

    return () => animValue.removeListener(listener);
  }, [value, duration, decimals, animValue]);

  return (
    <Text style={style}>
      {prefix}{display}{suffix}
    </Text>
  );
}
