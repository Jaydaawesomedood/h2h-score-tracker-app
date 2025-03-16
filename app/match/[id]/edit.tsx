import { router, useLocalSearchParams } from "expo-router";
import moment from "moment";
import { useContext, useState } from "react";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";

import ThemedView from "@/components/ThemedView";
import MatchDetailsForm from "@/components/forms/match/MatchDetailsForm";
import MatchScoreForm from "@/components/forms/match/MatchScoreForm";
import { ProgressStepper } from "@/components/progress-bar/ProgressStepper";
import ScreenTitleWithBack from "@/components/screens/ScreenTitleWithBack";

import { ToastMessages } from "@/constants/messages/Toast";
import { Containers } from "@/constants/styles/Containers";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Match } from "@/models/Match";
import { Player, Team } from "@/models/Player";
import { DbContext, EditMatchContext, useDataStore, useProfileStore } from "@/utils/context";
import { showErrorToast, showMessageToast } from "@/utils/toast.util";
import * as DbClient from "@/utils/database/database";
import { GetAllMatchesV2, GetMatch } from "@/utils/repositories/MatchRepository";

export default function EditMatchScreen() {
  // Context
  const db = useContext(DbContext);
  // TODO - Change to profile state, refer to edit player
  const { id } = useLocalSearchParams();
  const { profile, clearProfile } = useProfileStore();
  const { setSinglesMatches, setDoublesMatches } = useDataStore();

  // Colors
  const deleteBtnColor = useThemeColor("deleteIcon");

  // useState
  const [currentStep, setCurrentStep] = useState<number>(0);

  const [match, setMatch] = useState<Match>();
  const [isMatchSettingDropdownOpen, setIsMatchSettingDropdownOpen] = useState<boolean>(false);
  
  const [matchSetting, setMatchSetting] = useState<string>(profile.match.mode);
  const [matchDate, setMatchDate] = useState(moment(profile.match.datetime, "DD MMM YYYY").format("YYYY-MM-DD").toString());
  const [matchScore, setMatchScore] = useState<Number[][]>([...profile.match.score]);

  const onPrevious = () => { setCurrentStep(currentStep === 0 ? 0 : currentStep - 1); };
  const onNext = () => { setCurrentStep(currentStep + 1); };

  const onComplete = async () => {
    if (db) {
      await DbClient.UpdateMatch(
        db, 
        [matchSetting.toLowerCase(), moment(matchDate).format("DD-MM-YYYY").toString(), matchScore.map((set: Number[]) => set.join("-")).join(",")],
        id as string,
        (profile.match.category as string).toLowerCase().endsWith("d") ? "doubles" : "singles")
      .then(async () => {
        showMessageToast(ToastMessages.EditMatchSuccess);

        // After updating match details, update store
        await GetAllMatchesV2(db, setSinglesMatches, setDoublesMatches, showErrorToast);

        router.back();
      })
      .catch(() => showErrorToast());
    }
    else {
      showErrorToast();
    }
  };

  const onDelete = async () => {
    if (db) {
      await DbClient.DeleteMatch(db, id as string, getCategory())
      .then(async () => {
        showMessageToast(ToastMessages.DeleteMatchSuccess);
        clearProfile();

        // After updating match details, update store
        await GetAllMatchesV2(db, setSinglesMatches, setDoublesMatches, showErrorToast);

        router.replace("/");
      })
      .catch(() => showErrorToast());
    }
    else {
      showErrorToast();
    }
  };

  const hideKeyboard = () => { Keyboard.dismiss(); };
  const closeDropdown = () => { setIsMatchSettingDropdownOpen(false); };

  const renderDetailsForm = () => (
    <TouchableWithoutFeedback onPress={closeDropdown}>
      <View style={{ flexGrow: 1, paddingVertical: 32 }}>
        <MatchDetailsForm
          isDropdownOpen={isMatchSettingDropdownOpen}
          setIsDropdownOpen={setIsMatchSettingDropdownOpen}
          onDropdownPress={hideKeyboard}
          isEditingMatch={true}
        />
      </View>
    </TouchableWithoutFeedback>
  );

  const renderScoreForm = () => (
    <View style={{ flexGrow: 1, paddingVertical: 32 }}>
      <MatchScoreForm isEditingMatch={true} />
    </View>
  );

  const getMatch = async () => {
    if (db) await GetMatch(db, getCategory(), id as string, setMatch, showErrorToast);
    else showErrorToast();
  };

  const getCategory = () => {
    return (profile.match.category as string).endsWith("d") ? "doubles" : "singles";
  };
  
  // useEffect(() => {
  //   getMatch();
  // }, []);

  // TODO - Revisit context & this section
  // useEffect(() => {
  //   if (match) {
  //     setMatchSetting(profile.match.mode.toLowerCase());
  //     setMatchDate(moment(profile.match.datetime, "DD MMM YYYY").format("YYYY-MM-DD").toString());
  //     setMatchScore([...profile.match.score]);
  //   }
  // }, [match]);

  return (
    <EditMatchContext.Provider value={{
      setting: matchSetting,
      date: matchDate,
      score: matchScore,
      category: profile.match.category.toLowerCase().endsWith("d") ? "doubles" : "singles",
      teams: profile.match.category.toLowerCase().endsWith("d") ? profile.match.teams as Team[] : profile.match.teams as Player[],
      setSetting: setMatchSetting,
      setDate: setMatchDate,
      setScore: setMatchScore,
    }}>
      <ThemedView style={[Containers.screen, { paddingHorizontal: 0 }]}>
        <ScreenTitleWithBack
          title="Edit Match"
          actionBtn={{
            title: "",
            icon: "trash",
            onPress: onDelete,
            customColor: deleteBtnColor
          }}
          style={{ paddingHorizontal: 32 }}
        />
        <View style={{ flex: 1 }}>
          <ProgressStepper
            currentStep={currentStep}
            data={[
              { label: "Match", screen: renderDetailsForm() },
              { label: "Score", screen: renderScoreForm() },
            ]}
            onNext={onNext}
            onPrevious={onPrevious}
            onComplete={onComplete}
          />
        </View>
      </ThemedView>
    </EditMatchContext.Provider>
  )
};