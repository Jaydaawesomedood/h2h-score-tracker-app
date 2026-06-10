import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import TabBarIcon from '@/components/navigation/TabBarIcon';

import PrimaryActionTabButton from '@/components/tabs/PrimaryActionTabButton';
import useThemeColor from '@/hooks/v2/useThemeColor';
import LogScoreProvider from '@/providers/LogScoreProvider';
import LogScoreModal from '@/components/v2/modals/LogScoreModal';
import { OnboardingSpotlightStep } from '@/components/_ui/onboarding/OnboardingSpotlightStep';

export default function TabLayout() {
  const tabBgColor = useThemeColor('card');
  const tabBorderColor = useThemeColor('border');
  const tabItemActiveColor = useThemeColor('primary');
  const bgColor = useThemeColor('background');

  const [isLogScoreModalVisible, setIsLogScoreModalVisible] = useState<boolean>(false);

  const onCloseLogScoreModal = () => {
    setIsLogScoreModalVisible(false);
  }

  return (
    <View style={[styles.main, { backgroundColor: bgColor }]}>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: tabBgColor,
            borderColor: tabBorderColor,
          },
          sceneStyle: {
            backgroundColor: bgColor
          },
          tabBarActiveTintColor: tabItemActiveColor,
          headerShown: false,
          animation: "fade",
          tabBarLabelStyle: {
            fontFamily: 'LeagueSpartanRegular',
          }
        }}
      >
        <Tabs.Screen
          name='index'
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => (<TabBarIcon name={'house'} color={color} />),
            tabBarButton: (props) => {
              const { ref, ...restProps } = props as any;

              return (
                <OnboardingSpotlightStep 
                  name="home_tab" 
                  style={{ flex: 1 }}
                >
                  <Pressable ref={ref} {...restProps} style={[{ flex: 1 }, restProps.style]} />
                </OnboardingSpotlightStep>
              );
            }
          }}
        />
        <Tabs.Screen
          name='history'
          options={{
            tabBarLabel: 'History',
            tabBarIcon: ({ color }) => (<TabBarIcon name={'chart-bar'} color={color} />),
          }}
        />
        <Tabs.Screen
          name='custom'
          options={{
            tabBarLabel: 'custom',
            tabBarButton: () => (<PrimaryActionTabButton onPress={() => setIsLogScoreModalVisible(true)} />)
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
            }
          }}
        />
        <Tabs.Screen
          name='players'
          options={{
            tabBarLabel: 'Players',
            tabBarIcon: ({ color }) => (<TabBarIcon name={'people-group'} color={color} />),
            tabBarButton: (props) => {
              const { ref, ...restProps } = props as any;

              return (
                <OnboardingSpotlightStep 
                  name="players_tab"
                  style={{ flex: 1 }}
                >
                  <Pressable ref={ref} {...restProps} style={[{ flex: 1 }, restProps.style]} />
                </OnboardingSpotlightStep>
              );
            }
          }}
        />
        <Tabs.Screen
          name='settings'
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color }) => (<TabBarIcon name={'gear'} color={color} />)
          }}
        />
      </Tabs>
      
      {/* Log Score Modal */}
      <LogScoreProvider>
        <LogScoreModal isVisible={isLogScoreModalVisible} onCloseModal={onCloseLogScoreModal} />
      </LogScoreProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
});
