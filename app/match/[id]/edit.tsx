import ProgressTracker from "@/components/_ui/progress-tracker/ProgressTracker";
import ThemedText from "@/components/_ui/ThemedText";
import ThemedView from "@/components/_ui/ThemedView";
import ScreenHeader from "@/components/views/headers/ScreenHeader";
import MatchOverviewStep from "@/components/views/log-score-steps/MatchOverviewStep";
import MatchReviewStep from "@/components/views/log-score-steps/MatchReviewStep";
import MatchScoreStep from "@/components/views/log-score-steps/MatchScoreStep";
import { Styles } from "@/constants/v2/Styles";
import { useLogScore } from "@/hooks/v2/useLogScore";
import useThemeColor from "@/hooks/v2/useThemeColor";
import ProgressTrackerProvider from "@/providers/ProgressTrackerProvider";
import LogScoreProvider from '@/providers/LogScoreProvider';
import { useMatchesStore } from "@/store/useMatchesStore";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { useShallow } from "zustand/react/shallow";
import { MatchesService } from "@/api/MatchesService/MatchesService";
import { ScoreHelper } from "@/utils/v2/score-helper.util";
import Button from "@/components/_ui/button/Button";
import PopupModal from "@/components/_ui/modal/PopupModal";

export default function EditMatchScreen() {
  const deleteColor = useThemeColor('red');
  const { id } = useLocalSearchParams();

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(false);
  const removeMatch = useMatchesStore(state => state.removeMatch);

  const match = useMatchesStore(
    useShallow(state => state.matches.find(m => m.id === id))
  );

  const handleDelete = async () => {
    const success = await removeMatch(id as string);

    if (success) {
      setIsDeleteModalVisible(false);
      router.dismissTo('/(tabs)/history');
    }
  }

  return (
    <ThemedView style={[Styles.SCREEN_BODY, { rowGap: 24, paddingHorizontal: 0 }]}>
      <View style={{ paddingHorizontal: 24 }}>
        <ScreenHeader
          renderActionButton={() => (
            <Button
              text=""
              onPress={() => setIsDeleteModalVisible(true)}
              type="secondary"
              icon="trash"
              iconPlacement="left"
              buttonStyle={{ columnGap: 8, paddingHorizontal: 4 }}
              textStyle={{ color: deleteColor, fontSize: 18 }}
            />
          )}
        />
        <ThemedText weight="bold" style={{ fontSize: 32 }}>Edit Match</ThemedText>
      </View>
      <LogScoreProvider>
        <EditMatchContent match={match} />
      </LogScoreProvider>

      <PopupModal
        visible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
      >
        <PopupModal.Body>
          <View style={{ rowGap: 8 }}>
            <ThemedText style={{ fontSize: 18 }}>Are you sure you want to delete this player?</ThemedText>
            <ThemedText weight="light">All matches involving this player will be deleted!</ThemedText>
          </View>
        </PopupModal.Body>
        <PopupModal.Footer>
          <View style={[Styles.FLEX_HORIZONTAL_SIDE]}>
            <Button
              type="secondary"
              text="Cancel"
              onPress={() => setIsDeleteModalVisible(false)}
              buttonStyle={{ flex: 1, justifyContent: 'center' }}
            />
            <Button
              type="primary"
              text="Yes, delete"
              onPress={handleDelete}
              buttonStyle={{ flex: 1, backgroundColor: deleteColor }}
              weight="bold"
            />
          </View>
        </PopupModal.Footer>
      </PopupModal>
    </ThemedView>
  );
}

function EditMatchContent({ match }: { match: any }) {
  const { date, sets, setType, setDate, setSideA, setSideB, setSets } = useLogScore();
  const matchInit = useRef<boolean>(false);

  const handleSaveChanges = async () => {
    await MatchesService.UpdateMatch({
      ...match,
      date,
      sets,
      winner: ScoreHelper.calculateWinner(sets),
    });
    router.back();
  }

  useEffect(() => {
    if (!match || matchInit.current) return;
    setType(match.type);
    setDate(match.date);
    setSideA(match.sideA);
    setSideB(match.sideB);
    setSets(match.sets);
    matchInit.current = true;
  }, [match]);

  return (
    <ProgressTrackerProvider>
      <ProgressTracker
        steps={3}
        screens={[
          <MatchOverviewStep isEditMode />,
          <MatchScoreStep />,
          <MatchReviewStep />
        ]}
        onComplete={handleSaveChanges}
        validationMap={{
          0: { date },
          1: { sets }
        }}
      />
    </ProgressTrackerProvider>
  );
}