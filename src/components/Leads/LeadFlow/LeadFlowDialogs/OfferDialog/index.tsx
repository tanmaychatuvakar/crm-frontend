import { useCallback, useEffect, useState } from "react";

import { AppDialog, AppSelect, Button, Input } from "@/components/shared";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { OfferDialogProps } from "./props";
import { z } from "zod";
import { GetViewingPayload } from "@/types/viewing.type";
import { useCreateOfferMutation, useGetCommonQuery } from "@/app/services/api";

const types = [
  { label: "Sale", value: "SALE" },
  { label: "Rental", value: "RENTAL" },
];

const formSchema = z.object({
  viewingId: z.string().min(1, { message: "Viewing is required" }),
  price: z.number({ message: "Offer must be a number" }).int(),
  cheques: z.number().int().optional(),
  offeredAt: z.string().date("Enter a valid date"),
});

type FormValues = z.infer<typeof formSchema>;

export const OfferDialog: React.FC<OfferDialogProps> = ({
  viewings = [],
  leadId,
  open,
  onClose: baseOnClose,
  ...rest
}) => {
  const [viewing, setViewing] = useState<GetViewingPayload<{
    listing: true;
    user: true;
    feedback: true;
  }> | null>(null);
  const [createOffer, { isLoading }] = useCreateOfferMutation();

  const { data: common } = useGetCommonQuery();
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    watch,
    setError,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const viewingId = watch("viewingId");

  const onClose = useCallback(() => {
    reset();
    baseOnClose();
  }, []);

  const onSubmit = useCallback(
    async (data: FormValues) => {
      if (viewing?.listing.isRental && !data.cheques) {
        setError("cheques", { type: "required" });
        return;
      }
      try {
        await createOffer({
          leadId,
          offeredAt: new Date(data.offeredAt).toISOString(),
          price: data.price,
          viewingId: data.viewingId,
          cheques: data.cheques !== undefined ? +data.cheques : null,
        }).unwrap();
        reset();
        onClose();
      } catch (err) {
        console.error(err);
      }
    },
    [viewing, leadId]
  );

  useEffect(() => {
    const viewing = viewings.find((v) => v.id === viewingId);
    if (viewing) setViewing(viewing);
  }, [viewings, viewingId]);

  return (
    <AppDialog open={open} onClose={onClose} {...rest}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <AppDialog.Title>Offer</AppDialog.Title>
        <div className="grid grid-cols-12 gap-3 mt-8">
          <div className="col-span-12">
            <Input
              required
              type="date"
              label="Date"
              placeholder="Date"
              error={errors.offeredAt?.message}
              {...register("offeredAt")}
            />
          </div>
          <div className="col-span-12">
            <Input
              required
              type="number"
              label="Offer"
              placeholder="Offer Price/Rent"
              error={errors.price?.message}
              {...register("price", { valueAsNumber: true })}
            />
          </div>

          <div className="col-span-12 ">
            <Controller
              name="cheques"
              control={control}
              disabled={!viewing || viewing.listing.isSale}
              render={({
                field: { onChange, value, disabled },
                fieldState: { error },
              }) => (
                <AppSelect
                  label="Cheques"
                  placeholder="Cheques"
                  onChange={(value) => {
                    onChange(typeof value === "string" ? +value : undefined);
                  }}
                  value={value?.toString()}
                  options={common?.cheques}
                  disabled={disabled}
                  error={error?.message}
                />
              )}
            />
          </div>

          {/* Should be a search select */}
          <div className="col-span-12">
            <Controller
              name="viewingId"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <AppSelect
                  label="Viewing"
                  placeholder="Viewing"
                  onChange={onChange}
                  value={value}
                  options={viewings.map((viewing) => ({
                    label: `[${viewing.listing.reference}] ${viewing.listing.title}`,
                    value: viewing.id,
                  }))}
                  error={error?.message}
                />
              )}
            />
          </div>

          {/* <div className="col-span-12">
            <Checkbox label="Notify landlord ?" />
          </div> */}

          <div className="col-span-12 my-2.5">
            <hr />
          </div>

          <div className="col-span-6">
            <AppSelect
              label="Type"
              placeholder="Type"
              value={viewing?.listing.isSale ? "SALE" : "RENTAL"}
              options={types}
              disabled
            />
          </div>

          <div className="col-span-6">
            <AppSelect
              label="Category"
              placeholder="Category"
              value={viewing?.listing.categoryId}
              options={common?.categories}
              disabled
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <AppSelect
              label="City"
              placeholder="City"
              value={viewing?.listing.cityId}
              options={common?.locations}
              disabled
            />
          </div>

          <div className="col-span-6 md:col-span-4">
            <AppSelect label="Community" placeholder="Community" disabled />
          </div>

          <div className="col-span-6 md:col-span-4">
            <AppSelect
              label="Subcommunity"
              placeholder="Subcommunity"
              disabled
            />
          </div>

          <div className="col-span-6">
            <AppSelect
              label="Bedrooms"
              placeholder="Bedrooms"
              value={viewing?.listing.numberOfBedrooms?.toString()}
              options={common?.bedrooms}
              disabled
            />
          </div>

          <div className="col-span-6">
            <AppSelect
              label="Bathrooms"
              placeholder="Bathrooms"
              value={viewing?.listing.numberOfBathrooms?.toString()}
              options={common?.bathrooms}
              disabled
            />
          </div>

          <div className="col-span-12">
            <AppSelect
              label="Furnished"
              placeholder="Furnished"
              value={viewing?.listing.furnished}
              options={common?.furnished}
              disabled
            />
          </div>

          <div className="col-span-12">
            <Input
              label="Asking Price"
              placeholder="Asking Price"
              value={viewing?.listing.salePrice ?? undefined}
              readOnly
            />
          </div>

          {/* <div className="col-span-6 md:col-span-12">
            <Input
              label="Unit"
              placeholder="Unit"
            />
          </div> */}
        </div>

        <div className="flex justify-end gap-x-3 mt-5">
          <Button isLoading={isLoading}>Submit Offer</Button>
          <Button onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </AppDialog>
  );
};
