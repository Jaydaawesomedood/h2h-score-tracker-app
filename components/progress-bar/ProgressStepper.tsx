import { Dimensions, FlatList, StyleSheet, View, ViewProps } from "react-native";
import ProgressStepIcon from "./ProgressStepIcon";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Fragment, ReactElement, useCallback, useEffect, useRef, useState } from "react";
import Animated from "react-native-reanimated";
import SecondaryButton from "../buttons/SecondaryButton";
import { StepperContext } from "@/utils/context";

interface StepperData {
  label: string;
  screen: ReactElement;
};

type ProgressStepperProps = ViewProps & {
  data: StepperData[];
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
};

export function ProgressStepper({
  data,
  currentStep,
  onNext,
  onPrevious,
  onComplete,
}: ProgressStepperProps) {
  const screenWidth = useRef(Dimensions.get("window").width).current;
  const stepperBarRef = useRef<FlatList | null>(null);

  const [isNextBtnDisabled, setIsNextBtnDisabled] = useState<boolean>(true);

  const onStepAction = useCallback((step: number) => {
    stepperBarRef?.current?.scrollToOffset({
      offset: step * screenWidth
    });
  }, []);

  useEffect(() => {
    // Scrolls to previous/next step as per the currentStep value changes
    onStepAction(currentStep);
  }, [currentStep]);

  const renderNextBtn = () => (
    <>
      {
        currentStep >= 0 && currentStep < data.length - 1 &&
        <SecondaryButton 
          title="Next"
          icon="chevron-right"
          iconPosition="right"
          onPress={onNext}
          disabled={isNextBtnDisabled}
        />
      }
    </>
  );

  const renderPreviousBtn = () => (
    <>
      {
        currentStep > 0 &&
        <SecondaryButton 
          title="Previous"
          icon="chevron-left"
          iconPosition="left"
          onPress={onPrevious}
        />
      }
    </>
  );

  const renderCompleteBtn = () => (
    <>
      {
        currentStep === data.length - 1 &&
        <SecondaryButton 
          title="Complete"
          onPress={onComplete}
          disabled={isNextBtnDisabled}
        />
      }
    </>
  );
  
  const getStepStyling = (stepIndex: number) => {
    return stepIndex <= currentStep ? { backgroundColor: useThemeColor("primary") } : { backgroundColor: useThemeColor("primaryDisabled") };
  };

  return (
    <StepperContext.Provider value={{ currentStep, setIsNextBtnDisabled }}>
      <View style={{ flex: 1 }}>
        <View style={[styles.stepBarContainer, { paddingHorizontal: 32 }]}>
          {
            Array.from(Array(data.length), (_, i: number) => i).map((step: number, index: number) => (
              <Fragment key={`add-match-step-icon-${index}`}>
                <ProgressStepIcon
                  currentStep={currentStep}
                  stepIndex={step}
                  label={data[step].label}
                />
                { step === data.length - 1 ? null : <View style={[styles.stepBarLine, { ...getStepStyling(step + 1) }]} /> }
              </Fragment>
            ))
          }
        </View>
        <Animated.FlatList
          ref={stepperBarRef}
          data={data.map(d => d.screen)}
          scrollEnabled={false}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={{ width: screenWidth }}>{item}</View>
          )}
          style={{ flexGrow: 1 }}
        />
        <View style={[styles.stepButtonsContainer]}>
          <View style={{ flex: 1, alignItems: "flex-start" }}>
            {renderPreviousBtn()}
          </View>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            {currentStep === data.length - 1 ? renderCompleteBtn() : renderNextBtn()}
          </View>
        </View>
      </View>
    </StepperContext.Provider>
  );
};

const styles = StyleSheet.create({
  stepBarContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stepBarLine: {
    flexGrow: 1,
    height: 4,
    marginBottom: 20,
    marginHorizontal: -4,
  },
  stepButtonsContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 8,
    minHeight: 60,
  },
});