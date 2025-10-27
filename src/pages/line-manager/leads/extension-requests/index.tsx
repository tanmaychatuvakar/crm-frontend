import { Badge } from "@/components/shared";
import { AppDataTable } from "@/components/AppDataTable";
import { BadgeVariants } from "@/components/shared/badge/badge.props";
import { useSearchParams } from "react-router-dom";
import {
  useApproveLeadExtensionRequestMutation,
  useGetLeadExtensionRequestsQuery,
  useRejectLeadExtensionRequestMutation,
} from "@/app/services/api";
import { Column } from "@/types/column.type";
import { useCallback, useMemo } from "react";

type Payload = {
  id: string;
  status: string;
  reason: string;
  lead: {
    reference: string;
  };
};

export const getVariant = (status: string) => {
  let variant: BadgeVariants | undefined;
  switch (status) {
    case "PENDING":
      variant = "warning";
      break;
    case "APPROVED":
      variant = "success";
      break;
    case "REJECTED":
      variant = "danger";
      break;
    default:
      variant = "info";
  }
  return variant;
};

export const ExtensionRequests = () => {
  const [params, setParams] = useSearchParams({
    page: "1",
    pageSize: "25",
  });

  const { data, isLoading } = useGetLeadExtensionRequestsQuery({
    page: params.get("page") ?? undefined,
    pageSize: params.get("pageSize") ?? undefined,
    include: "lead",
  });

  const [approve] = useApproveLeadExtensionRequestMutation();
  const [reject] = useRejectLeadExtensionRequestMutation();

  const handleApprove = useCallback(async (id: string) => {
    try {
      await approve(id).unwrap();
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleReject = useCallback(async (id: string) => {
    try {
      await reject(id).unwrap();
    } catch (err) {
      console.error(err);
    }
  }, []);

  const columns: Column<Payload>[] = useMemo(
    () => [
      {
        label: "Lead Ref",
        render: (row) => <span>{row.lead.reference}</span>,
      },
      {
        label: "Status",
        render: (row) => (
          <span>
            <Badge variant={getVariant(row.status)}>{row.status}</Badge>
          </span>
        ),
      },
      { label: "Reason", accessor: "reason" },
      {
        label: "Actions",
        render: (row) => {
          if (row.status !== "PENDING") return;
          return (
            <div className="space-x-3">
              <button
                className="text-sm font-medium text-blue-500 hover:opacity-60 transition-all"
                onClick={() => handleApprove(row.id)}
              >
                Approve
              </button>
              <button
                className="text-sm font-medium text-red-500 hover:opacity-60 transition-all"
                onClick={() => handleReject(row.id)}
              >
                Reject
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-12">Extension Requests</h1>

      <AppDataTable
        columns={columns}
        data={data?.data || []}
        loading={isLoading}
        identifier="lead-extension-requests"
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
