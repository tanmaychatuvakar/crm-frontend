import { Badge } from "@/components/shared";
import { AppDataTable } from "@/components/AppDataTable";
import { useSearchParams } from "react-router-dom";
import { HiPhoneArrowUpRight, HiEnvelope } from "react-icons/hi2";
import { useCallback, useMemo, useState } from "react";
import { useLeadTypeVariant } from "@/utils";
import { Column } from "@/types/column.type";
import {
  useApproveLeadMutation,
  useGetLeadsQuery,
  useRejectLeadMutation,
} from "@/app/services/api";
import { GetLeadPayload } from "@/types/lead.type";

type Payload = GetLeadPayload<{
  contact: true;
  source: true;
  preference: true;
}>;

export const LeadsPendingApproval = () => {
  const [approve] = useApproveLeadMutation();
  const [reject] = useRejectLeadMutation();

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
  });

  const handleApprove = useCallback(async (leadId: string) => {
    try {
      await approve(leadId).unwrap();
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleReject = useCallback(async (leadId: string) => {
    try {
      await reject({ id: leadId, rejectionReason: "" }).unwrap();
    } catch (err) {
      console.error(err);
    }
  }, []);

  const columns: Column<Payload>[] = useMemo(
    () => [
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
      {
        label: "Actions",
        render: (row) => (
          <div className="space-x-3">
            <button
              className="text-sm font-medium text-blue-500 hover:opacity-60 transition-all"
              onClick={() => handleApprove(row.id)}
              disabled={row.status !== "PENDING"}
            >
              Approve
            </button>
            <button
              className="text-sm font-medium text-red-500 hover:opacity-60 transition-all"
              onClick={() => handleReject(row.id)}
              disabled={row.status !== "PENDING"}
            >
              Reject
            </button>
          </div>
        ),
      },
    ],
    []
  );

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
