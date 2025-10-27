import { AppDataTable } from "@/components/AppDataTable";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useDeleteTeamMutation, useGetTeamsQuery } from "@/app/services/api";
import { Column } from "@/types/column.type";
import { Team } from "@/types/team.type";

import { Button } from "@/components/shared";
import { User } from "@/types/user.type";
import { Avatar } from "@/components/shared/avatar";
import { useCallback, useMemo } from "react";
import { toast } from "react-toastify";

type Payload = Team & { _count: { users: number }; users: User[] };

export const Index = () => {
  const navigate = useNavigate();

  const [params, setParams] = useSearchParams({
    page: "1",
    pageSize: "25",
  });

  const [mutate] = useDeleteTeamMutation();

  const destroy = useCallback(
    async (campaignId: string) => {
      try {
        await mutate(campaignId);
      } catch {
        toast.error("Could not delete team");
      }
    },
    [mutate]
  );

  const columns: Column<Payload>[] = useMemo(
    () => [
      {
        label: "Name",
        render: (row) => <span>{row.name}</span>,
      },
      {
        label: "Participants",
        render: (row) => {
          const users = row._count.users;
          return (
            <div className="flex -space-x-3">
              {row.users.map((user) => (
                <Avatar
                  size="sm"
                  image={user.profileImage}
                  fallback={user.name[0]}
                />
              ))}
              {users > 3 ? (
                <Avatar size="sm" fallback={`+${users - 3}`} />
              ) : null}
            </div>
          );
        },
      },
      {
        label: "Actions",
        render: (row) => {
          return (
            <div className="space-x-2">
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
    ],
    [destroy]
  );

  const { data, isLoading } = useGetTeamsQuery({
    page: params.get("page") ?? undefined,
    pageSize: params.get("pageSize") ?? undefined,
    include: "users",
  });

  return (
    <div>
      <div className="flex justify-between mb-12">
        <h1 className="font-bold text-2xl">Teams</h1>
        <Button variant="secondary" onClick={() => navigate("create")}>
          Create
        </Button>
      </div>
      <AppDataTable
        columns={columns}
        data={data?.data || []}
        loading={isLoading}
        identifier="teams"
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
