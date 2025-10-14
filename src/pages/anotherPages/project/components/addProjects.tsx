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
import { Controller, useForm } from "react-hook-form";
import _ from "lodash";
import { projectDefaultValues } from "@/form";
import { yupResolver } from "@hookform/resolvers/yup";
import { projectValidationSchema } from "@/form/validation";
import { ClipLoader } from "react-spinners";

const AddProjects = ({ isOpen, onClose, data, postProjects, putProjects }: any) => {
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
    defaultValues: projectDefaultValues,
    resolver: yupResolver(projectValidationSchema),
  });

  const onSubmit = async (value: any) => {
    setIsSaving(true);
    const payload = {
      name: value.name,
      location: value.location,
    } as any;

    try {
      if (!_.isEmpty(data)) {
        payload.id = data.id;
        await putProjects(payload);
      } else {
        await postProjects(payload);
      }
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (!_.isEmpty(data)) {
        setValue("name", data.name);
        setValue("location", data.location);
      } else {
        reset(projectDefaultValues);
      }
    } else {
      reset(projectDefaultValues);
    }
  }, [data, isOpen, reset, setValue]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        onClose();
        reset();
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {!_.isEmpty(data) ? "Edit" : "Add"} Projects
          </DialogTitle>
          <DialogDescription className="py-5 flex gap-3 flex-col">
            <Controller
              control={control}
              name="name"
              render={({ field }) => <Input {...field} placeholder="Name" />}
            />
            <Controller
              control={control}
              name="location"
              render={({ field }) => (
                <Input {...field} placeholder="Location" />
              )}
            />
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid || _.isEmpty(dirtyFields)}
          >
            {isSaving ? <ClipLoader size={20} color="#ffffff" /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjects;
