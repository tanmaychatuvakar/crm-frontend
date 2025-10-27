import { AppSelect, Toggle, Input } from "@/components/shared";
import { CreateContactDialog } from "@/components/CreateContactDialog";
import { Controller } from "react-hook-form";
import React, { useState } from "react";
import { useGetCommonQuery, useGetContactsQuery } from "@/app/services/api";
import { StepProps } from "@/types/step.props";
import { css } from "@/utils";

const GeneralStep: React.FC<StepProps & { type?: string; mode?: string }> = ({
  register,
  control,
  errors,
  setValue,
  watch,
  disabled,
  readOnly,
  mode,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: common, isLoading: isCommonLoading } = useGetCommonQuery();

  const { data: contacts, isLoading: isContactsLoading } =
    useGetContactsQuery();

  const isCommercial = watch("isCommercial");

  const btnDisabled = ["create", "edit"].every((m) => mode !== m);

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <h2 className="col-span-12 font-light text-2xl text-gray-500">
          General Info
        </h2>

        <div className="col-span-12">
          <div className="flex">
            <Controller
              control={control}
              name="contactId"
              render={({
                field: { onChange, value, disabled },
                fieldState: { error },
              }) => (
                <AppSelect
                  required
                  label="Contact"
                  placeholder="Contact"
                  name="contactId"
                  error={error?.message}
                  disabled={disabled}
                  options={contacts}
                  value={value}
                  onChange={onChange}
                  loading={isContactsLoading}
                />
              )}
            />

            <button
              className={css(
                "border-r border-b border-t border-black border-opacity-60 text-xl px-3",
                {
                  "cursor-not-allowed border-gray-400 text-gray-400":
                    btnDisabled,
                }
              )}
              type="button"
              onClick={() => setIsOpen(true)}
              disabled={btnDisabled}
            >
              +
            </button>
          </div>
        </div>

        <div className="col-span-12">
          <Controller
            control={control}
            name="sourceId"
            render={({
              field: { onChange, value, disabled },
              fieldState: { error },
            }) => (
              <AppSelect
                label="Listing Source"
                placeholder="Listing Source"
                name="sourceId"
                error={error?.message}
                disabled={disabled}
                options={common?.sources}
                value={value}
                onChange={onChange}
                loading={isCommonLoading}
              />
            )}
          />
        </div>

        <div className="flex space-x-6 col-span-12 my-2">
          <Toggle
            {...register("isExclusive", { disabled })}
            label="Exclusive"
            disabled={readOnly}
          />
          <Toggle
            {...register("isCommercial", { disabled })}
            label="Commercial"
            disabled={readOnly}
          />
        </div>

        <div className="col-span-12">
          <Controller
            control={control}
            name="fitted"
            render={({
              field: { onChange, value, disabled },
              fieldState: { error },
            }) => (
              <AppSelect
                label="Fitted"
                placeholder="Fitted"
                name="fitted"
                error={error?.message}
                disabled={disabled || !isCommercial}
                options={common?.fitted}
                value={value}
                onChange={onChange}
                loading={isCommonLoading}
              />
            )}
          />
        </div>

        <div className="col-span-12">
          <Input
            label="STR"
            placeholder="STR"
            {...register("str", { disabled })}
            error={errors.str?.message}
            readOnly={readOnly}
          />
        </div>
      </div>

      <CreateContactDialog
        open={isOpen}
        onClose={(contact) => {
          setIsOpen(!isOpen);
          setValue("contactId", contact.id);
        }}
      />
    </>
  );
};

export default GeneralStep;
