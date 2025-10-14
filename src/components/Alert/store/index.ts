// store/useAlertDialog.ts
import { create } from "zustand";
import { ReactNode } from "react";

interface AlertDialogStore {
  isOpen: boolean;
  title: string;
  subTitle: string;
  buttonConfirm: ReactNode;
  showAlert: (options: {
    title: string;
    subTitle: string;
    buttonConfirm: ReactNode;
  }) => void;
  closeDialog: () => void;
}

const useAlertDialog = create<AlertDialogStore>((set) => ({
  isOpen: false,
  title: "",
  subTitle: "",
  buttonConfirm: null,
  showAlert: ({ title, subTitle, buttonConfirm }: any) =>
    set({
      isOpen: true,
      title,
      subTitle,
      buttonConfirm,
    }),
  closeDialog: () => set({ isOpen: false }),
}));

export default useAlertDialog;
