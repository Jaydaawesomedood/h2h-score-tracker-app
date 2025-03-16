// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

import FontAwesome from '@expo/vector-icons/FontAwesome6';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import { type ComponentProps } from 'react';

export default function TabBarIcon({ style, ...rest }: IconProps<ComponentProps<typeof FontAwesome>['name']>) {
  return <FontAwesome size={20} style={[{ marginBottom: -3 }, style]} {...rest} />;
}
