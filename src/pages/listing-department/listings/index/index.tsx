import { Badge } from "@/components/shared";
import { AppDataTable } from "@/components/AppDataTable";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useGetListingsQuery } from "@/app/services/api";
import { Column } from "@/types/column.type";
import { GetListingPayload } from "@/types/listing.type";

type Payload = GetListingPayload<{
  category: true;
  agent: true;
  assignee: true;
  city: true;
  community: true;
  subcommunity: true;
  property: true;
}>;

const getStatus = (mode: string) => {
  let status: string[] | undefined;
  switch (mode) {
    case "company":
      status = ["PUBLISHED", "PHOTO_REQUEST", "AWAITING_PUBLISH"];
      break;
    case "publish-requests":
      status = ["AWAITING_PUBLISH"];
      break;
    default:
      status = undefined;
  }
  return status;
};

const defaultColumns: Column<Payload>[] = [
  {
    label: "Title",
    accessor: "title",
  },

  {
    label: "Reference",
    accessor: "reference",
  },

  {
    label: "PF Ref",
    accessor: "tbd",
  },
  {
    label: "Unit",
    accessor: "unitNumber",
  },
  {
    label: "Category",
    render: (row) => <span>{row.category?.name || "-"}</span>,
  },
  {
    label: "City",
    render: (row) => <span>{row.city?.name || "-"}</span>,
  },
  {
    label: "Community",
    render: (row) => <span>{row.community?.name || "-"}</span>,
  },
  {
    label: "Subcommunity",
    render: (row) => <span>{row.subcommunity?.name || "-"}</span>,
  },
  {
    label: "Property",
    render: (row) => <span>{row.property?.name || "-"}</span>,
  },
  {
    label: "Price",
    accessor: "salePrice",
  },
  {
    label: "Rental Price",
    accessor: "rentalPrice",
  },
  {
    label: "Rented Until",
    accessor: "rentedUntil",
  },
  {
    label: "Trakheesi",
    accessor: "trakheesi",
  },
  {
    label: "View",
    accessor: "view",
  },
  {
    label: "Assigned To",
    render: (row) => <span>{row.assignee?.name || "-"}</span>,
  },
  {
    label: "Published At",
    render: ({ publishedAt }) => (
      <span>{publishedAt ? publishedAt.split("T")[0] : "-"}</span>
    ),
  },

  {
    label: "Updated At",
    render: ({ updatedAt }) => (
      <span>{updatedAt ? updatedAt.split("T")[0] : "-"}</span>
    ),
  },
  {
    label: "Created At",
    render: ({ createdAt }) => (
      <span>{createdAt ? createdAt.split("T")[0] : "-"}</span>
    ),
  },
];

const companyListingsColumns: Column<Payload>[] = [
  {
    label: "Title",
    accessor: "title",
  },

  {
    label: "Status",
    render: (row) => (
      <span>
        {row.status === "PUBLISHED" ? (
          <Badge variant="success">PUBLISHED</Badge>
        ) : (
          <Badge variant="warning">PENDING</Badge>
        )}
      </span>
    ),
  },

  {
    label: "Reference",
    accessor: "reference",
  },

  {
    label: "PF Ref",
    accessor: "tbd",
  },
  {
    label: "Unit",
    accessor: "unitNumber",
  },
  {
    label: "Category",
    render: (row) => <span>{row.category?.name || "-"}</span>,
  },
  {
    label: "City",
    render: (row) => <span>{row.city?.name || "-"}</span>,
  },
  {
    label: "Community",
    render: (row) => <span>{row.community?.name || "-"}</span>,
  },
  {
    label: "Subcommunity",
    render: (row) => <span>{row.subcommunity?.name || "-"}</span>,
  },
  {
    label: "Property",
    render: (row) => <span>{row.property?.name || "-"}</span>,
  },
  {
    label: "Price",
    accessor: "salePrice",
  },
  {
    label: "Rental Price",
    accessor: "rentalPrice",
  },
  {
    label: "Rented Until",
    accessor: "rentedUntil",
  },
  {
    label: "Trakheesi",
    accessor: "trakheesi",
  },
  {
    label: "View",
    accessor: "view",
  },
  {
    label: "Agent",
    render: (row) => <span>{row.agent?.name || "-"}</span>,
  },
  {
    label: "Assigned To",
    render: (row) => <span>{row.assignee?.name || "-"}</span>,
  },
  {
    label: "Published At",
    render: ({ publishedAt }) => (
      <span>{publishedAt ? publishedAt.split("T")[0] : "-"}</span>
    ),
  },

  {
    label: "Updated At",
    render: ({ updatedAt }) => (
      <span>{updatedAt ? updatedAt.split("T")[0] : "-"}</span>
    ),
  },
  {
    label: "Created At",
    render: ({ createdAt }) => (
      <span>{createdAt ? createdAt.split("T")[0] : "-"}</span>
    ),
  },
];

export const Index = () => {
  const { type: mode = "" } = useParams();
  const columns = mode !== "company" ? defaultColumns : companyListingsColumns;

  const [params, setParams] = useSearchParams({
    page: "1",
    pageSize: "25",
  });

  const navigate = useNavigate();

  const { data, isLoading } = useGetListingsQuery(
    {
      page: params.get("page") ?? undefined,
      pageSize: params.get("pageSize") ?? undefined,
      status: getStatus(mode),
      include: "category,agent,assignee,city,community,subcommunity,property",
    },
    { refetchOnFocus: true }
  );

  return (
    <div>
      <AppDataTable
        columns={columns}
        data={data?.data || []}
        identifier={mode}
        total={data?.total || 0}
        loading={isLoading}
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
        onRowClick={(row) => {
          navigate(`/listings/${row.id}/show`);
        }}
        filterable
      />
    </div>
  );
};
