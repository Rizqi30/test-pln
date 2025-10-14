// components/AlertDialog.tsx
import React from 'react';
import useAlertDialog from './store';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const MyAlertDialog = () => {
  const { isOpen, title, subTitle, buttonConfirm, closeDialog } =
    useAlertDialog();

  return (
    <AlertDialog open={isOpen} onOpenChange={closeDialog}>
      <AlertDialogContent className="w-[80vw]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            {subTitle}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div className="flex gap-3 items-center justify-end">
            <AlertDialogCancel className="border-none mt-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="p-0 space-x-0">
              {buttonConfirm}
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MyAlertDialog;
