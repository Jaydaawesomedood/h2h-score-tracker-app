import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { openURL } from "expo-linking";
import { useContext } from "react";
import { List, Switch } from "react-native-paper";

import ScreenTitle from "@/components/screens/ScreenTitle";
import ThemedView from "@/components/_ui/ThemedView";

import { Containers } from "@/constants/styles/Containers";
import { medium, regular, small } from "@/constants/styles/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { DbContext, useDataStore, useThemeStore } from "@/utils/context";
import { showMessageToast } from "@/utils/toast.util";
import { DeleteAllData } from "@/utils/database/database";

export default function SettingsScreen() {
  const db = useContext(DbContext);
  const { clearAllParticipants, clearAllMatches } = useDataStore();
  const { isLightMode, setIsLightMode } = useThemeStore();

  const textColor = useThemeColor("text");
  const clearAllBtnColor = useThemeColor("accentRed");
  const primary = useThemeColor("primary");

  const clearAllData = async () => {
    if (db) {
      await DeleteAllData(db);
      clearAllParticipants();
      clearAllMatches();
      showMessageToast("Data cleared for user");
    }
  };

  const setTheme = async () => {
    
    try {
      setIsLightMode();
      await AsyncStorage.setItem('lightmode', (!isLightMode.valueOf()).toString());
    }
    catch (err: any) {
      console.log(err);
    }
  };

  return (
    <ThemedView style={[Containers.screen]}>
      <ScreenTitle title="Settings" />
      <List.Section style={{ rowGap: 16 }}>
        <List.Item
          title="Light Mode"
          left={() => (<FontAwesome5 name="adjust" size={24} color={textColor} />)}
          right={() => (<Switch value={isLightMode} onValueChange={setTheme} color={primary} />)}
          titleStyle={[
            textStyle,
            { color: textColor }
          ]}
        />
        <List.Item
          title={"Submit Feedback"}
          onPress={() => { openURL("https://forms.gle/Ukv5fp1os26zgVNF9") }}
          left={() => (<FontAwesome5 name="external-link-alt" size={24} color={textColor} />)}
          titleStyle={[
            textStyle,
            { color: textColor }
          ]}
        />
        <List.Item
          title={"Support Me!"}
          onPress={() => { openURL("https://buymeacoffee.com/pyromancer0826") }}
          left={() => (<FontAwesome5 name="heart" size={24} color={textColor} />)}
          titleStyle={[
            textStyle,
            { color: textColor }
          ]}
        />
        <List.Item
          title="Clear All Data"
          onPress={clearAllData}
          left={() => (<FontAwesome5 name="trash-alt" size={16} color={clearAllBtnColor} />)}
          titleStyle={[
            textStyle,
            { color: clearAllBtnColor, fontSize: small + 2, lineHeight: small + 4 }
          ]}
          style={{ marginTop: 8 }}
        />
      </List.Section>
    </ThemedView>
  );
}

const textStyle = {
  fontFamily: regular,
  fontSize: medium,
  lineHeight: medium + 4,
};