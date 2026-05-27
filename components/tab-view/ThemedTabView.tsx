import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View, ViewProps } from "react-native";
import Animated, { interpolate, SharedValue, useEvent, useHandler, useSharedValue, useAnimatedStyle, ScrollEvent } from "react-native-reanimated";
import { medium, regular } from "@/constants/styles/Text";
import { useThemeColor } from "@/hooks/useThemeColor";

interface Tab {
  label: string,
  screen: {
    Component: React.ComponentType<any>,
    props?: any,
  },
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
  const SCREEN_WIDTH = useRef(Dimensions.get("window").width).current;
  const SCREEN_HEIGHT = useRef(Dimensions.get("window").height).current;
  const scrollX = useSharedValue(0); // to indicate tab indicator x value
  const tabViewRef = useRef<FlatList | null>(null);

  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [flatListHeight, setFlatListHeight] = useState<number | undefined>(undefined);
  const tabHeights = useRef<{[key: number]: number}>({});

  const onTabPress = useCallback((tabIndex: number) => {
    setActiveTabIndex(tabIndex);
    tabViewRef?.current?.scrollToOffset({
      offset: tabIndex * SCREEN_WIDTH
    });
    const knownHeight = tabHeights.current[tabIndex];
    if (knownHeight) setFlatListHeight(knownHeight);
  }, []);

  const handlers = {
    onScroll: (event: ScrollEvent) => {
      'worklet';
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

  const handleItemLayout = (index: number, height: number) => {
    const rounded = Math.round(height);
    if (tabHeights.current[index] === rounded) return;
    tabHeights.current[index] = rounded;

    if (index === activeTabIndex) {
      setFlatListHeight(prev => (prev === rounded ? prev : rounded));
    }
  }

  return (
    // View is needed to wrap around the Animated.FlatList, or Touchables will not work for screens out of bounds
    <View style={{ flex: 1 }}>
      <Tabs
        tabs={tabs.map(tab => tab.label)}
        scrollX={scrollX} 
        screenWidth={SCREEN_WIDTH}
        onTabPress={onTabPress}
      />
      <View>
        <Animated.FlatList
          ref={tabViewRef}
          data={tabs.map(tab => tab.screen)}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          onScroll={scrollHandler as any}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item: { Component, props }, index }) => {
            return (
              <View
                style={[{ width: Dimensions.get('window').width }]}
              >
                <Component
                  onLayout={(event: LayoutChangeEvent) => {
                    if (tabHeights.current[index] && Math.round(tabHeights.current[index]) === Math.round(event.nativeEvent.layout.height)) return;
                    handleItemLayout(index, event.nativeEvent.layout.height);
                  }}
                  {...props}
                />
              </View>
            )
          }}
          scrollEnabled={false}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          style={{ height: flatListHeight, minHeight: SCREEN_HEIGHT }}
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
