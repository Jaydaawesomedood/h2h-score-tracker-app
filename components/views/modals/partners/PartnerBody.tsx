import useThemeColor from "@/hooks/v2/useThemeColor";
import { PartnerStat } from "@/models/v2/views/PlayerProfileTab";
import { FlatList, StyleSheet, View } from "react-native";

interface IPartnerBodyProps {
  row: React.ComponentType<any>,
  partners: PartnerStat[],
}

export default function PartnerBody(props: IPartnerBodyProps) {
  const dividerColor = useThemeColor('border');

  return (
    <FlatList
      data={props.partners}
      renderItem={({ item, index }) => {
        const Component = props.row;
        return (
          <View style={{ paddingVertical: 8 }}>
            <Component index={index + 1} partner={item} />
          </View>
        );
      }}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={<View style={[styles.divider, { backgroundColor: dividerColor }]} />}
      contentContainerStyle={{ paddingHorizontal: 24 }}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    height: 2,
    opacity: 0.6,
  }
});