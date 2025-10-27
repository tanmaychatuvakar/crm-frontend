import { AppDataTable } from "@/components/AppDataTable";
import { Button } from "@/components/shared";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { getFormattedDate } from "@/utils";
import { MatchLeads } from "@/screens/Leads/MatchLeads";
import { useState } from "react";
import { useGetListingsQuery } from "@/app/services/api";
import { Column } from "@/types/column.type";
import { GetListingPayload } from "@/types/listing.type";

type Payload = GetListingPayload<{
  category: true;
  city: true;
  community: true;
  subcommunity: true;
  property: true;
  agent: true;
  assignee: true;
}>;

const getStatus = (mode: string) => {
  let status: string[] | undefined;
  switch (mode) {
    case "company":
      status = ["PUBLISHED", "PHOTO_REQUEST", "AWAITING_PUBLISH"];
      break;
    case "exclusive":
      status = ["PUBLISHED"];
      break;
    case "draft":
      status = ["DRAFT"];
      break;
    case "unpublished":
      status = ["UNPUBLISHED"];
      break;
    case "archived":
      status = ["ARCHIVED"];
      break;
    case "unpublish-requests":
      status = ["REQUEST_UNPUBLISH"];
      break;
    default:
      status = undefined;
  }
  return status;
};

const getTitle = (mode?: string): string => {
  let title = "";
  switch (mode) {
    case "company":
      title = "Company Listings";
      break;
    case "exclusive":
      title = "Company Exclusive Listings";
      break;
    case "draft":
      title = "Draft Listings";
      break;
    case "unpublished":
      title = "Unpublished Listings";
      break;
    case "archived":
      title = "Archived Listings";
      break;
    case "unpublish-requests":
      title = "Unpublish Requests";
      break;
    default:
      title = "";
  }
  return title;
};

export const Index = () => {
  const { type, section } = useParams();
  const [isMatchLeadsOpen, setIsMatchLeadsOpen] = useState(false);

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
      render: (row) => (
        <span>{row.rentedUntil ? getFormattedDate(row.rentedUntil) : "-"}</span>
      ),
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
      render: (row) => (
        <span>{row.publishedAt ? getFormattedDate(row.publishedAt) : "-"}</span>
      ),
    },

    {
      label: "Updated At",
      render: (row) => (
        <span>{row.updatedAt ? getFormattedDate(row.updatedAt) : "-"}</span>
      ),
    },
    {
      label: "Created At",
      render: (row) => (
        <span>{row.createdAt ? getFormattedDate(row.createdAt) : "-"}</span>
      ),
    },
  ];

  const [q, setQ] = useState("");

  const [params, setParams] = useSearchParams({
    page: "1",
    pageSize: "25",
  });

  const navigate = useNavigate();

  const { data, isLoading } = useGetListingsQuery({
    page: params.get("page") ?? undefined,
    pageSize: params.get("pageSize") ?? undefined,
    status: getStatus(section as string),
    isSale: type === "sale" ? true : undefined,
    isRental: type === "rental" ? true : undefined,
    include: "category,city,community,subcommunity,property,agent,assignee",
    isExclusive: section === "exclusive" ? "true" : undefined,
    search: q,
  });

  return (
    <div className="flex flex-col">
      <div className="flex justify-between mb-12">
        <h1 className="text-2xl font-bold">{getTitle(section)}</h1>
        {section === "draft" && (
          <Button
            variant="secondary"
            onClick={() => navigate(`/my/${type}/listings/create`)}
          >
            Create
          </Button>
        )}
      </div>

      <div>
        <AppDataTable
          columns={defaultColumns}
          data={data?.data || []}
          identifier="draft-listings"
          total={data?.total || 0}
          loading={isLoading}
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
          onRowClick={(row) => {
            navigate(`/my/${type}/listings/${row.id}/show`);
          }}
          filterable
          searchable
        />
      </div>
      <MatchLeads
        open={isMatchLeadsOpen}
        onClose={() => setIsMatchLeadsOpen(false)}
      />
    </div>
  );
};
