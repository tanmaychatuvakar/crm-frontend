import { useState } from "react";

import { Badge } from "@/components/shared";
import { AppDataTable } from "@/components/AppDataTable";
import { BadgeVariants } from "@/components/shared/badge/badge.props";
import { useParams, useSearchParams } from "react-router-dom";
import { useGetExtensionRequestsQuery } from "@/app/services/api";
import { Column } from "@/types/column.type";
import { GetExtensionRequestPayload } from "@/types/extension-request.type";

type Payload = GetExtensionRequestPayload<{}>;

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
  const { type } = useParams();
  const columns: Column<Payload>[] = [
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
      label: "From Date",
      render: ({ fromDate }) => (
        <span>{fromDate ? fromDate.split("T")[0] : "-"}</span>
      ),
    },
    {
      label: "To Date",
      render: ({ toDate }) => (
        <span>{toDate ? toDate.split("T")[0] : "-"}</span>
      ),
    },
  ];

  const [q, setQ] = useState("");
  // const [status, setStatus] = useState("ALL");

  const [params, setParams] = useSearchParams({
    page: "1",
    pageSize: "25",
  });

  const { data, isLoading } = useGetExtensionRequestsQuery({
    page: params.get("page") ?? undefined,
    pageSize: params.get("pageSize") ?? undefined,
    isSale: type === "sale" ? "true" : undefined,
    isRental: type === "rental" ? "true" : undefined,
    search: q,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-12">Extension Requests</h1>
      <AppDataTable
        columns={columns}
        data={data?.data || []}
        identifier="waiting-extension"
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
    </div>
  );
};
