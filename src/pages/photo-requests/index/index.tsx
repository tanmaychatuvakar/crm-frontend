import { ChangeEvent, useState } from "react";

import { Badge } from "@/components/shared";
import { AppDataTable } from "@/components/AppDataTable";
import { BadgeVariants } from "@/components/shared/badge/badge.props";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { useGetPhotoRequestsQuery } from "@/app/services/api";
import { Column } from "@/types/column.type";
import { GetPhotoRequestPayload } from "@/types/photo-request.type";

const statuses = ["PENDING", "APPROVED", "REJECTED"];

type Payload = GetPhotoRequestPayload<{
  listing: true;
  photoshoot: true;
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

export const Index = () => {
  const navigate = useNavigate();

  const columns: Column<Payload>[] = [
    {
      label: "Title",
      render: (row) => <span>{row.listing.title}</span>,
    },

    {
      label: "Ref",
      render: (row) => (
        <span>
          <Link to={`draft-listings/${row.listing.id}`}>
            {row.listing.reference}
          </Link>
        </span>
      ),
    },
    {
      label: "Status",
      render: (row) => (
        <span>
          <Badge variant={getVariant(row.status)}>
            {row.status.replace("_", " ")}
          </Badge>
        </span>
      ),
    },
    { label: "Rejection Reason", accessor: "rejectionReason" },

    {
      label: "Scheduled At",
      render: ({ scheduledAt }) => (
        <span>{scheduledAt ? scheduledAt.split("T")[0] : "-"}</span>
      ),
    },
    {
      label: "Occupancy",
      accessor: "occupancy",
    },
    {
      label: "Key Location",
      accessor: "keyLocation",
    },
    {
      label: "Building Access Card Location",
      accessor: "buildingAccessCardLocation",
    },
    {
      label: "Parking Access Card Location",
      render: (row) => <span>{row.parkingAccessCardLocation ?? "-"}</span>,
    },
    {
      label: "Comments",
      accessor: "comments",
    },
    {
      label: "Broker Present",
      render: (row) => <span>{row.isBrokerPresent ? "YES" : "NO"}</span>,
    },
    {
      label: "Photographer",
      render: (row) => (
        <span>{row.photoshoot ? row.photoshoot.photographer?.name : "-"}</span>
      ),
    },
    {
      label: "Editor",
      render: (row) => (
        <span>{row.photoshoot ? row.photoshoot.editor?.name : "-"}</span>
      ),
    },
  ];

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

  const { data, isLoading } = useGetPhotoRequestsQuery({
    page: params.get("page") ?? undefined,
    pageSize: params.get("pageSize") ?? undefined,
    include: "listing",
    status,
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
        identifier="photo-requests"
        loading={isLoading}
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
        onRowClick={(row) => {
          navigate(`${row.id}/show`);
        }}
        filterable
      />
    </div>
  );
};
