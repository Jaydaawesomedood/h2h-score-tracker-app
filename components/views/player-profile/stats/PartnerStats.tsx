import Button from "@/components/_ui/button/Button";
import PlayerIcon from "@/components/_ui/custom-components/PlayerIcon";
import Modal from "@/components/_ui/modal/Modal";
import ThemedText from "@/components/_ui/ThemedText";
import { Styles } from "@/constants/v2/Styles";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { PartnerStat, PlayerStats } from "@/models/v2/views/PlayerProfileTab";
import { Fragment, useState } from "react";
import { StyleSheet, View } from "react-native";
import PartnerHeader from "../../modals/partners/PartnerHeader";
import PartnerBody from "../../modals/partners/PartnerBody";

interface IPartnerStatsProps {
  stats: PlayerStats,
}

interface IPartnerRowProps {
  index: number,
  partner: PartnerStat,
}

export default function PartnerStats(props: IPartnerStatsProps) {
  const primary = useThemeColor('primary');

  const [isPartnerModalVisible, setIsPartnerModalVisible] = useState<boolean>(false);

  const onClosePartnerModal = () => {
    setIsPartnerModalVisible(false);
  }

  return (
    <View style={{ rowGap: 16 }}>
      <ThemedText weight="bold" style={{ fontSize: 18 }}>Partners</ThemedText>
      <View id="player-stats-partners-table">
        {/* <View style={[Styles.FLEX_HORIZONTAL_SIDE, { marginBottom: 4, borderBottomColor: border, borderBottomWidth: 2 }]}>
          <View style={{ paddingBottom: 4 }}>
            <ThemedText>Partner</ThemedText>
          </View>
        </View> */}
        <View style={{ rowGap: 8 }}>
          {
            props.stats.partners && props.stats.partners.slice(0, 3).map((partner, index) => (
              <PartnerRow key={partner.id} index={index + 1} partner={partner} />
            ))
          }
        </View>
      </View>
      {
        props.stats.partners && props.stats.partners.length > 3 && (
          <Fragment>
            <View style={[Styles.FLEX_HORIZONTAL_CENTER]}>
              <Button
                type="secondary"
                onPress={() => setIsPartnerModalVisible(true)}
                text="View More"
                textStyle={{ color: primary }}
              />
            </View>
            <Modal
              visible={isPartnerModalVisible}
              onClose={onClosePartnerModal}
              height={'80%'}
            >
              <Modal.Header>
                <PartnerHeader onCloseModal={onClosePartnerModal} />
              </Modal.Header>
              <Modal.Body>
                <PartnerBody row={PartnerRow} partners={props.stats.partners} />
              </Modal.Body>
            </Modal>
          </Fragment>
        )
      }
    </View>
  );
}

function PartnerRow(props: IPartnerRowProps) {
  return (
    <View style={[styles.row, { paddingVertical: 4 }]}>
      <View style={{ width: '10%' }}>
        <ThemedText>{props.index}</ThemedText>
      </View>
      <View style={[styles.row, { flex: 1 }, Styles.FLEX_HORIZONTAL_SIDE]}>
        <View style={[styles.row, { columnGap: 8 }]}>
          <PlayerIcon size={32} player={props.partner as Pick<PartnerStat, 'id' | 'firstName' | 'lastName' | 'color'>} />
          <ThemedText>{props.partner.firstName} {props.partner.lastName}</ThemedText>
        </View>
        <View>
          <ThemedText weight="light" style={{ fontSize: 12 }}>{props.partner.won}W • {props.partner.lost}L</ThemedText>
        </View>
      </View>
      <View style={{ width: '20%' }}>
        <ThemedText weight="bold" style={{ textAlign: 'right' }}>{props.partner.winRate}%</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    ...Styles.FLEX_HORIZONTAL_CENTER,
    justifyContent: 'flex-start',
  }
});