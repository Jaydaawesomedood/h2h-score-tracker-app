import Toast from "react-native-simple-toast";
import { ToastMessages } from "@/constants/messages/Toast";

export function showMessageToast(message: string) {
  Toast.show(message, Toast.LONG);
}

export function showErrorToast() {
  Toast.show(ToastMessages.Error, Toast.LONG);
}