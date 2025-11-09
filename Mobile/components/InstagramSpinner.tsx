import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  size?: number;        // tamaño en px del spinner
  strokeWidth?: number; // grosor del aro (en unidades del viewBox)
  duration?: number;    // ms por vuelta
  gap?: number;         // proporción de “hueco” (0.0–0.9). 0.28 ≈ IG
};

const VIEWBOX = 100;

const InstagramSpinner = ({
  size = 80,
  strokeWidth = 8,
  duration = 1100,
  gap = 0.28,
}: Props) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withRepeat(
      withTiming(1, { duration, easing: Easing.linear }),
      -1,
      false
    );
    return () => cancelAnimation(progress);
  }, [duration]);

  // Geometría del aro dentro del viewBox 0..100
  const r = (VIEWBOX - strokeWidth) / 2;           // radio del aro
  const C = 2 * Math.PI * r;                       // circunferencia
  const visible = C * (1 - gap);                   // segmento visible
  const hidden = C - visible;                      // hueco

  // Animamos el “barrido” del segmento con strokeDashoffset
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: interpolate(progress.value, [0, 1], [0, C]),
  }));

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Svg width={size} height={size} viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}>
        <Defs>
          <LinearGradient id="ig-grad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#feda75" />
            <Stop offset="25%" stopColor="#fa7e1e" />
            <Stop offset="50%" stopColor="#d62976" />
            <Stop offset="75%" stopColor="#962fbf" />
            <Stop offset="100%" stopColor="#4f5bd5" />
          </LinearGradient>
        </Defs>

        <AnimatedCircle
          cx={VIEWBOX / 2}
          cy={VIEWBOX / 2}
          r={r}
          fill="none"
          stroke="url(#ig-grad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${visible} ${hidden}`}
          animatedProps={animatedProps}
        />
      </Svg>
    </View>
  );
};

export default InstagramSpinner;
