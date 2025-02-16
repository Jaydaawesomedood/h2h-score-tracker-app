import { ScrollView, StyleSheet, View } from "react-native";
import ThemedView from "../ThemedView";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  headerImage: any;
}>;

export default function ThemedBannerView({ headerImage, children }: Props) {
  return (
    <ThemedView style={[styles.container]}>
      <ScrollView style={[styles.container]} contentContainerStyle={[styles.content]}>
        <View style={[styles.header]}>{headerImage}</View>
        <View style={[styles.content]}>{children}</View>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    overflow: 'hidden',
  },
  content: {
    flexGrow: 1
  },
});
