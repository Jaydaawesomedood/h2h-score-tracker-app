import { BorderDebug } from "@/constants/styles/Containers";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LayoutRectangle, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

type Props = {
  parent: any;
  percentage: number;
};

export default function ThemedArcProgress({ parent, percentage }: Props) {
  const color1 = useThemeColor("accentRed");
  const color2 = useThemeColor("accentBlue");
  
  const strokeWidth = 8;
  const { PI, cos, sin } = Math;
  const cx = parent.x + (parent.width / 2);  // coordinate x
  const cy = parent.y + (parent.height / 2) + 8;  // coordinate y
  const radius = (parent.width - strokeWidth) / 2;
  const arcAngle = PI + PI * 0.4;
  const startAngle = PI + PI * 0.1;
  const endAngle = 2 * PI - PI * 0.1;
  const startX = cx - radius * cos(startAngle);
  const startY = -radius * sin(startAngle) + cy;
  const endX = cx - radius * cos(endAngle);
  const endY = -radius * sin(endAngle) + cy;
  const d = `M ${startX} ${startY} A ${radius} ${radius} 0 1 0 ${endX} ${endY}`;
  const circumference = radius * arcAngle;

  return (
    <Svg width={"100%"} height={80} viewBox={`${parent.x} ${parent.y - 10} ${parent.width} ${parent.height}`}>
      <Path
        stroke={color1}
        fill="none"
        d={d}
        strokeWidth={strokeWidth}
        strokeDasharray={`${circumference} ${circumference}`}
      />
      <Path
        stroke={color2}
        fill="none"
        d={d}
        strokeWidth={strokeWidth}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={5 * percentage * radius}
      />
    </Svg>
    // <></>
  );
};