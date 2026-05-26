import { View } from "react-native";
import H2HSelector from "./h2h/H2HSelector";
import { PlayerProfileTab } from "@/models/v2/views/PlayerProfileTab";
import { Player } from "@/models/v2/data/Player";
import { useMemo, useState } from "react";
import { PlayerStatsHelper } from "@/utils/v2/player-stats-helper.util";

type PlayerH2HTab = Omit<PlayerProfileTab, 'playerId'> & {
  player: Player,
};

export default function PlayerH2HTab(props: PlayerH2HTab) {
  const [selectedPartner, setSelectedPartner] = useState<Player | undefined>(undefined);
  const [selectedOpponent, setSelectedOpponent] = useState<Player[] | undefined>(undefined);
  
  const partners = useMemo(() => {
    return Object.values(PlayerStatsHelper.getAllPartners(props.matches, props.player.id)).map(value => value);
  }, [props.matches, props.player]);

  const opponents = useMemo(() => {
    return PlayerStatsHelper.getAllOpponents(
      props.matches.filter(match => match.type === (selectedPartner ? 'doubles' : 'singles')), 
      props.player.id,
      selectedPartner?.id
    );
  }, [selectedPartner]);

  return (
    <View
      onLayout={props.onLayout} 
      style={{ padding: 24, rowGap: 16 }}
    >
      <H2HSelector
        player={props.player}
        partners={partners}
        opponents={opponents}
        selectedPartner={selectedPartner}
        setSelectedPartner={setSelectedPartner}
        selectedOpponent={selectedOpponent}
        setSelectedOpponent={setSelectedOpponent}
      />
    </View>
  );
}