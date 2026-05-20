import Button from "@/components/_ui/button/Button";
import DashedIconButton from "@/components/_ui/button/DashedIconButton";
import TextInput from "@/components/_ui/input/TextInput";
import ThemedText from "@/components/_ui/ThemedText";
import { Styles } from "@/constants/v2/Styles";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

interface ISetCardProps {
  setIndex: number,
  removable?: boolean,
  onRemove: () => void,
  sets: number[][],
  onValueChange: (setIndex: number, playerIndex: number, score: number) => void,
}

interface IScoreInputProps {
  setIndex: number,
  playerIndex: number,
  value?: number,
  onValueChange: (setIndex: number, playerIndex: number, score: number) => void,
}

export default function MatchScoreStep() {
  const [sets, setSets] = useState<number[][]>([[]]);

  const card = useThemeColor('card');
  const border = useThemeColor('border');
  const muted = useThemeColor('muted');

  const handleAddSet = () => {
    setSets([...sets, []]);
  }

  const handleRemoveSet = (index: number) => {
    const arr = sets.slice();
    arr.splice(index, 1);
    setSets(arr);
  }

  const handleUpdateScore = (setIndex: number, playerIndex: number, score: number) => {
    const updatedSets = sets.slice();
    updatedSets[setIndex][playerIndex] = score;
    setSets(updatedSets);
  }

  return (
    <View style={[Styles.FLEX_COLUMN, { rowGap: 16, height: '100%' }]}>
      <ThemedText style={{ color: muted }}>
        What's the score?
      </ThemedText>
      <ScrollView contentContainerStyle={{ rowGap: 16 }}>
        <View style={[styles.setCardContainer, Styles.FLEX_HORIZONTAL_CENTER, { backgroundColor: card, borderColor: border, columnGap: 24, paddingVertical: 16 }]}>
          <ThemedText weight="bold" style={{ flex: 1, textAlign: 'center' }}>Jason</ThemedText>
          <ThemedText weight="bold" style={{ color: muted }}>VS</ThemedText>
          <ThemedText weight="bold" style={{ flex: 1, textAlign: 'center' }}>Bryan</ThemedText>
        </View>
        <View style={[Styles.FLEX_COLUMN, { rowGap: 16, height: '100%' }]}>
          {
            sets.map((set, index) => (
              <SetCard
                key={`log-score-set-${index}`}
                setIndex={index + 1}
                removable={index > 0}
                onRemove={() => handleRemoveSet(index)}
                sets={sets}
                onValueChange={handleUpdateScore}
              />
            ))
          }
          <DashedIconButton
            text="Add set"
            onPress={handleAddSet}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function SetCard(props: ISetCardProps) {
  const background = useThemeColor('card');
  const border = useThemeColor('border');
  const muted = useThemeColor('muted');
  const red = useThemeColor('red');

  return (
    <View style={[Styles.FLEX_COLUMN, styles.setCardContainer, { backgroundColor: background, borderColor: border }]}>
      <View style={[Styles.FLEX_HORIZONTAL_SIDE]}>
        <ThemedText weight="bold" style={{ color: muted }}>
          SET {props.setIndex}
        </ThemedText>
        {
          props.removable &&
          (
            <Button
              text="Remove"
              icon="trash"
              iconPlacement="left"
              onPress={props.onRemove}
              buttonStyle={{ columnGap: 8 }}
              textStyle={{ color: red }}
            />
          )
        }
      </View>
      <View style={[Styles.FLEX_HORIZONTAL_CENTER, { columnGap: 8 }]}>
        <ScoreInput
          setIndex={props.setIndex}
          playerIndex={0}
          value={props.sets[props.setIndex - 1]?.[0]}
          onValueChange={props.onValueChange}
        />
        <ThemedText style={{ fontSize: 24, color: muted }}> - </ThemedText>
        <ScoreInput
          setIndex={props.setIndex}
          playerIndex={1}
          value={props.sets[props.setIndex - 1]?.[1]}
          onValueChange={props.onValueChange}
        />
      </View>
    </View>
  );
}

function ScoreInput(props: IScoreInputProps) {
  const handleScoreChange = (text: string) => {
    props.onValueChange(props.setIndex - 1, props.playerIndex, text === '' ? 0 : parseInt(text, 10));
  };

  return (
    <TextInput>
      <TextInput.Control
        keyboardType="number-pad"
        maxLength={2}
        style={styles.setCardInput}
        onChangeText={handleScoreChange}
        value={props.value !== undefined ? props.value.toString() : ''}
      />
    </TextInput>
  );
}

const styles = StyleSheet.create({
  setCardContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    rowGap: 8,
    borderRadius: 8,
    borderWidth: 2,
  },
  setCardInput: {
    width: 36,
    textAlign: 'center',
    flex: 1,
    fontFamily: 'LeagueSpartanBold',
    fontSize: 24,
  }
});