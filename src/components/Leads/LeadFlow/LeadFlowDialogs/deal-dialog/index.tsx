// Components
import {
  AppDialog,
  AppSelect,
  Button,
  Checkbox,
  Input,
} from "@/components/shared";
// Validation
import { Controller, useForm } from "react-hook-form";

import { DealDialogProps } from "./props";
import { z } from "zod";
import { useConvertOfferMutation } from "@/app/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";

export const formSchema = z.object({
  offerId: z.string(),
  unpublish: z.boolean().default(false),
});

export const DealDialog: React.FC<DealDialogProps> = ({
  open,
  onClose,
  leadId,
  offers,
  offerId,
  ...rest
}) => {
  const [convert, { isLoading }] = useConvertOfferMutation();

  const { handleSubmit, control, register } = useForm<
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    values: {
      offerId,
      unpublish: true,
    },
  });

  const offer = useMemo(
    () => offers.find((offer) => offer.id === offerId),
    [offerId, offers]
  );

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await convert({
        leadId,
        ...data,
      }).unwrap();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppDialog open={open} onClose={onClose} {...rest}>
      <AppDialog.Title>Deal</AppDialog.Title>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12 gap-3 mt-8">
          <div className="col-span-12">
            <Controller
              name="offerId"
              control={control}
              render={({ field: { onChange, value } }) => (
                <AppSelect
                  label="Offer"
                  placeholder="Offer"
                  onChange={onChange}
                  value={value}
                  options={offers.map(({ id, viewing: { listing } }) => ({
                    value: id,
                    label: `${listing.title}, ${listing.city?.name}, ${
                      listing.community?.name
                    }, ${listing.subcommunity?.name ?? "-"}, ${
                      listing.property?.name ?? "-"
                    }`,
                  }))}
                />
              )}
            />
          </div>
          <div className="col-span-12">
            <Checkbox
              label="Unpublish after closing"
              {...register("unpublish")}
            />
          </div>

          <div className="col-span-6">
            <Input
              label="Type"
              placeholder="Type"
              value={offer?.viewing.listing.isSale ? "Sale" : "Rental"}
              disabled
            />
          </div>

          <div className="col-span-6">
            <Input
              label="Category"
              placeholder="Category"
              value={offer?.viewing.listing.category?.name}
              disabled
            />
          </div>

          <div className="col-span-6 md:col-span-4">
            <Input
              label="Location"
              placeholder="Location"
              value={offer?.viewing.listing.community?.name}
              disabled
            />
          </div>

          <div className="col-span-6 md:col-span-4">
            <Input
              label="Sublocation"
              placeholder="Sublocation"
              value={offer?.viewing.listing.subcommunity?.name}
              disabled
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <Input
              label="Building"
              placeholder="Building"
              value={offer?.viewing.listing.property?.name}
              disabled
            />
          </div>

          <div className="col-span-6">
            <Input
              label="Bedrooms"
              placeholder="Bedrooms"
              value={offer?.viewing.listing.numberOfBedrooms ?? undefined}
              disabled
            />
          </div>

          <div className="col-span-6">
            <Input
              label="Bathrooms"
              placeholder="Bathrooms"
              value={offer?.viewing.listing.numberOfBathrooms ?? undefined}
              disabled
            />
          </div>

          <div className="col-span-12">
            <Input
              label="Furnished"
              placeholder="Furnished"
              value={offer?.viewing.listing.furnished ?? undefined}
              disabled
            />
          </div>

          <div className="col-span-12">
            <Input
              label="Total Area"
              value={offer?.viewing.listing.totalArea ?? undefined}
              placeholder="Total Area"
              disabled
            />
          </div>

          <div className="col-span-12">
            <Input
              label="Offer Price"
              value={offer?.price}
              placeholder="Price"
              disabled
            />
          </div>
        </div>

        <div className="flex justify-end gap-x-3 mt-5">
          <Button isLoading={isLoading}>Close Deal</Button>
          <Button onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </AppDialog>
  );
};
