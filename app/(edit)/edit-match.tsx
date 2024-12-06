import MatchDetailsForm from "@/components/forms/match/MatchDetailsForm";
import MatchScoreForm from "@/components/forms/match/MatchScoreForm";
import { ProgressStepper } from "@/components/progress-bar/ProgressStepper";
import ScreenTitleWithBack from "@/components/screens/ScreenTitleWithBack";
import { ThemedView } from "@/components/ThemedView";
import { Containers } from "@/constants/styles/Containers";
import { DbContext, EditMatchContext } from "@/utils/context";
import { showErrorToast, showMessageToast } from "@/utils/toast.util";
import { router, useLocalSearchParams } from "expo-router";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import * as DbClient from "../../utils/database/database";
import { Match } from "@/models/Match";
import { GetMatch } from "@/utils/repositories/MatchRepository";
import { Player, Team } from "@/models/Player";
import { ToastMessages } from "@/constants/messages/Toast";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function EditMatchScreen() {
  // Context
  const db = useContext(DbContext);
  const { id, category, mode, datetime } = useLocalSearchParams();

  // Colors
  const deleteBtnColor = useThemeColor("deleteIcon");

  // useState
  const [currentStep, setCurrentStep] = useState<number>(0);

  const [match, setMatch] = useState<Match>();
  const [isMatchSettingDropdownOpen, setIsMatchSettingDropdownOpen] = useState<boolean>(false);
  
  const [matchSetting, setMatchSetting] = useState<string>(mode as string);
  const [matchDate, setMatchDate] = useState(moment(datetime as string, "DD MMM YYYY").format("YYYY-MM-DD").toString());
  const [matchScore, setMatchScore] = useState<Number[][]>([]);

  const [nextBtnDisabled, setNextBtnDisabled] = useState<boolean>(true);

  const onPrevious = () => { setCurrentStep(currentStep === 0 ? 0 : currentStep - 1); };
  const onNext = () => { setCurrentStep(currentStep + 1); };

  const onComplete = async () => {
    if (db) {
      await DbClient.UpdateMatch(
        db, 
        [matchSetting.toLowerCase(), moment(matchDate).format("DD-MM-YYYY").toString(), matchScore.map((set: Number[]) => set.join("-")).join(",")],
        id as string,
        (category as string).toLowerCase().endsWith("d") ? "doubles" : "singles")
      .then(() => {
        showMessageToast(ToastMessages.EditMatchSuccess);
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
      .then(() => {
        showMessageToast(ToastMessages.DeleteMatchSuccess);
        router.replace("/matches");
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
    return (category as string).endsWith("d") ? "doubles" : "singles";
  };
  
  useEffect(() => {
    getMatch();
  }, []);

  // TODO - Revisit context & this section
  useEffect(() => {
    if (match) {
      setMatchSetting(match.mode.toLowerCase());
      setMatchDate(moment(match.datetime, "DD MMM YYYY").format("YYYY-MM-DD").toString());
      setMatchScore([...match.score]);
    }
  }, [match]);

  return (
    <EditMatchContext.Provider value={{
      setting: matchSetting,
      date: matchDate,
      score: matchScore,
      category: match?.category.toLowerCase().endsWith("d") ? "doubles" : "singles",
      teams: match?.category.toLowerCase().endsWith("d") ? match?.teams as Team[] : match?.teams as Player[],
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