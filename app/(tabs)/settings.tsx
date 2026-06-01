import { MatchesService } from "@/api/MatchesService/MatchesService";
import { PlayersService } from "@/api/players/PlayersService";
import Button from "@/components/_ui/button/Button";
import PopupModal from "@/components/_ui/modal/PopupModal";
import ThemedText from "@/components/_ui/ThemedText";
import ThemedView from "@/components/_ui/ThemedView";
import { Styles } from "@/constants/v2/Styles";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { FontAwesome5 } from "@expo/vector-icons";
import { openURL } from "expo-linking"
import { useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";

interface ISettingsItemProps {
  setting: {
    title: string,
    onPress: () => void,
    icon: string,
    color?: string,
  }
}

export default function SettingsScreen() {
  const deleteColor = useThemeColor("red");
  const muted = useThemeColor("muted");

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(false);

  const settings = useMemo(() => ([
    {
      title: 'Submit Feedback',
      onPress: () => { openURL("https://forms.gle/Ukv5fp1os26zgVNF9") },
      icon: 'external-link-square-alt',
    },
    {
      title: 'Support Me!',
      onPress: () => { openURL("https://buymeacoffee.com/pyromancer0826") },
      icon: 'heart',
    },
    {
      title: 'Clear All Data',
      onPress: async () => setIsDeleteModalVisible(true),
      icon: 'trash-alt',
      color: deleteColor,
    }
  ]), []);

  const handleClearAllData = async () => {
    await MatchesService.Nuke();
    await PlayersService.Nuke();
    setIsDeleteModalVisible(false);
  }

  return (
    <ThemedView style={[Styles.SCREEN_BODY, { rowGap: 24 }]}>
      <View style={{ rowGap: 8 }}>
        <ThemedText weight="bold" style={{ fontSize: 36, lineHeight: 48 }}>Settings</ThemedText>
        <ThemedText style={{ color: muted, lineHeight: 18 }}>
          Thanks for downloading!{'\n'}
          I'll be adding more features along the way. Let me know how can I make this app better!
        </ThemedText>
      </View>
      <View style={{ rowGap: 24 }}>
        {/* <List.Item
          title="Light Mode"
          left={() => (<FontAwesome5 name="adjust" size={24} color={textColor} />)}
          right={() => (<Switch value={isLightMode} onValueChange={setTheme} color={primary} />)}
          titleStyle={[
            textStyle,
            { color: textColor }
          ]}
        /> */}
        {
          settings.map(setting => (
            <SettingsItem key={setting.title} setting={setting} />
          ))
        }
      </View>
      <PopupModal visible={isDeleteModalVisible} onClose={() => setIsDeleteModalVisible(false)}>
        <PopupModal.Body>
          <View style={{ rowGap: 8 }}>
            <ThemedText style={{ fontSize: 18 }}>Are you sure you want to clear all data?</ThemedText>
            <ThemedText weight="light">This action is irreversible!</ThemedText>
          </View>
        </PopupModal.Body>
        <PopupModal.Footer>
          <View style={[Styles.FLEX_HORIZONTAL_SIDE]}>
            <Button
              type="secondary"
              text="Cancel"
              onPress={() => setIsDeleteModalVisible(false)}
              buttonStyle={{ flex: 1, justifyContent: 'center' }}
            />
            <Button
              type="primary"
              text="Yes, delete"
              onPress={handleClearAllData}
              buttonStyle={{ flex: 1, backgroundColor: deleteColor }}
              weight="bold"
            />
          </View>
        </PopupModal.Footer>
      </PopupModal>
    </ThemedView>
  );
}

function SettingsItem({ setting }: ISettingsItemProps) {
  const text = useThemeColor("text");

  return (
    <TouchableOpacity
      onPress={setting.onPress}
      style={[Styles.FLEX_HORIZONTAL_CENTER, { justifyContent: 'flex-start', columnGap: 16 }]}
    >
      <View style={{ width: '10%' }}>
        <FontAwesome5 name={setting.icon} size={24} color={setting.color ?? text} />
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText style={[setting.color && { color: setting.color }, { fontSize: 16 }]}>{ setting.title }</ThemedText>
      </View>
    </TouchableOpacity>
  );
}