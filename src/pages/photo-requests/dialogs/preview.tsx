import React, { useState } from "react";
import {
  Input,
  Textarea,
  Checkbox,
  AppDialog,
  Button,
} from "@/components/shared";

import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import {
  useApprovePhotoRequestMutation,
  useGetPhotoRequestQuery,
} from "@/app/services/api";
import RejectDialog from "./reject";
import { GetPhotoRequestPayload } from "@/types/photo-request.type";
import { AssignDialog } from "@/pages/photoshoots/dialogs/assign";

import Datetime from "react-datetime";

type PhotoRequestWithPhotoshoot = GetPhotoRequestPayload<{ photoshoot: true }>;

export const PreviewDialog: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const { id } = useParams();

  const { data } = useGetPhotoRequestQuery({
    id: id as string,
    include: "photoshoot",
  });

  const {
    register,
    formState: { errors },
    control,
  } = useForm({
    values: {
      ...data,
      scheduledAt: data?.scheduledAt ?? "",
      isUnitReady: false,
    },
  });

  return (
    <AppDialog onClose={onClose} open={open}>
      <AppDialog.Title>Photo Request</AppDialog.Title>
      <AppDialog.Description>Preview Photo Request</AppDialog.Description>
      <form className="mt-4">
        <div className="grid grid-cols-6 gap-3">
          <div className="col-span-6">
            <Controller
              name="scheduledAt"
              control={control}
              disabled
              render={({ field: { value, onChange, ref, disabled } }) => (
                <Datetime
                  value={value}
                  onChange={onChange}
                  ref={ref}
                  inputProps={{ disabled, className: "w-full" }}
                />
              )}
            />
          </div>

          <div className="col-span-6">
            <Input
              label="Occupancy"
              placeholder="Occupancy"
              error={errors.occupancy?.message}
              {...register("occupancy")}
              disabled
            />
          </div>

          <div className="col-span-6">
            <Input
              label="Key Location"
              placeholder="Key Location"
              error={errors.keyLocation?.message}
              {...register("keyLocation")}
              disabled
            />
          </div>

          <div className="col-span-6">
            <Input
              label="Building Access Card"
              placeholder="Building Access Card"
              error={errors.buildingAccessCardLocation?.message}
              {...register("buildingAccessCardLocation")}
              disabled
            />
          </div>

          <div className="col-span-6">
            <Input
              label="Parking Access Card"
              placeholder="Parking Access Card"
              error={errors.parkingAccessCardLocation?.message}
              {...register("parkingAccessCardLocation")}
              disabled
            />
          </div>

          <div className="col-span-6">
            <Textarea
              label="Comments"
              placeholder="Comments"
              disabled
              error={errors.comments?.message}
              {...register("comments")}
            />
          </div>

          <div className="col-span-6">
            <Checkbox
              disabled
              label="Broker will be present"
              {...register("isBrokerPresent")}
            />
          </div>

          <div className="col-span-6">
            <Checkbox
              checked
              disabled
              label="I confirm the unit is clean and dressed for this photoshoot"
              {...register("isUnitReady")}
            />
          </div>
        </div>
        {data && <Actions photoRequest={data as PhotoRequestWithPhotoshoot} />}
      </form>
    </AppDialog>
  );
};

const PendingActions: React.FC<{ id: string }> = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const [mutate, { isLoading }] = useApprovePhotoRequestMutation();

  const handleAcceptPhotoRequest = async () => {
    try {
      await mutate(id).unwrap();
      navigate(-1);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Button
        onClick={handleAcceptPhotoRequest}
        isLoading={isLoading}
        type="button"
      >
        Accept
      </Button>
      <Button type="button" onClick={() => setIsOpen(true)}>
        Reject
      </Button>
      <RejectDialog id={id} open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

const ApprovedActions: React.FC<{ photoshootId: string }> = ({
  photoshootId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)} type="button">
        Assign
      </Button>
      <AssignDialog
        open={isOpen}
        id={photoshootId}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

const Actions: React.FC<{
  photoRequest: PhotoRequestWithPhotoshoot;
}> = ({ photoRequest }) => {
  return (
    <div className="flex gap-2 items-center justify-end">
      {photoRequest.status === "PENDING" && (
        <PendingActions id={photoRequest.id} />
      )}
      {photoRequest.photoshoot?.status === "UNASSIGNED" ? (
        <ApprovedActions photoshootId={photoRequest.photoshoot.id} />
      ) : null}
    </div>
  );
};
