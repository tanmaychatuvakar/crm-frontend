import { Button } from "@/components/shared";
import { AppDataTable } from "@/components/AppDataTable";

import { useNavigate, useSearchParams } from "react-router-dom";

import {
  useDeleteCampaignMutation,
  useGetCampaignsQuery,
} from "@/app/services/api";
import { Column } from "@/types/column.type";
import { Campaign } from "@/types/campaign.type";
import { Team } from "@/types/team.type";
import { Source } from "@/types/source.type";

import { useCallback, useMemo } from "react";
import { toast } from "react-toastify";

type Payload = Campaign & { team: Team; source: Source };

export const Index = () => {
  const navigate = useNavigate();

  const [params, setParams] = useSearchParams({
    page: "1",
    pageSize: "25",
  });

  const [mutate] = useDeleteCampaignMutation();

  const destroy = useCallback(
    async (campaignId: string) => {
      try {
        await mutate(campaignId);
      } catch {
        toast.error("Could not delete campaign");
      }
    },
    [mutate]
  );

  const columns: Column<Payload>[] = useMemo(() => {
    return [
      {
        label: "Name",
        render: (row) => <span>{row.name}</span>,
      },
      {
        label: "Source",
        render: (row) => <span>{row.source.name}</span>,
      },
      {
        label: "Team",
        render: (row) => <span>{row.team.name}</span>,
      },
      {
        label: "Webhook",
        render: (row) => <span>{row.webhook}</span>,
      },
      {
        label: "Actions",
        render: (row) => {
          return (
            <div className="space-x-1">
              <button
                className="font-semibold uppercase text-blue-600 text-xs"
                onClick={() => navigate(`${row.id}/edit`)}
              >
                Edit
              </button>
              <button
                className="font-semibold uppercase text-red-600 text-xs"
                onClick={() => destroy(row.id)}
              >
                Delete
              </button>
            </div>
          );
        },
      },
    ];
  }, [mutate]);

  const { data, isLoading } = useGetCampaignsQuery({
    page: params.get("page") ?? undefined,
    pageSize: params.get("pageSize") ?? undefined,
    include: "team,source",
  });

  return (
    <div>
      <div className="flex justify-between mb-12">
        <h1 className="font-bold text-2xl">Campaigns</h1>
        <Button variant="secondary" onClick={() => navigate("create")}>
          Create
        </Button>
      </div>

      <AppDataTable
        columns={columns}
        data={data?.data || []}
        loading={isLoading}
        identifier="campaigns"
        total={data?.total || 0}
        defaultPaginationValue={{
          currentPage: +params.get("page")!,
          pageSize: +params.get("pageSize")!,
        }}
        onPaginationChange={(state) => {
          setParams({
            page: state.currentPage.toString(),
            pageSize: state.pageSize.toString(),
          });
        }}
        filterable
      />
    </div>
  );
};
