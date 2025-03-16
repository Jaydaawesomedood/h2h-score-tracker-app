import React, { useContext, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import ThemedText from "@/components/ThemedText";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import ThemedInput from "@/components/inputs/ThemedInput";
import PlayerName from "@/components/text/PlayerName";
import ThemedDivider from "@/components/views/ThemedDivider";
import { Steps } from "@/constants/constants";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Player, Team } from "@/models/Player";
import { AddMatchContext, EditMatchContext, StepperContext } from "@/utils/context";

type Props = {
  isEditingMatch? : boolean;
};

type ScoreInputProps = {
  setIndex: number;
  onRemoveSet: () => void;
  isEditingMatch? : boolean;
};

export default function MatchScoreForm({ isEditingMatch = false }: Props) {
  // TODO - refactor context to one match property
  const { category, teams, score, setScore } = isEditingMatch ? useContext(EditMatchContext) : useContext(AddMatchContext);
  const { currentStep, setIsNextBtnDisabled } = useContext(StepperContext);
  const isFocused = currentStep === Steps[isEditingMatch ? "EditMatch" : "AddMatch"].map(s => s.label).indexOf("Score");

  const onAddSet = () => {
    let arr = [...score];
    arr.push([]);
    setScore([...arr]);
  };

  const onRemoveSet = (setIndex: number) => {
    let arr = [...score];
    arr.splice(setIndex, 1);
    setScore([...arr]);
  };
  
  useEffect(() => {
    if (isFocused) {
      if (score.length === 0) {
        // Reset scores if no scores are written
        let arr = [];
        arr.push([]);
        setScore([...arr]);
      }
    }
  }, [currentStep]);

  useEffect(() => {
    if (score.length >= 1) {
      // Check if there are no empty fields for each set score input
      let disabledFlag = true;

      for (let i = 0; i < score.length; i++) {
        if (score[i].length === 2) {
          if (i === score.length - 1) {
            disabledFlag = false;
            break;
          }
        }
        else {
          break;
        }
      }

      setIsNextBtnDisabled(disabledFlag);
    }
    else {
      setIsNextBtnDisabled(true);
    }
  }, [score])

  return (
    <ScrollView style={{ paddingHorizontal: 32 }}>
      {
        isFocused &&
        <>
          <View style={{ rowGap: 24 }}>
            <View style={[styles.teamContainer]}>
              {
                teams.length === 2 &&
                (
                category === "doubles" ?
                <>
                  <View style={{ rowGap: 8 }}>
                    <PlayerName player={(teams[0] as Team).players[0]} firstNameSettings={{ truncate: true }} />
                    <PlayerName player={(teams[0] as Team).players[1]} firstNameSettings={{ truncate: true }} />
                  </View>
                  <View style={{ alignItems: "flex-end", rowGap: 8 }}>
                    <PlayerName player={(teams[1] as Team).players[0]} firstNameSettings={{ truncate: true }} />
                    <PlayerName player={(teams[1] as Team).players[1]} firstNameSettings={{ truncate: true }} />
                  </View>
                </>
                :
                <>
                  <View>
                    <PlayerName player={teams[0] as Player} firstNameSettings={{ truncate: true }} />
                  </View>
                  <View>
                    <PlayerName player={teams[1] as Player} firstNameSettings={{ truncate: true }} />
                  </View>
                </>
                )
              }
            </View>
            <View>
              {
                score.map((_, index: number) => (
                  <ScoreInput key={`match-score-input-${index}`} setIndex={index} onRemoveSet={() => { onRemoveSet(index); }} isEditingMatch={isEditingMatch} />
                ))
              }
            </View>
            <SecondaryButton
              title="Add Set"
              icon="plus"
              iconPosition="left"
              onPress={onAddSet}
              style={{ alignSelf: "center", marginTop: 8 }}
            />
          </View>
        </>
      }
    </ScrollView>
  );
};

function ScoreInput({ setIndex, onRemoveSet, isEditingMatch = false }: ScoreInputProps) {
  const { score, setScore } = isEditingMatch ? useContext(EditMatchContext) : useContext(AddMatchContext);

  // Colors
  const deleteBtnColor = useThemeColor("deleteIcon");

  const onUpdateScore = (inputIndex: number, updatedScore: number) => {
    let arr = [...score];
    arr[setIndex].splice(inputIndex, 1, updatedScore);
    setScore([...arr]);
  };

  return (
    <View>
      <ThemedDivider text={`Set ${setIndex + 1}`} />
      <View style={[styles.scoreContainer]}>
        <ThemedInput
          keyboardType="number-pad"
          value={score[setIndex][0]?.toString() ?? ""}
          onChangeText={(text: string) => onUpdateScore(0, Number(text))}
          textAlign="center"
        />
        <ThemedText style={{ paddingHorizontal: 32 }}>-</ThemedText>
        <ThemedInput
          keyboardType="number-pad"
          value={score[setIndex][1]?.toString() ?? ""}
          onChangeText={(text: string) => onUpdateScore(1, Number(text))}
          textAlign="center"
        />
      </View>
      {
        score.length > 1 ?
        <SecondaryButton
          title="Remove"
          icon="trash"
          iconPosition="left"
          onPress={onRemoveSet}
          customColor={deleteBtnColor}
          style={{ alignSelf: "center", marginTop: 8, marginBottom: 16 }}
        />
        : null
      }
    </View>
  );
};

const styles = StyleSheet.create({
  teamContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scoreContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 16,
  },
});