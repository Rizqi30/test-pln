import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { Controller, useForm } from "react-hook-form";
import _ from "lodash";
import { userDefaultValues } from "@/form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  addUserValidationSchema,
  updateUserValidationSchema,
} from "@/form/validation";
import { ClipLoader } from "react-spinners";

const AddUser = ({ isOpen, onClose, data, postUserData, putUserData }: any) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
    reset,
    setValue,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: userDefaultValues,
    resolver: yupResolver(
      _.isEmpty(data) ? addUserValidationSchema : updateUserValidationSchema
    ),
  });

  const onSubmit = async (value: any) => {
    setIsSaving(true);
    try {
      const payload = {
        name: value.name,
        email: value.email,
      } as any;

      if (!_.isEmpty(data)) {
        if (value.password) {
          payload.password = value.password;
        }
        payload.id = data.id;
        await putUserData(payload);
      } else {
        payload.password = value.password;
        await postUserData(payload);
      }
      onClose();
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  useEffect(() => {
    if (isOpen) {
      if (!_.isEmpty(data)) {
        setValue("name", data.name);
        setValue("email", data.email);
      } else {
        reset(userDefaultValues);
      }
    } else {
        reset(userDefaultValues);
    }
  }, [data, isOpen, reset, setValue]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{!_.isEmpty(data) ? "Edit" : "Add"} User</DialogTitle>
          <DialogDescription className="py-5 flex gap-3 flex-col">
            <Controller
              control={control}
              name="name"
              render={({ field }) => <Input {...field} placeholder="Name" />}
            />
            <div className="flex gap-3">
              <Controller
                control={control}
                name="email"
                render={({ field }) => <Input {...field} placeholder="Email" />}
              />
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Password"
                    type={isVisible ? "password" : "text"}
                    iconAfter={
                      isVisible ? (
                        <IoIosEyeOff
                          size={20}
                          onClick={() => setIsVisible(false)}
                          className="cursor-pointer"
                        />
                      ) : (
                        <IoIosEye
                          size={20}
                          onClick={() => setIsVisible(true)}
                          className="cursor-pointer"
                        />
                      )
                    }
                  />
                )}
              />
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid || !dirtyFields}
          >
            {isSaving ? (
              <ClipLoader size={20} color="#ffffff" />
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUser;
