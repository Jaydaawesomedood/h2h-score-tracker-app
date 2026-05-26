import Button from "@/components/_ui/button/Button";
import Divider from "@/components/_ui/custom-components/Divider";
import PlayerIcon from "@/components/_ui/custom-components/PlayerIcon";
import ThemedText from "@/components/_ui/ThemedText";
import SelectH2HModal from "@/components/v2/modals/SelectH2HPartnerModal";
import { Styles } from "@/constants/v2/Styles";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { Player } from "@/models/v2/data/Player";
import { FontAwesome } from "@expo/vector-icons";
import { Fragment, SetStateAction, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface IH2HSelectorProps {
  player: Player,
  partners: Player[],
  opponents: Player[][],
  selectedPartner: Player | undefined,
  setSelectedPartner: React.Dispatch<SetStateAction<Player | undefined>>;
  selectedOpponent: Player[] | undefined,
  setSelectedOpponent: React.Dispatch<SetStateAction<Player[] | undefined>>;
}

interface IPlayerOverviewProps {
  player: Player,
}

export default function H2HSelector({ selectedPartner, setSelectedPartner, selectedOpponent, setSelectedOpponent, ...props }: IH2HSelectorProps) {
  const backgroundColor = useThemeColor('card');
  const primary = useThemeColor('primary');
  const removeIconBackgroundColor = useThemeColor('red');

  const [modalType, setModaltype] = useState<'partner' | 'opponent'>();
  const [isSelectH2HModalVisible, setIsSelectH2HModalVisible] = useState<boolean>(false);

  const handleCloseSelectH2HModal = () => {
    setIsSelectH2HModalVisible(false);
  }

  const renderOpponent = (player?: Player) => {
    if (!player) {
      return <SelectPlayerPlaceholder />
    }
    return <PlayerOverview player={player} />
  }

  return (
    <Fragment>
      <View style={[styles.h2hContainer, { backgroundColor }]}>
        <View style={{ rowGap: 8, alignItems: "center" }}>
          <View style={[styles.h2hTeamContainer]}>
            <View style={{ flex: 1 }}>
              <PlayerOverview player={props.player} />
            </View>
            {
              selectedPartner && (
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    style={[styles.removePartnerBtnContainer]}
                    onPress={() => {
                      setSelectedPartner(undefined);
                      setSelectedOpponent(undefined);
                    }}
                  >
                    <View style={[
                      styles.removePartnerBtn,
                      { backgroundColor: removeIconBackgroundColor }
                    ]}
                    >
                      <FontAwesome name="times" size={20} color="white" />
                    </View>
                  </TouchableOpacity>
                  <PlayerOverview player={selectedPartner} />
                </View>
              )
            }
          </View>
          {
            props.partners.length > 0 && (
              <Button
                text="Select Partner"
                onPress={() => {
                  setIsSelectH2HModalVisible(true);
                  setModaltype('partner');
                }}
                textStyle={{ color: primary }}
              />
            )
          }
        </View>
        <Divider text="vs" />
        <View style={{ rowGap: 8, alignItems: "center" }}>
          <View style={[styles.h2hTeamContainer]}>
            <View style={{ flex: 1 }}>
              { renderOpponent(selectedOpponent?.[0]) }
            </View>
            {
              selectedPartner && (
                <View style={{ flex: 1 }}>
                  { renderOpponent(selectedOpponent?.[1]) }
                </View>
              )
            }
          </View>
          <Button
            text="Select Opponent"
            type="secondary"
            onPress={() => {
              setIsSelectH2HModalVisible(true);
              setModaltype('opponent');
            }}
            textStyle={{ color: primary }}
          />
        </View>
      </View>
      <SelectH2HModal
        isVisible={isSelectH2HModalVisible}
        onCloseModal={handleCloseSelectH2HModal}
        bodyProps={{
          type: modalType,
          players: modalType === 'partner' ? props.partners.map(p => ([p])) : props.opponents,
          setPartner: (partner: Player) => { setSelectedPartner(partner); },
          setOpponent: (opponent: Player[]) => { setSelectedOpponent(opponent); },
          onCloseModal: handleCloseSelectH2HModal
        }}
      />
    </Fragment>
  );
}

function PlayerOverview({ player }: IPlayerOverviewProps) {
  return (
    <View style={[Styles.FLEX_COLUMN, { alignItems: 'center', rowGap: 4 }]}>
      <PlayerIcon player={player} size={48} />
      <View style={{ width: '100%', alignItems: 'center' }}>
        <ThemedText style={styles.playerOverviewText}>{player.firstName}</ThemedText>
        <ThemedText style={styles.playerOverviewText}>{player.lastName}</ThemedText>
      </View>
    </View>
  );
}

function SelectPlayerPlaceholder() {
  const muted = useThemeColor('muted');

  return (
    <View style={[Styles.FLEX_HORIZONTAL_CENTER]}>
      <View style={[styles.placeholder, { borderColor: muted }]}>
        <FontAwesome name="plus" size={32} color={muted} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  h2hContainer: {
    borderRadius: 8,
    rowGap: 8,
    padding: 16,
  },
  h2hTeamContainer: {
    ...Styles.FLEX_HORIZONTAL_CENTER,
    justifyContent: "space-around",
  },
  playerOverviewText: {
    width: '100%',
    textAlign: 'center'
  },
  removePartnerBtnContainer: {
    position: "absolute",
    left: "25%",
    top: 0,
    zIndex: 5,
  },
  removePartnerBtn: {
    ...Styles.FLEX_HORIZONTAL_CENTER,
    borderRadius: 100,
    borderWidth: 1,
    minWidth: 28,
    maxWidth: 28,
    minHeight: 28,
    maxHeight: 28,
  },
  placeholder: {
    padding: 8,
    borderRadius: 60,
    borderWidth: 2,
    borderStyle: "dotted",
    minWidth: 68,
    maxWidth: 68,
    minHeight: 68,
    maxHeight: 68,
    alignItems: "center",
    justifyContent: "center",
  },
})