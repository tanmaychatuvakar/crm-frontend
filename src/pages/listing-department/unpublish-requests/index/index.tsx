import { ChangeEvent, useState } from "react";
import { Badge } from "@/components/shared";
import { AppDataTable } from "@/components/AppDataTable";
import { BadgeVariants } from "@/components/shared/badge/badge.props";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetUnpublishRequestsQuery } from "@/app/services/api";
import { Column } from "@/types/column.type";
import { GetUnpublishRequestPayload } from "@/types/unpublish-request.type";

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
    case "CANCELED":
      variant = "dark";
      break;
    default:
      variant = "info";
  }
  return variant;
};

const statuses = ["PENDING", "APPROVED", "REJECTED"];

type Payload = GetUnpublishRequestPayload<{
  listing: true;
}>;

export const Index = () => {
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
    { label: "Comments", accessor: "comments" },
  ];

  const navigate = useNavigate();

  const [status, setStatus] = useState<string[]>(statuses);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const status = value === "ALL" ? statuses : [value];
    setStatus(status);
  };

  const [params, setParams] = useSearchParams({
    page: "1",
    pageSize: "25",
  });

  const { data, isLoading } = useGetUnpublishRequestsQuery({
    status,
    page: params.get("page") ?? undefined,
    pageSize: params.get("pageSize") ?? undefined,
    include: "listing",
  });

  return (
    <div>
      <select
        value={status ? status : "ALL"}
        onChange={handleChange}
        className="mb-4 rounded-md border-gray-400 text-sm"
      >
        <option value="ALL">All</option>
        <option value="PENDING">Pending</option>
        <option value="APPROVED">Approved</option>
        <option value="REJECTED">Rejected</option>
      </select>

      <AppDataTable
        columns={columns}
        data={data?.data || []}
        loading={isLoading}
        identifier="unpublish-requests"
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
        onRowClick={(row) => navigate(`/unpublish-requests/${row.id}/show`)}
        filterable
      />
    </div>
  );
};
