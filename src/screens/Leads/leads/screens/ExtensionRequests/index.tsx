import { Badge } from "@/components/shared";
import { AppDataTable } from "@/components/AppDataTable";
import { useSearchParams } from "react-router-dom";

import { HiEnvelope, HiPhoneArrowUpRight } from "react-icons/hi2";

import { Column } from "@/types/column.type";
import {
  useApproveLeadExtensionRequestMutation,
  useGetLeadExtensionRequestsQuery,
  useRejectLeadExtensionRequestMutation,
} from "@/app/services/api";
import { getFormattedDate } from "@/utils";
import { useState } from "react";

export const ExtensionRequests = () => {
  const [approve] = useApproveLeadExtensionRequestMutation();
  const [reject] = useRejectLeadExtensionRequestMutation();

  const [params, setParams] = useSearchParams({
    page: "1",
    pageSize: "25",
  });

  const [q, setQ] = useState("");

  const { data } = useGetLeadExtensionRequestsQuery({
    page: params.get("page") ?? undefined,
    pageSize: params.get("pageSize") ?? undefined,
    include: "lead",
    search: q,
  });

  const handleApprove = (requestId: string) => async () => {
    try {
      await approve(requestId).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = (requestId: string) => async () => {
    try {
      await reject(requestId).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const columns: Column<any>[] = [
    {
      label: "Contact",
      render: (row) => (
        <span>
          {row.lead.contactTitle} {row.lead.contactName}
        </span>
      ),
    },
    {
      label: "Status",
      render: (row) => (
        <span>
          //! Get variant here
          <Badge>{row.status}</Badge>
        </span>
      ),
    },
    {
      label: "Until",
      render: (row) => <span>{getFormattedDate(row.until)}</span>,
    },
    {
      label: "Reason",
      render: (row) => <span>{row.reason}</span>,
    },
    {
      label: "Mobile Number",
      render: (row) => (
        <span className="flex items-center space-x-2">
          <HiPhoneArrowUpRight />
          <span>{row.lead.contactMobileNumber}</span>
        </span>
      ),
    },
    {
      label: "Contact Mail",
      render: (row) => (
        <span className="flex items-center space-x-2">
          <HiEnvelope />
          <span>{row.lead.contactEmail}</span>
        </span>
      ),
    },
    {
      label: "City",
      render: (row) => <span>{row.lead.cityId}</span>,
    },
    {
      label: "Category",
      render: (row) => <span>{row.lead.categoryId}</span>,
    },
    {
      label: "Actions",
      render: (row) => {
        return (
          <span className="flex items-center gap-2">
            <button
              className="font-medium text-blue-500"
              onClick={handleApprove(row.id)}
            >
              Approve
            </button>
            <button
              className="font-medium text-red-500"
              onClick={handleReject(row.id)}
            >
              Reject
            </button>
          </span>
        );
      },
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-12">Extension Requests</h1>
      <AppDataTable
        columns={columns}
        data={data?.data || []}
        total={data?.total || 0}
        identifier="leads-extension-requests"
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
