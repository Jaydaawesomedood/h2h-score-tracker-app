import ProgressTracker from "@/components/_ui/progress-tracker/ProgressTracker";
import LogScoreProvider from "@/providers/LogScoreProvider";
import ProgressTrackerProvider from "@/providers/ProgressTrackerProvider";
import { StyleSheet, View } from "react-native";
import MatchOverviewStep from "../../log-score-steps/MatchOverviewStep";
import MatchPlayersStep from "../../log-score-steps/MatchPlayersStep";
import MatchScoreStep from "../../log-score-steps/MatchScoreStep";
import MatchReviewStep from "../../log-score-steps/MatchReviewStep";

interface ILogScoreBodyProps {
  onCloseModal: () => void,
}

export default function LogScoreBody(props: ILogScoreBodyProps) {
  return (
    <View style={styles.body}>
      <LogScoreProvider>
        <ProgressTrackerProvider>
          <ProgressTracker
            steps={4}
            screens={[
              <MatchOverviewStep />,
              <MatchPlayersStep />,
              <MatchScoreStep />,
              <MatchReviewStep />
            ]}
            onComplete={props.onCloseModal}
          />
        </ProgressTrackerProvider>
      </LogScoreProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    marginBottom: 24,
  }
});