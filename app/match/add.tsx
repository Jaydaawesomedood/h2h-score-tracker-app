import { router } from "expo-router";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";

import ThemedView from "@/components/ThemedView";
import MatchDetailsForm from "@/components/forms/match/MatchDetailsForm";
import MatchPlayersForm from "@/components/forms/match/MatchPlayersForm";
import MatchScoreForm from "@/components/forms/match/MatchScoreForm";
import { ProgressStepper } from "@/components/progress-bar/ProgressStepper";
import ScreenTitleWithBack from "@/components/screens/ScreenTitleWithBack";

import { Containers } from "@/constants/styles/Containers";
import { ToastMessages } from "@/constants/messages/Toast";
import { Categories } from "@/models/Categories.enum";
import { Player, Team } from "@/models/Player";
import { AddMatchContext, DbContext, useDataStore } from "@/utils/context";
import { showErrorToast, showMessageToast } from "@/utils/toast.util";
import * as DbClient from "@/utils/database/database";
import { GetAllPlayersAndTeams } from "@/utils/repositories/PlayerRepository";
import { GetAllMatchesV2 } from "@/utils/repositories/MatchRepository";

export default function AddMatchScreen() {
  // Context
  const db = useContext(DbContext);
  const { setSinglesMatches, setDoublesMatches } = useDataStore();

  // useState
  const [currentStep, setCurrentStep] = useState<number>(0);

  const [isMatchSettingDropdownOpen, setIsMatchSettingDropdownOpen] = useState<boolean>(false);
  const [isMatchCategoryDropdownOpen, setIsMatchCategoryDropdownOpen] = useState<boolean>(false);
  
  const [matchSetting, setMatchSetting] = useState<string>("");
  const [matchDate, setMatchDate] = useState(moment().format().toString());
  const [matchCategory, setMatchCategory] = useState<"singles" | "doubles">("singles");
  const [matchSubCategory, setMatchSubCategory] = useState<string>(Categories.Unspecified.toLowerCase());
  const [matchTeams, setMatchTeams] = useState<Player[] | Team[]>([]);
  const [matchScore, setMatchScore] = useState<Number[][]>([]);

  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const onPrevious = () => {
    setCurrentStep(currentStep === 0 ? 0 : currentStep - 1);
  };
  
  const onNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const onComplete = async () => {
    if (db) {
      await DbClient.InsertMatch(
        db,
        [matchSubCategory.toLowerCase(), matchTeams[0].id, matchTeams[1].id, matchScore.map((set: Number[]) => set.join("-")).join(","), moment(matchDate).format("DD-MM-YYYY").toString(), matchSetting.toLowerCase()],
        matchCategory
      )
      .then(async () => {
        showMessageToast(ToastMessages.AddMatchSuccess);

        // After adding match to DB, update store
        await GetAllMatchesV2(db, setSinglesMatches, setDoublesMatches, showErrorToast);
        router.back();
      })
      .catch(() => {
        showErrorToast();
      });
    }
    else {
      showErrorToast();
    }
  };

  const hideKeyboard = () => { Keyboard.dismiss(); };
  const closeDropdown = () => { setIsMatchSettingDropdownOpen(false); };

  const getAllPlayersAndTeams = async () => {
    if (db) await GetAllPlayersAndTeams(db, setPlayers, setTeams, showErrorToast);
    else showErrorToast();
  };

  useEffect(() => {
    if (players.length === 0 || teams.length === 0) getAllPlayersAndTeams();
  }, []);

  useEffect(() => { clearFields(); }, []);

  const clearFields = () => {
    setMatchSetting("");
    setMatchDate(moment().format().toString());
    setMatchCategory("singles");
    setMatchSubCategory(Categories.Unspecified.toLowerCase());
    setMatchTeams([]);
    setMatchScore([]);
  };

  const renderDetailsForm = () => (
    <TouchableWithoutFeedback onPress={closeDropdown}>
      <View style={{ flexGrow: 1, paddingVertical: 32 }}>
        <MatchDetailsForm
          isDropdownOpen={isMatchSettingDropdownOpen}
          setIsDropdownOpen={setIsMatchSettingDropdownOpen}
          onDropdownPress={hideKeyboard}
        />
      </View>
    </TouchableWithoutFeedback>
  );

  const renderPlayersForm = () => (
    <View style={{ flexGrow: 1, paddingVertical: 32 }}>
      <MatchPlayersForm
        isDropdownOpen={isMatchCategoryDropdownOpen}
        setIsDropdownOpen={setIsMatchCategoryDropdownOpen}
        onDropdownPress={() => {}}
      />
    </View>
  );

  const renderScoreForm = () => (
    <View style={{ flexGrow: 1, paddingVertical: 32 }}>
      <MatchScoreForm />
    </View>
  );

  // TODO - refactor context to one match property
  return (
    <AddMatchContext.Provider value={{
      setting: matchSetting,
      date: matchDate,
      category: matchCategory,
      subCategory: matchSubCategory,
      teams: matchTeams,
      score: matchScore,
      setSetting: setMatchSetting,
      setDate: setMatchDate,
      setCategory: setMatchCategory,
      setSubCategory: setMatchSubCategory,
      setTeams: setMatchTeams,
      setScore: setMatchScore,
      playersList: players,
      teamsList: teams,
    }}>
      <ThemedView style={[Containers.screen, { paddingHorizontal: 0, paddingBottom: 0 }]}>
        <ScreenTitleWithBack title="Add Match" style={{ paddingHorizontal: 32 }} />
        <View style={{ flex: 1 }}>
          <ProgressStepper
            currentStep={currentStep}
            data={[
              { label: "Match", screen: renderDetailsForm() },
              { label: "Players", screen: renderPlayersForm() },
              { label: "Score", screen: renderScoreForm() },
            ]}
            onNext={onNext}
            onPrevious={onPrevious}
            onComplete={onComplete}
          />
        </View>
      </ThemedView>
    </AddMatchContext.Provider>
  );
} 