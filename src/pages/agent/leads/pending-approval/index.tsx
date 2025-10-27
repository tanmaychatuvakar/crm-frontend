import { Badge } from "@/components/shared";
import { AppDataTable } from "@/components/AppDataTable";
import { useSearchParams } from "react-router-dom";
import { HiPhoneArrowUpRight, HiEnvelope } from "react-icons/hi2";
import { useState } from "react";
import { useLeadStatusVariant, useLeadTypeVariant } from "@/utils";
import { Column } from "@/types/column.type";
import { useGetLeadsQuery } from "@/app/services/api";
import { GetLeadPayload } from "@/types/lead.type";

export const PendingApproval = () => {
  const [q, setQ] = useState("");
  const [params, setParams] = useSearchParams({
    page: "1",
    pageSize: "25",
  });

  const { data } = useGetLeadsQuery({
    page: params.get("page") ?? undefined,
    pageSize: params.get("pageSize") ?? undefined,
    search: q,
    include: "contact,source,preference",
    status: ["PENDING", "REJECTED"],
  });

  const columns: Column<
    GetLeadPayload<{ contact: true; source: true; preference: true }>
  >[] = [
    {
      label: "Source",
      render: (row) => <span>{row.source?.name}</span>,
    },
    {
      label: "Lead Type",
      render: (row) => (
        <Badge variant={useLeadTypeVariant(row.type)}>{row.type}</Badge>
      ),
    },
    {
      label: "Status",
      render: (row) => (
        <Badge variant={useLeadStatusVariant(row.status)}>{row.status}</Badge>
      ),
    },
    {
      label: "Contact Name",
      render: (row) => <span>{row.contact.name}</span>,
    },
    {
      label: "Mobile Number",
      render: (row) => (
        <span className="flex items-center space-x-2">
          <HiPhoneArrowUpRight />
          <span>{row.contact.mobileNumber}</span>
        </span>
      ),
    },
    {
      label: "Contact Mail",
      render: (row) => (
        <span className="flex items-center space-x-2">
          <HiEnvelope />
          <span>{row.contact.email}</span>
        </span>
      ),
    },
    {
      label: "City",
      render: (row) => <span>{row.preference.city.name}</span>,
    },
    {
      label: "Category",
      render: (row) => <span>{row.preference.category.name}</span>,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-12">Leads Pending Approval</h1>
      <AppDataTable
        columns={columns}
        data={data?.data || []}
        identifier="leads-pending-approval"
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
