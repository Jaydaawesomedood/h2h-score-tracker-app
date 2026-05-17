import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import TabBarIcon from '@/components/navigation/TabBarIcon';

import PrimaryActionTabButton from '@/components/tabs/PrimaryActionTabButton';
import useThemeColor from '@/hooks/v2/useThemeColor';
import Modal from '@/components/_ui/modal/Modal';
import LogScoreHeader from '@/components/views/modals/log-score/LogScoreHeader';
import LogScoreBody from '@/components/views/modals/log-score/LogScoreBody';

export default function TabLayout() {
  const tabBgColor = useThemeColor('card');
  const tabBorderColor = useThemeColor('border');
  const tabItemActiveColor = useThemeColor('primary');
  const bgColor = useThemeColor('background');

  const [isLogScoreModalVisible, setIsLogScoreModalVisible] = useState<boolean>(false);

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
        }}
      >
        <Tabs.Screen
          name='index'
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => (<TabBarIcon name={'house'} color={color} />),
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
          }}
        />
        <Tabs.Screen
          name='settings'
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color }) => (<TabBarIcon name={'user-large'} color={color} />),
          }}
        />
      </Tabs>
      
      {/* Log Score Modal */}
      <Modal visible={isLogScoreModalVisible} onClose={() => setIsLogScoreModalVisible(false)} height={'85%'}>
        <Modal.Header>
          <LogScoreHeader onCloseModal={() => setIsLogScoreModalVisible(false)} />
        </Modal.Header>
        <Modal.Body>
          <LogScoreBody />
        </Modal.Body>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
});
