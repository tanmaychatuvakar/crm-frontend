import { Controller, useForm } from "react-hook-form";
import { Button, Input, AppSelect, Label } from "../../shared";
import { FormProps } from "./Form.props";

import { AiOutlineSearch } from "react-icons/ai";
import { useEffect } from "react";
import { useGetCommonQuery } from "@/app/services/api";
export const SearchForm: React.FC<FormProps> = ({
  onSubmit,
  onClose,
  setSearch,
  mode,
}) => {
  const { data } = useGetCommonQuery();

  const {
    register,
    handleSubmit,
    control,
    watch,
    // formState: { errors },
    reset,
  } = useForm({});

  const { locations, categories, furnished, propertyStatus } = data || {};

  const sublocationSelected = watch("sublocationId");

  const watchSearch = watch();
  useEffect(() => {
    setSearch(watchSearch);
  }, [watchSearch]);

  return (
    <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
      {mode == "listings" && (
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12">
            <Input
              label="Title"
              placeholder="Title"
              {...register("search", { required: true })}
              // error={errors.search?.message}
              suffix={<AiOutlineSearch />}
            />
          </div>
          <div className="col-span-4">
            <Controller
              control={control}
              name="locationId"
              render={({ field: { onChange, value } }) => (
                <AppSelect
                  label="Location"
                  placeholder="Location"
                  options={locations || []}
                  // error={errors.locationId?.message}
                  value={
                    locations?.find((option: any) => option.value === value)?.value ?? ""
                  }
                  onChange={(selectedOption: any) =>
                    onChange(selectedOption?.value)
                  }
                />
              )}
            />
          </div>

          <div className="col-span-4">
            <Controller
              control={control}
              name="sublocationId"
              render={({ field: { onChange, value } }) => (
                <AppSelect
                  label="Sublocation"
                  placeholder="Sublocation"
                  // disabled={!locationSelected || isLoadingSublocations}
                  // error={errors.sublocationId?.message}
                  options={[]}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </div>

          <div className="col-span-4">
            <Label htmlFor="building">Building</Label>
            <Controller
              control={control}
              name="buildingId"
              render={({ field: { onChange, value } }) => (
                <AppSelect
                  label="Building"
                  placeholder="Building"
                  disabled={!sublocationSelected}
                  options={[]}
                  value={value}
                  onChange={onChange}
                  // error={errors.building?.message}
                />
              )}
            />
          </div>

          <div className="col-span-4">
            <Input
              label="Ref"
              placeholder="Ref"
              // error={errors.reference?.message}
              {...register("reference")}
            />
          </div>

          <div className="col-span-4">
            <Controller
              control={control}
              name="categoryId"
              render={({ field: { onChange, value } }) => (
                <AppSelect
                  label="Category"
                  placeholder="Category"
                  options={categories || []}
                  value={categories?.find((option: any) => option.value === value)?.value ??""}
                  onChange={onChange}
                  // error={errors.categoryId?.message}
                />
              )}
            />
          </div>

          <div className="col-span-4">
            <Controller
              control={control}
              name="furnished"
              render={({ field: { onChange, value } }) => (
                <AppSelect
                  label="Furnished"
                  placeholder="Furnished"
                  options={furnished || []}
                  // error={errors.furnished?.message}
                  value={
                    furnished?.find((option: any) => option.value === value)?.value ?? ""
                  }
                  onChange={onChange}
                />
              )}
            />
          </div>

          <div className="col-span-3">
            <Input
              label="Min Bedrooms"
              placeholder="Min Bedrooms"
              {...register("minNumberOfBedrooms")}
              type="number"
              // error={errors.minNumberOfBedrooms?.message}
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>

          <div className="col-span-3">
            <Input
              label="Max Bedrooms"
              placeholder="Max Bedrooms"
              {...register("maxNumberOfBedrooms")}
              type="number"
              // error={errors.maxNumberOfBedrooms?.message}
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>

          <div className="col-span-3">
            <Input
              label="Min Price"
              placeholder="Min Price"
              {...register("minPrice")}
              // error={errors.minPrice?.message} 
              type="number"
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>

          <div className="col-span-3">
            <Input
              label="Max Price"
              placeholder="Max Price"
              {...register("maxPrice")}
              // error={errors.maxPrice?.message}
              type="number"
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>

          <div className="col-span-3">
            <Input
              label="Min Area"
              placeholder="Min Area"
              {...register("minArea")}
              type="number"
              // error={errors.minArea?.message}
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>

          <div className="col-span-3">
            <Input
              label="Max Area"
              placeholder="Max Area"
              {...register("maxArea")}
              type="number"
              onWheel={(e) => e.currentTarget.blur()}
              // error={errors.maxArea?.message}
            />
          </div>

          <div className="col-span-6">
            <Controller
              control={control}
              name="contactId"
              render={({ field: { onChange, value } }) => (
                <AppSelect
                  label="Contact"
                  placeholder="Contact"
                  options={[]}
                  onChange={onChange}
                  value={value}
                  // error={errors.contactId?.message}
                />
              )}
            />
          </div>

          <div className="col-span-4">
            <Controller
              control={control}
              name="status"
              render={({ field: { onChange, value } }) => (
                <AppSelect
                  label="Property Status"
                  placeholder="Property Status"
                  options={propertyStatus || []}
                  value={value}
                  onChange={onChange}
                  // error={errors.status?.message}
                />
              )}
            />
          </div>

          <div className="col-span-4">
            <Input
              label="Unit Number"
              placeholder="Unit Number"
              {...register("unitNumber")}
              // error={errors.unitNumber?.message}
            />
          </div>

          <div className="col-span-4">
            <Controller
              control={control}
              name="agentId"
              render={({ field: { onChange, value } }) => (
                <AppSelect
                  label="Agent"
                  placeholder="Agent"
                  options={[]}
                  value={value}
                  onChange={onChange}
                  // error={errors.agentId?.message}
                />
              )}
            />
          </div>


          {false && (
            <>
              <div className="col-span-6">
                {/* <Label htmlFor="publishedFrom">Published date from</Label> */}
                <Input
                  label=""
                  placeholder=""
                  {...register("publishedFrom")}
                  type="date"
                  // error={errors.publishedFrom?.message}
                />
              </div>

              <div className="col-span-6">
                {/* <Label htmlFor="publishedTo">Published date to</Label> */}
                <Input
                  label=""
                  placeholder=""
                  {...register("publishedTo")}
                  type="date"
                  // error={errors.publishedTo?.message}
                />
              </div>
            </>
          )}
        </div>
      )}
      {mode == "users" && (
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12">
            {/* <Label htmlFor="search">Name</Label> */}
            <Input
              label=""
              {...register("search", { required: true })}
              placeholder="Search"
              id="search"
              suffix={<AiOutlineSearch />}
              // error={errors.search?.message}
            />
          </div>
        </div>
      )}

      <div className="mt-4 space-x-1 flex justify-between">

        <div className="flex gap-x-2">
          <Button type="submit">
            Search
          </Button>
          <Button type="button" onClick={reset}>
            Clear
          </Button>
        </div>

        <Button onClick={onClose}>
          Cancel
        </Button>

      </div>
    </form>
  );
};
