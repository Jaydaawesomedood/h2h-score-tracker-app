import { ToastMessages } from "@/constants/messages/Toast";
import Toast from "react-native-simple-toast";

export function showMessageToast(message: string) {
  Toast.show(message, Toast.LONG);
}

export function showErrorToast() {
  Toast.show(ToastMessages.Error, Toast.LONG);
}