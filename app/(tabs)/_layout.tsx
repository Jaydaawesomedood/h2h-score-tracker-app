import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

import ThemedView from '@/components/ThemedView';
import TabBarIcon from '@/components/navigation/TabBarIcon';

import { regular } from '@/constants/styles/Text';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function TabLayout() {
  const backgroundColor = useThemeColor("tabBarBackground");
  const borderColor = useThemeColor("tabBarBorder");
  const activeColor = useThemeColor("tabIconSelected");

  const tabs = [
    // { page: "index", name: "Profile", icon: "user", tabBarShowLabel: true },
    { page: "index", name: "Matches", icon: "ranking-star", tabBarShowLabel: true },
    { page: "players", name: "Players", icon: "people-group", tabBarShowLabel: true },
    // { page: "stats", name: "Stats", icon: "chart-bar", tabBarShowLabel: true },
    { page: "settings", name: "Settings", icon: "gear", tabBarShowLabel: true },
  ];
  
  return (
    <ThemedView style={styles.main}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: activeColor,
          headerShown: false,
          tabBarStyle: { backgroundColor, borderColor }
        }}
      >
        {
          tabs.map(({ page, name, icon, ...otherProps }) => (
            <Tabs.Screen
              key={name.toLowerCase()}
              name={page}
              options={{
                title: name,
                tabBarIcon: ({ color }: any) => (
                  <TabBarIcon name={icon} color={color} />
                ),
                tabBarLabelStyle: { fontFamily: regular },
                ...otherProps
              }}
            />
          ))
        }
      </Tabs>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
});
