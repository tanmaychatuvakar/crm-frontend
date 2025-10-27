import { useGetCommonQuery } from "@/app/services/api";
import { Checkbox } from "@/components/shared/checkbox";
import { StepProps } from "@/types/step.props";
import React from "react";
import { Controller } from "react-hook-form";

const FeaturesStep: React.FC<StepProps> = ({ control, readOnly }) => {
  const { data } = useGetCommonQuery();

  return (
    <div className="grid grid-cols-12 gap-4">
      <h2 className="col-span-12 font-light text-2xl text-gray-500">
        Features
      </h2>
      <Controller
        name="features"
        control={control}
        defaultValue={[]}
        render={({ field: { value, onChange, disabled } }) => (
          <>
            {data?.features.map((feature) => {
              const index = value.findIndex(
                (f: { id: string }) => f.id === feature.id
              );
              return (
                <div className="col-span-6 sm:col-span-3" key={feature.id}>
                  <Checkbox
                    disabled={disabled}
                    value={feature.id}
                    checked={index !== -1}
                    label={feature.name}
                    onChange={() => {
                      if (index !== -1) {
                        onChange(value.filter((v) => v.id !== feature.id));
                        return;
                      }
                      onChange([...value, feature]);
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

export default FeaturesStep;
