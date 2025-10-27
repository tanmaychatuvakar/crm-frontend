import { Badge } from "@/components/shared";
import { AppDataTable } from "@/components/AppDataTable";
import { BadgeVariants } from "@/components/shared/badge/badge.props";
import { useSearchParams } from "react-router-dom";
import { useGetLeadExtensionRequestsQuery } from "@/app/services/api";
import { Column } from "@/types/column.type";

type Payload = {
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

const columns: Column<Payload>[] = [
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
];

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
