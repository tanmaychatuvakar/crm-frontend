import { useState } from "react";

import { Badge } from "@/components/shared";
import { AppDataTable } from "@/components/AppDataTable";
import { BadgeVariants } from "@/components/shared/badge/badge.props";
import { useParams, useSearchParams } from "react-router-dom";
import { ConfirmCancelUnpublishDialog } from "@/components/ConfirmCancelUnpublishDialog";
import { useGetUnpublishRequestsQuery } from "@/app/services/api";
import { Column } from "@/types/column.type";
import { GetUnpublishRequestPayload } from "@/types/unpublish-request.type";

type Payload = GetUnpublishRequestPayload<{
  listing: true;
}>;

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

export const UnpublishRequests = () => {
  const { type } = useParams();

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
    {
      label: "Actions",
      render: (row) => {
        if (row.status !== "PENDING") {
          return <></>;
        }
        return (
          <span>
            <button
              className="text-red-500 font-medium"
              onClick={() => {
                setSelectedUnpublishRequest(row);
                setDialogOpen(true);
              }}
            >
              Cancel
            </button>
          </span>
        );
      },
    },
  ];

  const [selectedUnpublishRequest, setSelectedUnpublishRequest] = useState<
    any | null
  >(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [q, setQ] = useState("");
  // const [status, setStatus] = useState("ALL");

  const [params, setParams] = useSearchParams({
    page: "1",
    pageSize: "25",
  });

  const { data, isLoading, refetch } = useGetUnpublishRequestsQuery({
    page: params.get("page") ?? undefined,
    pageSize: params.get("pageSize") ?? undefined,
    isSale: type === "sale" ? "true" : undefined,
    isRental: type === "rental" ? "true" : undefined,
    include: "listing",
    search: q,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-12">Unpublish Requests</h1>
      <AppDataTable
        columns={columns}
        data={data?.data || []}
        identifier="waiting-unpublish"
        loading={isLoading}
        total={data?.total || 0}
        defaultPaginationValue={{
          currentPage: +params.get("page")!,
          pageSize: +params.get("pageSize")!,
        }}
        defaultSearchValue={q}
        onPaginationChange={(state) => {
          setParams({
            page: state.currentPage.toString(),
            pageSize: state.pageSize.toString(),
          });
        }}
        onSearchChange={(q: string) => setQ(q)}
        filterable
        searchable
      />
      <ConfirmCancelUnpublishDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          refetch();
        }}
        id={selectedUnpublishRequest?.id}
        title={selectedUnpublishRequest?.title}
        onSuccess={() => {
          refetch();
        }}
      />
    </div>
  );
};
