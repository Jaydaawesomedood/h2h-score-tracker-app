import { Modal, ScrollView, StyleSheet, View } from "react-native";
import ThemedText from "../ThemedText";
import ThemedView from "../ThemedView";
import SecondaryButton from "../buttons/SecondaryButton";
import PlayerProfileCard from "../views/players/PlayerProfileCard";
import { Modals } from "@/constants/styles/Containers";
import { bold, medium, TextStyles } from "@/constants/styles/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StatsByPartner } from "@/models/Stats";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  partners: StatsByPartner[];
};

export default function PlayerStatsPartnerModal({ isOpen, onClose, partners }: Props) {
  const divider = useThemeColor("cardBody");

  // TODO - Maybe we can try to revamp the table inside this modal, since its used in two locations
  return (
    <View>
      <Modal animationType="slide" transparent={true} visible={isOpen} onRequestClose={onClose} style={{ zIndex: 20 }}>
        <View style={styles.modal}>
          <ThemedView style={[Modals.content, { height: "90%", paddingVertical: 16 } ]}>
            <View>
              <View style={[Modals.titleContainer, { paddingVertical: 8 }]}>
                <ThemedText style={[TextStyles.titles.screen]}>Partners</ThemedText>
                <SecondaryButton title="Close" onPress={onClose} />
              </View>
              <View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 }}>
                  <View style={{ flexBasis: "65%" }}>
                    <ThemedText>Partner</ThemedText>
                  </View>
                  <View style={{ flexDirection: "row", flexBasis: "35%", justifyContent: "space-evenly" }}>
                    <ThemedText>G</ThemedText>
                    <ThemedText>W</ThemedText>
                    <ThemedText>WR</ThemedText>
                  </View>
                </View>
                <View style={{ width: "100%", height: 2, backgroundColor: divider }} />
                <ScrollView style={{ rowGap: 8 }}>
                  {
                    partners && partners.map((stats, index) => (
                      <View key={`player-stats-partner-${index}`} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", columnGap: 4 }}>
                          <View style={{ flexBasis: "5%" }}>
                            <ThemedText>{index + 1}</ThemedText>
                          </View>
                          <View style={{ flexBasis: "60%", overflow: "hidden" }}>
                            <PlayerProfileCard player={stats.partner} />
                          </View>
                        </View>
                        <View style={{ flexBasis: "35%", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
                          <ThemedText>{stats.totalGames}</ThemedText>
                          <ThemedText>{stats.gamesWon}</ThemedText>
                          <ThemedText>{stats.winRate}</ThemedText>
                        </View>
                      </View>
                    ))
                  }
                </ScrollView>
              </View>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
});

const text = StyleSheet.create({
  section: {
    fontFamily: bold,
    fontSize: medium,
    lineHeight: medium,
    letterSpacing: 0.7,
    marginTop: 16,
    paddingVertical: 8,
  },
});