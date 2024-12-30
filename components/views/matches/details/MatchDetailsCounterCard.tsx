import ThemedText from "@/components/ThemedText";
import { bold, extraSmall, large, light, medium, regular } from "@/constants/styles/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, TextStyle, View } from "react-native";
import ThemedArcProgress from "../../ThemedArcProgress";
import { useEffect, useRef, useState } from "react";

type Props = {
  title?: string;
  h2h: Number[];
  isTransparent?: boolean;
  showDonutChart?: boolean;
  showPercentage?: boolean;
  textStyle?: TextStyle;
};

// TODO - Deprecate component
export default function MatchDetailsCounterCard({
  title,
  h2h,
  isTransparent = false,
  showDonutChart = true,
  showPercentage = false,
  textStyle
}: Props) {
  const cardRef = useRef<View | null>(null);
  const chartContainerRef = useRef<View | null>(null);

  const [chartContainerMeasurements, setChartContainerMeasurements] = useState<any>();
  const backgroundColor = !isTransparent ? useThemeColor("cardBody") : "transparent";

  const h2hArr = h2h.map((value: Number) => value.valueOf());

  const getPercentage = (index: number) => {
    return `(${((h2hArr[index] / (h2hArr[0] + h2hArr[1])) * 100).toFixed(2).toString()} %)`;
  };

  useEffect(() => {
    if (cardRef.current !== null) {
      // TODO - Thinking to segregate this logic somewhere
      chartContainerRef.current?.measureLayout(
        cardRef.current,
        (x, y, width, height) => { 
          setChartContainerMeasurements({ x, y, width, height });
        }
      );
    }
  }, []);

  return (
    <View style={[styles.cardContainer, { backgroundColor }]} ref={cardRef}>
      { title && <ThemedText style={styles.cardTitle}>{title}</ThemedText> }
      <View style={styles.contentContainer}>
        <View style={[styles.h2hContainer]}>
          <ThemedText style={[styles.h2hCounter, textStyle]}>{h2h[0].toString()}</ThemedText>
          { showPercentage && <ThemedText style={styles.h2hCounterSub}>{getPercentage(0)}</ThemedText> }
        </View>
        <View style={[styles.h2hContainer, { minHeight: 80 }]} ref={chartContainerRef}>
          {
            chartContainerMeasurements && showDonutChart &&
            <ThemedArcProgress
              parent={chartContainerMeasurements} 
              percentage={h2hArr[0] / (h2hArr[0] + h2hArr[1])}
            />
          }
        </View>
        <View style={[styles.h2hContainer]}>
          <ThemedText style={[styles.h2hCounter, textStyle]}>{h2h[1].toString()}</ThemedText>
          { showPercentage && <ThemedText style={styles.h2hCounterSub}>{getPercentage(1)}</ThemedText> }
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
  },
  cardTitle: {
    fontFamily: regular,
    fontSize: medium,
  },
  h2hContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  h2hCounter: {
    fontFamily: bold,
    fontSize: large,
  },
  h2hCounterSub: {
    fontFamily: light,
    fontSize: extraSmall,
  },
});