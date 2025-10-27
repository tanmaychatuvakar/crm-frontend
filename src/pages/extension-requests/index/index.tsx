import { useState } from "react";
import { AppSelect, Badge } from "@/components/shared";
import { AppDataTable } from "@/components/AppDataTable";
import { BadgeVariants } from "@/components/shared/badge/badge.props";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetExtensionRequestsQuery } from "@/app/services/api";
import { Column } from "@/types/column.type";
import { GetExtensionRequestPayload } from "@/types/extension-request.type";

type Payload = GetExtensionRequestPayload<{ listing: true }>;

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

const columns: Column<Payload>[] = [
  {
    label: "Listing Title",
    render: (row) => <span>{row.listing.title}</span>,
  },
  {
    label: "Status",
    render: (row) => (
      <span>
        <Badge variant={getVariant(row.status)}>{row.status}</Badge>
      </span>
    ),
  },
  { label: "Rejection Reason", accessor: "rejectionReason" },
  {
    label: "From Date",
    render: (row) => (
      <span>{row.fromDate ? row.fromDate.split("T")[0] : "-"}</span>
    ),
  },
  {
    label: "To Date",
    render: (row) => <span>{row.toDate ? row.toDate.split("T")[0] : "-"}</span>,
  },
  { label: "Comments", accessor: "comments" },
];

export const Index = () => {
  const navigate = useNavigate();

  const [status, setStatus] = useState("ALL");

  const [params, setParams] = useSearchParams({
    page: "1",
    pageSize: "25",
  });

  const { data, isLoading } = useGetExtensionRequestsQuery({
    page: params.get("page") ?? undefined,
    pageSize: params.get("pageSize") ?? undefined,
    include: "listing",
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-12">Extension Requests</h1>
      <div className="flex justify-end mb-6">
        <div className="w-48">
          <AppSelect
            onChange={(status) => {
              setStatus(status ?? "ALL");
            }}
            placeholder="Status"
            label="Status"
            options={[
              { label: "All", value: "ALL" },
              { label: "Pending", value: "PENDING" },
              { label: "Approved", value: "APPROVED" },
              { label: "Rejected", value: "REJECTED" },
              { label: "Canceled", value: "CANCELED" },
            ]}
            value={status}
          />
        </div>
      </div>

      <AppDataTable
        columns={columns}
        data={data?.data || []}
        loading={isLoading}
        identifier="extension-requests"
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
        onRowClick={(row) =>
          navigate(`/listings/extension-requests/${row.id}/show`)
        }
        filterable
      />
    </div>
  );
};
