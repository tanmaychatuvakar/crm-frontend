// import { useMemo } from "react";
// import { Button, PageDescription, PageHeading } from "@/components/shared";
// import { useForm } from "react-hook-form";
// import { LeadForm } from "@/components/Leads/LeadForm";

// export const Edit = () => {
//   const {
//     control,
//     register,
//     handleSubmit,
//     watch,
//     getValues,
//     setValue,
//     formState: { errors },
//     resetField,
//   } = useForm();

//   const stepsProps = useMemo(() => {
//     return {
//       register,
//       control,
//       errors,
//       watch,
//       getValues,
//       setValue,
//       mode: "edit",
//       disabled: false,
//       resetField,
//     };
//   }, [register, control, errors, watch, getValues, resetField, setValue]);

//   const onSubmit = () => {};

//   return (
//     <div>
//       <div className="flex items-center justify-between">
//         <div className="flex space-x-2 self-start">
//           <Button
//             isLoading={false}
//             onClick={handleSubmit(onSubmit)}
//           >
//             Save
//           </Button>
//         </div>
//       </div>

//       <div className="mb-8">
//         <PageHeading>Edit Lead</PageHeading>
//         <PageDescription>
//           Fill in the required fields
//           <span className="text-red-500">(*) </span>
//           to edit this lead
//         </PageDescription>
//       </div>

//       <LeadForm stepsProps={stepsProps} onSubmit={handleSubmit(onSubmit)} />
//     </div>
//   );
// };
