import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View, ViewProps } from "react-native";
import Animated, { interpolate, SharedValue, useEvent, useHandler, useSharedValue, useAnimatedStyle, ScrollEvent } from "react-native-reanimated";
import React, { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { medium, regular } from "@/constants/styles/Text";
import { useThemeColor } from "@/hooks/useThemeColor";

interface Tab {
  label: string;
  screen: ReactElement;
};

type Props = ViewProps & {
  tabs: Tab[];
};

type TabsProps = {
  tabs: string[];
  scrollX: SharedValue<number>;
  screenWidth: number;
  onTabPress: (tabIndex: number) => void;
};

type TabIndicatorProps = {
  measurements: any[];
  scrollX: SharedValue<number>;
  screenWidth: number;
};

// Tab Container
function Tabs({ tabs, scrollX, screenWidth, onTabPress }: TabsProps) {
  const tabsRef = useRef<Text[]>([]);
  const tabsContainerRef = useRef<View | null>(null);
  const [measurements, setMeasurements] = useState<any[]>([]);

  const color = useThemeColor('text');

  useEffect(() => {
    tabsRef.current = tabsRef.current.slice(0, tabs.length);
  }, [tabs]);

  useEffect(() => {
    const tabsMeasurements: any[] = [];
    tabsRef.current.forEach((tabRef) => {
      if (tabRef !== null && tabsContainerRef.current !== null) {
        tabRef.measureLayout(
          tabsContainerRef.current,
          (x, y, width, height) => {
            tabsMeasurements.push({ x, y, width, height });
            
            if (tabsMeasurements.length === tabsRef.current.length) {
              setMeasurements(tabsMeasurements);
            }
          }
        );
      }
    });
  }, [tabs]);

  return (
    <View>
      <View
        ref={tabsContainerRef}
        style={tabsStyles.tabsContainer}
      >
        {
          tabs.map((tab, index) => (
            // Tab Item
            <TouchableOpacity key={`match-details-tab-${tab}`} onPress={() => onTabPress(index)} style={tabStyles.tabContainer}>
              <View>
                <Text
                  style={[{ color, fontFamily: regular }, tabStyles.tabText]}
                  ref={el => { if (el) { tabsRef.current[index] = el } }}
                >
                  {tab}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        }
      </View>
      {
        measurements.length > 0 &&
        <TabIndicator
          measurements={measurements}
          scrollX={scrollX}
          screenWidth={screenWidth}
        />
      }
    </View>
  );
};

// Tab Indicator (the line that shows which tab is active)
function TabIndicator({ measurements, scrollX, screenWidth }: TabIndicatorProps) {
  const backgroundColor = useThemeColor("primary");
  const inputRange = measurements.map((_, index) => index * screenWidth);

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(
        scrollX.value,
        inputRange,
        measurements.map((measurement) => measurement.width)
      ),
      transform: [{
        translateX: interpolate(
          scrollX.value,
          inputRange,
          measurements.map((measurement) => measurement.x)
        )
      }]
    };
  });

  return (
    <Animated.View
      style={[
        tabStyles.indicator,
        { backgroundColor },
        indicatorStyle
      ]} 
    />
  );
};

export default function ThemedTabView({ tabs }: Props) {
  const screenWidth = useRef(Dimensions.get("window").width).current;
  const scrollX = useSharedValue(0); // to indicate tab indicator x value
  const tabViewRef = useRef<FlatList | null>(null);

  const canCallMomentum = useSharedValue(true);

  const onTabPress = useCallback((tabIndex: number) => {
    tabViewRef?.current?.scrollToOffset({
      offset: tabIndex * screenWidth
    });
  }, []);

  const handlers = {
    onScroll: (event: ScrollEvent) => {
      'worklet';
      canCallMomentum.value = true;
      scrollX.value = event.contentOffset.x;
    },
  };

  const { doDependenciesDiffer } = useHandler(handlers);

  const scrollHandler = useEvent(
    (event: ScrollEvent) => {
      'worklet';
      const { onScroll } = handlers;
      if (onScroll) {
        onScroll(event);
      }
    },
    ['onScroll'],
    doDependenciesDiffer
  );

  return (
    // View is needed to wrap around the Animated.FlatList, or Touchables will not work for screens out of bounds
    <View style={{ flex: 1 }}>
      <Tabs
        tabs={tabs.map(tab => tab.label)}
        scrollX={scrollX} 
        screenWidth={screenWidth}
        onTabPress={onTabPress}
      />
      <View style={{ flex: 1 }}>
        <Animated.FlatList
          ref={tabViewRef}
          data={tabs.map(tab => tab.screen)}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          onScroll={scrollHandler as any}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={{ width: screenWidth }}>{item}</View>
          )}
          // TODO - For future implementation of clamping tabview
          // onMomentumScrollEnd={() => {
          //   if (canCallMomentum.value) console.log('stop'); // we need to clamp the scrollview here
          //   canCallMomentum.value = false;
          // }}
          // onViewableItemsChanged={
          //   ({changed, viewableItems}) => {
          //     if (changed.length === viewableItems.length) {
          //       console.log(viewableItems[0]);
          //     }
          //   }
          // } // Or we can clamp by getting the props value
          viewabilityConfig={{ minimumViewTime: 200, itemVisiblePercentThreshold: 100 }}
        />
      </View>
    </View>
  );
};

const tabsStyles = StyleSheet.create({
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 16,
    paddingBottom: 8,
  },
});

const tabStyles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    justifyContent: "center",
  },
  tabText: {
    alignSelf: "center",
    fontSize: medium,
  },
  indicator: {
    position: "absolute",
    height: 4,
    bottom: 0,
  },
});