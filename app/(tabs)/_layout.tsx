import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { View, StyleSheet, Dimensions } from 'react-native';
import ActionButton from '@/components/buttons/ActionButton';
import { Text } from '@/constants/styles/Text';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function TabLayout() {
  const activeColor = useThemeColor("tabIconSelected");
  const label = Text.bottomTabLabel;

  const tabs = [
    { name: "Profile", icon: "user", tabBarShowLabel: true },
    { name: "Matches", icon: "ranking-star", tabBarShowLabel: true },
    { name: "Players", icon: "people-group", tabBarShowLabel: true },
    { name: "Settings", icon: "gear", tabBarShowLabel: true },
  ];

  return (
    <View style={styles.main}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: activeColor,
          headerShown: false,
        }}
      >
        {
          tabs.map(({ name, icon, ...otherProps }) => (
            <Tabs.Screen
              key={name.toLowerCase()}
              name={name.toLowerCase()}
              options={{
                title: name,
                tabBarIcon: ({ color }: any) => (
                  <TabBarIcon name={icon} color={color} />
                ),
                tabBarLabelStyle: { fontFamily: label.fontFamily },
                ...otherProps
              }}
            />
          ))
        }
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    // borderColor: 'red',
    // borderWidth: 1,
    // borderStyle: 'solid'
  },
  view: {
    backgroundColor: "#32a852",
    borderRadius: 64,
    width: 64,
    height: 64,
    position: "absolute",
    bottom: Dimensions.get('window').height * ((Dimensions.get('window').height > 900) ? 0.1 : 0.08),
    right: Dimensions.get('window').width * 0.03,
    // bottom: 0,
    zIndex: 3,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
