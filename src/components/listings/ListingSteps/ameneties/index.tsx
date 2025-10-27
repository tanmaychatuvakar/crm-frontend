import React from "react";
import { useGetCommonQuery } from "@/app/services/api";
import { Checkbox } from "@/components/shared/checkbox";
import { StepProps } from "@/types/step.props";
import { Controller } from "react-hook-form";

const AmenitiesStep: React.FC<StepProps> = ({ control, readOnly }) => {
  const { data } = useGetCommonQuery();

  return (
    <div className="grid grid-cols-12 gap-4">
      <h2 className="col-span-12 font-light text-2xl text-gray-500">
        Amenities
      </h2>
      <Controller
        name="amenities"
        control={control}
        defaultValue={[]}
        render={({ field: { value, onChange, disabled } }) => (
          <>
            {data?.amenities.map((amenity) => {
              const index = value.findIndex((a) => a.id === amenity.id);
              return (
                <div className="col-span-6 sm:col-span-3" key={amenity.id}>
                  <Checkbox
                    disabled={disabled}
                    value={amenity.id}
                    checked={index !== -1}
                    label={amenity.name}
                    onChange={() => {
                      if (index !== -1) {
                        onChange(value.filter((v) => v.id !== amenity.id));
                        return;
                      }
                      onChange([...value, amenity]);
                    }}
                    readOnly={readOnly}
                  />
                </div>
              );
            })}
          </>
        )}
      />
    </div>
  );
};

export default AmenitiesStep;
