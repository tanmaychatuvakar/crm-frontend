import { PageDescription, PageHeading } from "@/components/shared";

import { useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi2";

import { Actions } from "@/components/Leads/Actions";

export const Preview = () => {
  const navigate = useNavigate();

  // if (isLoading) {
  //   return (
  //     <div>
  //       <Spinner />
  //     </div>
  //   );
  // }

  // if (isError) {
  //   return (
  //     <div className="h-screen items-center justify-center">
  //       <h2>Error occured retrieving data</h2>
  //     </div>
  //   );
  // }

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          className="flex items-center justify-center mb-4 text-primary-500 hover:text-primary-400"
          onClick={() => navigate(-1)}
        >
          <span className="mr-2">
            <HiArrowLeft />
          </span>
          Back
        </button>

        <Actions lead={{}} />
      </div>

      <div className="mb-8">
        <PageHeading>Preview Lead</PageHeading>
        <PageDescription>Here are all the lead details</PageDescription>
      </div>

      {/* <LeadForm stepsProps={stepsProps} onSubmit={handleSubmit(onSubmit)} /> */}
    </div>
  );
};
