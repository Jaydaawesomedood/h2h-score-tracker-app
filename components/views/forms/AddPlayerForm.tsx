import TextInput from "@/components/_ui/input/TextInput";
import { Player } from "@/models/v2/data/Player";
import { ActionDispatch, forwardRef, useEffect, useImperativeHandle, useReducer } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type PlayerForm = Omit<Player, 'id'>;

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

function addPlayerReducer(state: PlayerForm, action: { fieldName: string, value: string }) {
  return {
    ...state,
    [action.fieldName]: action.value,
  };
}

const initialFormState: PlayerForm = { firstName: '', lastName: '', color: colors[0] };

function initializeForm(player: Player | undefined) {
  return player ?? initialFormState;
}

const PlayerForm = forwardRef((props: IAddPlayerFormProps, ref) => {
  const [state, dispatch] = useReducer(addPlayerReducer, props.player, initializeForm);

  useImperativeHandle(ref, () => ({
    getFormData: () => (state),
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
        </TextInput>
      </View>
      <View style={{ rowGap: 8 }}>
        <TextInput>
          <TextInput.Label>Last Name</TextInput.Label>
          <TextInput.Control
            value={state.lastName}
            onChangeText={(text) => handleFormFieldChange("lastName", text)}
          />
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