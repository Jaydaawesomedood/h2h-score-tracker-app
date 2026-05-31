import TextInput from "@/components/_ui/input/TextInput";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { Player } from "@/models/v2/data/Player";
import { ActionDispatch, forwardRef, useEffect, useImperativeHandle, useReducer, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type PlayerFormValues = Omit<Player, 'id' | 'createdAt'>;

interface IAddPlayerFormProps {
  player?: Player,
  onFormChange?: () => void,
}

interface IColorPickerProps {
  selectedColor: string,
  onColorChange: ActionDispatch<[action: { fieldName: string, value: string }]>,
}

const colors = [
  '#b54aa5',
  '#c89b3a',
  '#a375f3',
  '#79a7f7',
  '#219677',
  '#97633d',
];

function addPlayerReducer(state: PlayerFormValues, action: { fieldName: string, value: string }) {
  return {
    ...state,
    [action.fieldName]: action.value,
  };
}

const initialFormState: PlayerFormValues = { firstName: '', lastName: '', color: colors[0] };

function initializeForm(player: Player | undefined) {
  if (!player) return initialFormState;

  return {
    color: player?.color,
    firstName: player?.firstName,
    lastName: player?.lastName
  } as PlayerFormValues;
}

const PlayerForm = forwardRef((props: IAddPlayerFormProps, ref) => {
  const errorColor = useThemeColor('red');

  const [state, dispatch] = useReducer(addPlayerReducer, props.player, initializeForm);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useImperativeHandle(ref, () => ({
    getFormData: () => (state),
    validateForm: () => {
      setErrors({});

      const errorMap: { [key: string]: string } = {
        "firstName": "Please enter first name.",
        "lastName": "Please enter last name.",
        "color": "Please select a color.",
      };

      let error: { [key: string]: string } = {};

      for (const key of Object.keys(state)) {
        if (!(state as any)[key] || !(state as any)[key]?.trim()) {
          error = { ...error, [key]: errorMap[key] ?? '' };
        }
      }
      
      setErrors(_ => error);

      if (error && Object.keys(error).length > 0) return false;
      return true;
    },
    resetForm: () => {
      dispatch({ fieldName: "firstName", value: "" });
      dispatch({ fieldName: "lastName", value: "" });
      dispatch({ fieldName: "color", value: colors[0] });
    }
  }));

  const handleFormFieldChange = (fieldName: string, value: string) => {
    dispatch({ fieldName, value });
  }

  useEffect(() => {
    props.onFormChange?.();
  }, [state]);

  return (
    <View style={{ rowGap: 16 }}>
      <View>
        <ColorPicker selectedColor={state.color} onColorChange={dispatch} />
      </View>
      <View style={{ rowGap: 8 }}>
        <TextInput>
          <TextInput.Label>First Name</TextInput.Label>
          <TextInput.Control
            value={state.firstName}
            onChangeText={(text) => handleFormFieldChange("firstName", text)}
          />
          {
            errors?.["firstName"] && (
              <TextInput.Message style={{ color: errorColor, fontSize: 12 }}>{errors['firstName']}</TextInput.Message>
            )
          }
        </TextInput>
      </View>
      <View style={{ rowGap: 8 }}>
        <TextInput>
          <TextInput.Label>Last Name</TextInput.Label>
          <TextInput.Control
            value={state.lastName}
            onChangeText={(text) => handleFormFieldChange("lastName", text)}
          />
          {
            errors?.["lastName"] && (
              <TextInput.Message style={{ color: errorColor, fontSize: 12 }}>{errors['lastName']}</TextInput.Message>
            )
          }
        </TextInput>
      </View>
    </View>
  );
})

function ColorPicker(props: IColorPickerProps) {
  const handleSelectColor = (color: string) => {
    props.onColorChange({ fieldName: 'color', value: color })
  }

  return (
    <View style={[styles.colorPickerContainer]}>
      {
        colors.map(color => (
          <TouchableOpacity
            key={color}
            activeOpacity={0.6}
            onPress={() => handleSelectColor(color)}
            style={[
              styles.colorPickerItem,
              props.selectedColor === color && { borderWidth: 3, borderColor: color, padding: 4 }
            ]}
          >
            <View
              style={[
                styles.colorPickerItemInner,
                { backgroundColor: color },
              ]}
            />
          </TouchableOpacity>
        ))
      }
    </View>
  );
}

const styles = StyleSheet.create({
  colorPickerContainer: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  colorPickerItem: {
    width: `${100 / 10}%`,
    height: `${100 / 10}%`,
    minWidth: 24,
    minHeight: 24,
    aspectRatio: 1 / 1,
    borderRadius: '100%',
  },
  colorPickerItemInner: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: '100%'
  }
});

export default PlayerForm;