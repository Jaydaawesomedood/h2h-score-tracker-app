import SelectPlayerInput from "@/components/inputs/SelectPlayerInput";
import ThemedDropdown from "@/components/inputs/ThemedDropdown";
import SelectPlayerModal from "@/components/modals/SelectPlayerModal";
import ThemedText from "@/components/ThemedText";
import ThemedDivider from "@/components/views/ThemedDivider";
import { ToastMessages } from "@/constants/messages/Toast";
import { Steps } from "@/constants/constants";
import { Text, TextStyles } from "@/constants/styles/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Categories } from "@/models/Categories.enum";
import { Player, Team } from "@/models/Player";
import { AddMatchContext, StepperContext } from "@/utils/context";
import React, { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";

type Props = {
  isDropdownOpen: boolean;
  setIsDropdownOpen: Dispatch<SetStateAction<boolean>>;
  onDropdownPress: () => void;
};

export default function MatchPlayersForm({
  isDropdownOpen,
  setIsDropdownOpen,
  onDropdownPress,
}: Props) {
  // TODO - refactor context to one match property
  const { category, setCategory, subCategory, setSubCategory, teams, setTeams } = useContext(AddMatchContext);
  const { currentStep, setIsNextBtnDisabled } = useContext(StepperContext);
  const isFocused = currentStep === Steps["AddMatch"].map(s => s.label).indexOf("Players");

  const teamsRef = useRef([...teams]);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const [showAlertMessage, setShowAlertMessage] = useState<boolean>(false);

  // Colors
  const alertColor = useThemeColor("deleteIcon");

  const validateTeams = () => {
    if (teams[0].id === teams[1].id) {
      return false;
    }
    else {
      if (category === "doubles") {
        const arr = teams as Team[];
        const team1Players = arr[0].players.map((player: Player) => player.id);
        const team2Players = arr[1].players.map((player: Player) => player.id);
        let flag = true;

        for (const id of team1Players) {
          if (team2Players.includes(id)) {
            flag = false;
            break;
          }
        }

        return flag;
      }

      return true;
    }
  };

  useEffect(() => {
    if (isFocused) {
      if (teams.length === 2) {
        const validation = validateTeams();
        setShowAlertMessage(!validation);
        setIsNextBtnDisabled(!validation);
      }
      else setIsNextBtnDisabled(true);
    }
  }, [currentStep]);

  useEffect(() => {
    if (teams.length === 2) {
      const validation = validateTeams();
      setShowAlertMessage(!validation);
      setIsNextBtnDisabled(!validation);
    }
    else setIsNextBtnDisabled(true);
  }, [teams]);

  return (
    // TODO - Consolidate top view styling
    <ScrollView style={{ paddingHorizontal: 32 }}>
      {
        isFocused && 
        <>
          <SelectPlayerModal isOpen={modalOpen} onClose={() => setModalOpen(false)} activeIndex={index} />
          <View style={{ rowGap: 24 }}>
            <ThemedDropdown
              options={[
                { label: "Singles", value: "singles" },
                { label: "Doubles", value: "doubles" }
              ]}
              placeholder="Select Match Category"
              isOpen={isDropdownOpen}
              setIsOpen={setIsDropdownOpen}
              value={category}
              setValue={setCategory as Dispatch<SetStateAction<string>>}
              onPress={onDropdownPress}
              onChangeValue={() => { teamsRef.current = []; setTeams([]); }}
              label="Category"
              labelStyle={TextStyles.controls.input.label}
              containerStyle={{ zIndex: 10 }}
            />
            <ThemedDropdown
              options={
                Object.entries(Categories)
                .map(([key, value]) => ({ label: value, value: key.toLowerCase() }))
              }
              placeholder="Discipline"
              isOpen={false}
              setIsOpen={() => {}}
              value={subCategory}
              setValue={setSubCategory}
              onPress={() => {}}
              disabled={true}
              containerStyle={{ marginTop: -24 }}
            />
            <View>
              <ThemedText style={TextStyles.controls.input.label}>Team 1</ThemedText>
              <SelectPlayerInput
                placeholder={`Add ${category === "doubles" ? 'Team' : 'Player'}`}
                onPress={() => { setIndex(0); setModalOpen(true); }}
                index={0}
              />
            </View>
            <ThemedDivider text="vs" style={{ paddingHorizontal: 32 }} />
            <View>
              <ThemedText style={[TextStyles.controls.input.label, { opacity: teams.length < 1 ? 0.4 : 1 }]}>Team 2</ThemedText>
              <SelectPlayerInput
                placeholder={`Add ${category === "doubles" ? 'Team' : 'Player'}`}
                onPress={() => { setIndex(1); setModalOpen(true); }}
                disabled={teams.length < 1}
                index={1}
              />
            </View>
            {
              showAlertMessage ?
              <View>
                <ThemedText style={[TextStyles.descriptions.small, { color: alertColor }]}>{ToastMessages.AddMatchError_SamePlayersInTeams}</ThemedText>
              </View>
              : null
            }
          </View>
        </>
      }
    </ScrollView>
  );
};