import { Dispatch, SetStateAction } from "react";
import { FlatList, Modal, TouchableOpacity, View } from "react-native";
import ThemedText from "../ThemedText";
import ThemedView from "../ThemedView";
import SecondaryButton from "../buttons/SecondaryButton";
import PlayerProfileCard from "../views/players/PlayerProfileCard";
import TeamProfileCard from "../views/players/TeamProfileCard";
import { Modals, PlayerListItem } from "@/constants/styles/Containers";
import { TextStyles } from "@/constants/styles/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StatsByPartner } from "@/models/Stats";

type ModalProps = {
  modal: {
    isOpen: boolean,
    onClose: () => void,
  },
  data: {
    partners: StatsByPartner[],
    opponents: any[],
  },
  setters: {
    setPartner: Dispatch<SetStateAction<StatsByPartner | undefined>>,
    setOpponent: Dispatch<SetStateAction<any>>,
  },
  type: "partner" | "opponent",
  partnerSelected: boolean,
};

type ItemProps = {
  item: any,
  closeModal: () => void,
  setters: {
    setPartner: Dispatch<SetStateAction<StatsByPartner | undefined>>,
    setOpponent: Dispatch<SetStateAction<any>>,
  },
  type: "partner" | "opponent",
  partnerSelected: boolean,
};

// TODO - These select player modals maybe can be consolidated
export default function SelectPlayerModal({
  modal: { isOpen, onClose },
  data: { partners, opponents },
  setters,
  type,
  partnerSelected,
}: ModalProps) {
  
  // Colors
  const contentBackgroundColor = useThemeColor("background");
  const separatorColor = useThemeColor("itemSeparator");  

  return (
    <View>
      <Modal animationType="slide" transparent={true} visible={isOpen} onRequestClose={onClose}>
        <View style={Modals.backdrop}>
          <ThemedView style={[Modals.content, { backgroundColor: contentBackgroundColor, height: "90%" }]}>
            <View style={Modals.titleContainer}>
              <ThemedText style={TextStyles.titles.screen}>Select {type.charAt(0).toUpperCase() + type.slice(1)}</ThemedText>
              <SecondaryButton title="Close" onPress={onClose} />
            </View>
            <FlatList
              data={(type === "partner" ? partners : opponents.map(o => o.opponent)) as any[]}
              renderItem={ ({ item }) => <ListItem item={item} closeModal={onClose} type={type} setters={setters} partnerSelected={partnerSelected} /> }
              ItemSeparatorComponent={() => <View style={{ width: "100%", height: 0.5, backgroundColor: separatorColor }} />}
            />
          </ThemedView>
        </View>
      </Modal>
    </View>
  );
};

function ListItem({
  item,
  closeModal,
  setters: { setPartner, setOpponent },
  type,
  partnerSelected,
}: ItemProps) {

  const onPress = () => {
    if (type === "partner") {
      setPartner(item);
      setOpponent(undefined);
    }
    else {
      setOpponent(item);
    }

    closeModal();
  };

  const getItem = () => {
    if (type === "partner") {
      return <PlayerProfileCard player={item.partner} />;
    }
    else {
      if (partnerSelected) {
        return <TeamProfileCard team={item} style={{ paddingVertical: 4, flex: 1 }} />
      }
      else {
        return <PlayerProfileCard player={item} />;
      }
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={PlayerListItem.itemContainer}>
      {getItem()}
    </TouchableOpacity>
  );
};