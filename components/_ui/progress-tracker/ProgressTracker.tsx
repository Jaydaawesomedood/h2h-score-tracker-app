import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import ProgressTrackerIcon from "./ProgressTrackerIcon";
import { Styles } from "@/constants/v2/Styles";
import { Fragment, ReactElement, useRef } from "react";
import Button from "../button/Button";
import useThemeColor from "@/hooks/v2/useThemeColor";
import useProgressTracker from "@/hooks/v2/useProgressTracker";

interface IProgressTrackerProps {
  steps: number,
  screens: ReactElement[],
  onComplete: () => void,
}

export default function ProgressTracker(props: IProgressTrackerProps) {
  const { current, onNext, onPrevious, isNextDisabled } = useProgressTracker();
  const progressTrackerListRef = useRef<FlatList<ReactElement>>(null);

  const primaryColor = useThemeColor('primary');
  const primaryDisabledColor = useThemeColor('primaryDisabled');
  const incompleteBgColor = useThemeColor('shade');

  const getStepState = (index: number) => {
    if (current === index) return 'active'
    else if (current > index) return 'completed'
    else return 'incomplete';
  }

  const getBackgroundColor = (state: 'active' | 'completed' | 'incomplete') => {
    switch (state) {
      case 'active':
      case 'completed':
        return primaryColor;
      default:
        return incompleteBgColor;
    }
  }

  const scrollTo = (index: number) => {
    progressTrackerListRef.current?.scrollToIndex({ index, animated: true });
  }

  return (
    <View style={[Styles.FLEX_COLUMN, { flex: 1 }]}>
      <View style={[Styles.FLEX_HORIZONTAL_CENTER, styles.section]}>
        {
          (Array.from({ length: props.steps })).map((_, i, arr) => (
            <Fragment key={`log-score-modal-step-${i + 1}`}>
              <ProgressTrackerIcon index={i + 1} state={getStepState(i)} />
              {
                i + 1 < arr.length &&
                <View style={[styles.line, { backgroundColor: getBackgroundColor(getStepState(i + 1)) }]} />
              }
            </Fragment>
          ))
        }
      </View>
      <View style={{ flexGrow: 1, maxHeight: '90%' }}>
        <FlatList
          data={props.screens}
          renderItem={({ item }) => <View style={[{ width: Dimensions.get('window').width }, styles.section]}>{item}</View>}
          keyExtractor={(_, i) => i.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          bounces={false}
          ref={progressTrackerListRef}
        />
      </View>
      <View style={[Styles.FLEX_HORIZONTAL_SIDE, styles.actionsContainer, styles.section]}>
        {
          current > 0 &&
          <View style={{ marginRight: 'auto' }}>
            <Button
              type="secondary"
              text="Previous"
              onPress={() => { onPrevious(); scrollTo(current - 1); }}
              icon="chevron-left"
              iconPlacement="left"
              buttonStyle={{ columnGap: 8 }}
              textStyle={{ color: primaryColor }}
            />
          </View>
        }
        {
          (current < props.steps - 1) &&
          <View style={{ marginLeft: 'auto' }}>
            <Button
              type="secondary"
              text="Next"
              onPress={() => { onNext(); scrollTo(current + 1); }}
              icon="chevron-right"
              iconPlacement="right"
              buttonStyle={{ columnGap: 8 }}
              textStyle={{ color: isNextDisabled ? primaryDisabledColor : primaryColor }}
              disabled={isNextDisabled}
            />
          </View>
        }
        {
          current === props.steps - 1 &&
          <View style={{ marginLeft: 'auto' }}>
            <Button
              type="secondary"
              text="Complete"
              onPress={props.onComplete}
              textStyle={{ color: isNextDisabled ? primaryDisabledColor : primaryColor }}
              disabled={isNextDisabled}
            />
          </View>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    flexGrow: 1,
    height: 4,
  },
  actionsContainer: {
    marginBottom: 'auto',
  },
  section: {
    paddingHorizontal: 24,
  }
});