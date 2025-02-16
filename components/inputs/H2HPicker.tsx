import React, { Dispatch, Fragment, SetStateAction, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import SecondaryButton from "../buttons/SecondaryButton";
import PlayerProfileCard from "../views/players/PlayerProfileCard";
import ThemedDivider from "../views/ThemedDivider";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Player, Team } from "@/models/Player";
import H2HSelectPlayerModal from "../modals/H2HSelectPlayerModal";
import { H2HStats, StatsByPartner } from "@/models/Stats";
import { FontAwesome } from "@expo/vector-icons";
import ThemedText from "../ThemedText";
import { bold, light, medium, small, TextStyles } from "@/constants/styles/Text";

type Props = {
  player: Player;
  partners: StatsByPartner[];
  opponents: H2HStats[];
  partner: StatsByPartner | undefined;
  setPartner: Dispatch<SetStateAction<StatsByPartner | undefined>>;
  opponent: Player | Team | undefined;
  setOpponent: Dispatch<SetStateAction<any>>;
  toughestOpponents: any[]; // { id, opponent: Player | Team, h2h: number[] }
  opponentOnly?: boolean;
};

export default function H2HPicker({ player, partners, opponents, partner, setPartner, opponent, setOpponent, toughestOpponents, opponentOnly = false }: Props) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const type = useRef<"partner" | "opponent">();

  // Colors
  const backgroundColor = useThemeColor("cardBody");
  const placeholderColor = useThemeColor("inputPlaceholder");
  const removeBtn = useThemeColor("accentRed");
  
  return (
    <>
      <H2HSelectPlayerModal
        modal={{ isOpen: isModalOpen, onClose: () => setIsModalOpen(false) }}
        data={{ partners, opponents }}
        setters={{ setPartner, setOpponent }}
        type={type.current ?? "partner"}
        partnerSelected={partner !== undefined}
      />
      <View style={[styles.h2hContainer, { backgroundColor }]}>
        <View style={{ rowGap: 16, alignItems: "center" }}>
          <View style={styles.h2hTeamContainer}>
            <PlayerProfileCard player={player} imageSize={60} isVertical={true} style={{ flex: 1 }} />
            {
              partner &&
              <View style={{ flex: 1 }}>
                {
                  !opponentOnly &&
                  <TouchableOpacity style={styles.removePartnerBtnContainer} onPress={() => { setPartner(undefined); setOpponent(undefined); }}>
                    <View style={[styles.removePartnerBtn, { borderColor: backgroundColor }]}>
                      <FontAwesome name="times" size={20} color="red" />
                    </View>
                  </TouchableOpacity>
                }
                <PlayerProfileCard player={partner.partner} imageSize={60} isVertical={true} />
              </View>
            }
          </View>
          {
            (partners.length > 0 && !opponentOnly) &&
            <SecondaryButton title="Select Partner" onPress={() => { type.current = "partner"; setIsModalOpen(true); }} style={{ alignSelf: "center" }} />
          }
        </View>
        <ThemedDivider text="vs" />
        <View style={{ rowGap: 16 }}>
          <View style={styles.h2hTeamContainer}>
            {
              opponent ?
              <>
                <PlayerProfileCard player={partner ? (opponent as Team).players[0] : opponent as Player} imageSize={60} isVertical={true} style={{ flex: 1 }} />
                {
                  partner &&
                  <PlayerProfileCard player={(opponent as Team).players[1]} imageSize={60} isVertical={true} style={{ flex: 1 }} />
                }
              </>
              :
              <>
                <View style={[styles.placeholderContainer]}>
                  <View style={[styles.placeholder, { borderColor: placeholderColor }]}>
                    <FontAwesome name="plus" size={32} color={placeholderColor} />
                  </View>
                </View>
                {
                  partner &&
                  <View style={[styles.placeholderContainer]}>
                    <View style={[styles.placeholder, { borderColor: placeholderColor }]}>
                      <FontAwesome name="plus" size={32} color={placeholderColor} />
                    </View>
                </View>
                }
              </>
            }
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1, alignItems: "center" }}>
              <SecondaryButton title="Select Opponent" onPress={() => { type.current = "opponent"; setIsModalOpen(true); }} />
            </View>
            {
              opponent &&
              <View style={{ flex: 1, alignItems: "center" }}>
                <SecondaryButton
                  title="Remove"
                  onPress={() => { setOpponent(undefined); }}
                  icon="minus"
                  iconPosition="left"
                  customColor={removeBtn}
                />
              </View>
            }
          </View>
        </View>
        
        {
          // Toughest Opponents (only show when no opponents are selected)
          !opponent && toughestOpponents.length > 0 &&
          <>
            <ThemedDivider style={{ marginHorizontal: -16, marginTop: 8 }} />
            <View style={{ marginTop: 8 }}>
              <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8 }}>
                <ThemedText style={[text.section, { flex: 1 }]}>TOUGHEST OPPONENTS</ThemedText>
                <ThemedText style={[TextStyles.descriptions.small, { marginRight: 18 }]}>W - L</ThemedText>
              </View>
              <View style={{ rowGap: 16 }}>
                {
                  toughestOpponents.slice(0, partner ? 3 : 5).map((to, index) => (
                    <Fragment key={`player-toughest-opponent-${index}`}>
                      <ToughestOpponentCard
                        opponentStat={to}
                        hasPartnerSelected={partner !== undefined}
                      />
                      { 
                        index < toughestOpponents.length - 1 &&
                        <ThemedDivider style={{ opacity: 0.5 }} />
                      }
                    </Fragment>
                  ))
                }
              </View>
            </View>
          </>
        }
      </View>
    </>
  );
};

type TOCardProps = {
  hasPartnerSelected: boolean;
  opponentStat: any; // id, opponent, h2h
};

function ToughestOpponentCard({ hasPartnerSelected, opponentStat }: TOCardProps) {
  const badgeColor = useThemeColor("cardHeader");

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View style={{ flex: 1, rowGap: 8 }}>
        {
          hasPartnerSelected ?
          <>
            <PlayerProfileCard player={(opponentStat.opponent as Team).players[0]} />
            <PlayerProfileCard player={(opponentStat.opponent as Team).players[1]} />
          </>
          :
          <PlayerProfileCard player={opponentStat.opponent as Player} />
        }
      </View>
      <View style={[styles.toughestOpponentH2HBadge, { backgroundColor: badgeColor }]}>
        <ThemedText style={text.h2hText}>{opponentStat.h2h[0]}</ThemedText>
        <ThemedText style={text.h2hText}> - </ThemedText>
        <ThemedText style={[text.h2hText, { fontFamily: bold }]}>{opponentStat.h2h[1]}</ThemedText>
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
    flexDirection: "row",
    justifyContent: "space-around",
  },
  removePartnerBtnContainer: {
    position: "absolute",
    left: "25%",
    top: 0,
    zIndex: 5,
  },
  removePartnerBtn: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 28,
    borderWidth: 2,
    minWidth: 28,
    maxWidth: 28,
    minHeight: 28,
    maxHeight: 28,
  },
  placeholderContainer: {
    flex: 1,
    alignItems: "center",
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
  toughestOpponentH2HBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

const text = StyleSheet.create({
  section: {
    fontFamily: bold,
    fontSize: medium,
    lineHeight: medium,
    letterSpacing: 0.7,
    // marginTop: 16,
    paddingVertical: 8,
  },
  h2hText: {
    fontSize: medium,
    lineHeight: medium,
  }
});