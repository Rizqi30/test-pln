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
import { Combobox } from "@/components/ui/combobox";
import { DatePicker } from "@/components/ui/datepicker";
import { detailDefaultValues } from "@/form";
import { yupResolver } from "@hookform/resolvers/yup";
import { detailValidationSchema } from "@/form/validation";
import moment from "moment";
// import useHome from "@/hooks/dummy/useHome";
import { ClipLoader } from "react-spinners";

const AddWorklog = ({ isOpen, onClose, idUser, postWorklogData, dataProjectOriginal }: any) => {
  const [isSaving, setIsSaving] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: detailDefaultValues,
    resolver: yupResolver(detailValidationSchema),
  });

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      const payload = {
        project_id: Number(data.project_id),
        user_id: idUser,
        work_date: moment(data.work_date).format("YYYY-MM-DD"),
        hours_worked: Number(data.hours_worked),
      };
      await postWorklogData(payload);
      onClose();
    } catch (error) {
      console.error("Gagal menyimpan worklog:", error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      reset(detailDefaultValues);
    }
  }, [isOpen, reset]);

  const projectOptions = dataProjectOriginal?.map((p: any) => ({
    label: p.name,
    value: p.id,
  })) || [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {if (!open) onClose();}} modal={true}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Worklog</DialogTitle>
          <DialogDescription className="py-5 flex gap-3 flex-col">
            <Controller
              control={control}
              name="project_id"
              render={({ field }) => (
                <Combobox
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  placeholder="Pilih Proyek"
                  options={projectOptions}
                />
              )}
            />
            <div className="flex gap-3">
              <Controller
                control={control}
                name="work_date"
                render={({ field }) => <DatePicker {...field} />}
              />
              <Controller
                control={control}
                name="hours_worked"
                render={({ field }) => (
                  <Input
                    placeholder="Jam Kerja"
                    type="number"
                    max={8}
                    error={errors.hours_worked?.message}
                    {...field}
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
            disabled={isSaving || !isValid}
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

export default AddWorklog;
