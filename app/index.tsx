import { View } from 'react-native';
import { Href, Redirect } from 'expo-router';

export default function HomeScreen() {
  return (
    <View>
      <Redirect href={'/(tabs)/profile' as Href} />
    </View>
  );
};
