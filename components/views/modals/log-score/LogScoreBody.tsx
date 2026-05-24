import ProgressTracker from "@/components/_ui/progress-tracker/ProgressTracker";
import ProgressTrackerProvider from "@/providers/ProgressTrackerProvider";
import { StyleSheet, View } from "react-native";
import MatchOverviewStep from "../../log-score-steps/MatchOverviewStep";
import MatchPlayersStep from "../../log-score-steps/MatchPlayersStep";
import MatchScoreStep from "../../log-score-steps/MatchScoreStep";
import MatchReviewStep from "../../log-score-steps/MatchReviewStep";
import { useLogScore } from "@/hooks/v2/useLogScore";
import { useMatchesStore } from "@/store/useMatchesStore";
import * as Crypto from "expo-crypto";
import moment from "moment";
import { ScoreHelper } from "@/utils/v2/score-helper.util";

interface ILogScoreBodyProps {
  onCloseModal: () => void,
}

export default function LogScoreBody(props: ILogScoreBodyProps) {
  const { type, date, sideA, sideB, sets } = useLogScore();
  const addMatch = useMatchesStore.getState().addMatch;

  const handleOnComplete = () => {
    addMatch({
      id: Crypto.randomUUID(),
      type: type!,
      date,
      sideA,
      sideB,
      sets,
      winner: ScoreHelper.calculateWinner(sets),
      createdAt: moment().toString(),
    });
    props.onCloseModal();
  }

  return (
    <View style={styles.body}>
      <ProgressTrackerProvider>
        <ProgressTracker
          steps={4}
          screens={[
            <MatchOverviewStep />,
            <MatchPlayersStep />,
            <MatchScoreStep />,
            <MatchReviewStep />
          ]}
          onComplete={handleOnComplete}
          validationMap={{
            0: { date, type },
            1: { sideA, sideB },
            2: { sets },
          }}
        />
      </ProgressTrackerProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    marginBottom: 24,
  }
});