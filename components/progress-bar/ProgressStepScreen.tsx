import { ScrollView, ScrollViewProps, View, ViewProps } from "react-native";
import SecondaryButton from "../buttons/SecondaryButton";
import React, { Dispatch, SetStateAction } from "react";

// TODO - Deprecate this component
type ProgressStepProps = ViewProps & {
  totalSteps: number;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
  nextButtonDisabled?: boolean;
  scrollable?: boolean;
  scrollViewProps?: ScrollViewProps;
  viewProps?: ViewProps;
  showButtons?: boolean;
};

export default function ProgressStepScreen({
  totalSteps,
  currentStep,
  setCurrentStep,
  onNext,
  onPrevious,
  onComplete,
  nextButtonDisabled = true,
  scrollable = true,
  scrollViewProps,
  viewProps,
  showButtons = true,
  children
}: ProgressStepProps) {

  const onNextStep = () => { onNext(); setCurrentStep(currentStep + 1); };
  const onPrevStep = () => { onPrevious(); setCurrentStep(currentStep - 1); };

  const renderNextBtn = () => (
    <>
      {
        currentStep >= 0 && currentStep < totalSteps - 1 ?
        <SecondaryButton 
          title="Next"
          icon="chevron-right"
          iconPosition="right"
          onPress={onNextStep}
          disabled={nextButtonDisabled}
        />
        : null
      }
    </>
  );

  const renderPreviousBtn = () => (
    <>
      {
        currentStep > 0 ?
        <SecondaryButton 
          title="Previous"
          icon="chevron-left"
          iconPosition="left"
          onPress={onPrevStep}
        />
        : null
      }
    </>
  );

  const renderCompleteBtn = () => (
    <>
      {
        currentStep === totalSteps - 1 ?
        <SecondaryButton 
          title="Complete"
          onPress={onComplete}
          disabled={nextButtonDisabled}
        />
        : null
      }
    </>
  );

  return (
    <View style={{ flex: 1 }}>
      {
        scrollable ?
        (<ScrollView {...scrollViewProps}>{children}</ScrollView>)
        :
        (<View {...viewProps}>{children}</View>)
      }
      {
        showButtons ? 
        <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 1, alignItems: "flex-start" }}>
            {renderPreviousBtn()}
          </View>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            {currentStep === totalSteps - 1 ? renderCompleteBtn() : renderNextBtn()}
          </View>
        </View>
        : null
      }
    </View>
  );
};