import PlayerIcon from "@/components/_ui/PlayerIcon";
import ThemedText from "@/components/_ui/ThemedText";
import { Styles } from "@/constants/v2/Styles";
import { View, ScrollView } from "react-native";

export default function MatchReviewStep() {
  return (
    <View>
      <ScrollView contentContainerStyle={{ rowGap: 16, height: '100%'}}>
        <View style={[Styles.FLEX_COLUMN]}>
          <View style={[Styles.FLEX_HORIZONTAL_CENTER]}>
            <View>
              <PlayerIcon player={{ "firstName": "Jason", "lastName": "Choo", "id": "1", "color": "#b54aa5" }} />
              <ThemedText>Jason Choo</ThemedText>
            </View>
            <View style={{ marginHorizontal: 16 }}>
              <ThemedText>VS</ThemedText>
            </View>
            <View>
              <PlayerIcon player={{ "firstName": "Bryan", "lastName": "Kee", "id": "2", "color": "#c89b3a" }} />
              <ThemedText>Bryan Kee</ThemedText>
            </View>
          </View>
          <View style={[Styles.FLEX_HORIZONTAL_CENTER]}>
            <ThemedText>SET 1</ThemedText>
            <ThemedText>21</ThemedText>
            <ThemedText>23</ThemedText>
          </View>
          <View style={[Styles.FLEX_HORIZONTAL_CENTER]}>
            <ThemedText>SET 2</ThemedText>
            <ThemedText>21</ThemedText>
            <ThemedText>19</ThemedText>
          </View>
          <View style={[Styles.FLEX_HORIZONTAL_CENTER]}>
            <ThemedText>SET 3</ThemedText>
            <ThemedText>21</ThemedText>
            <ThemedText>16</ThemedText>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}