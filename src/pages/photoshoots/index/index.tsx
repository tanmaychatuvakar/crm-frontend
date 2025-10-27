import { AppTooltip, Badge } from "@/components/shared";
import { AppDataTable } from "@/components/AppDataTable";
import { BadgeVariants } from "@/components/shared/badge/badge.props";
import { useNavigate, useSearchParams } from "react-router-dom";

import { ChangeEvent, useState } from "react";
import { useGetPhotoshootsQuery } from "@/app/services/api";
import { Column } from "@/types/column.type";
import { GetPhotoshootPayload } from "@/types/photoshoot.type";
import { HiExclamationCircle } from "react-icons/hi2";

const statuses = ["ASSIGNED", "UNASSIGNED", "PHOTOS_UPLOADED", "PHOTOS_EDITED"];

type Payload = GetPhotoshootPayload<{
  listings: true;
  photoRequest: true;
  photographer: true;
  editor: true;
}>;

const getVariant = (status: string): BadgeVariants => {
  let variant: BadgeVariants = "info";
  switch (status) {
    case "UNASSIGNED":
      variant = "danger";
      break;
    case "ASSIGNED":
      variant = "info";
      break;
    case "PHOTOS_UPLOADED":
    case "PHOTOS_EDITED":
      variant = "warning";
      break;
    case "DONE":
      variant = "success";
      break;
    default:
      variant = "info";
  }
  return variant;
};

const columns: Column<Payload>[] = [
  {
    label: "Title",
    render: (row) => <span>{row.listings[0].title ?? "-"}</span>,
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
  {
    label: "Rejection Reason",
    render: (row) => (
      <span>
        {row.rejectionReason ? (
          <AppTooltip
            className="w-96"
            trigger={
              <span className="cursor-pointer inline-flex items-center">
                <HiExclamationCircle size={18} className="text-red-700" />
                <Badge className="ml-0.5" variant="danger">
                  Learn More
                </Badge>
              </span>
            }
          >
            <h3 className="text-md font-semibold border-b border-b-slate-50 pb-1 mb-1">
              Rejection Reason
            </h3>
            <p className="font-light text-sm">{row.rejectionReason}</p>
          </AppTooltip>
        ) : (
          "-"
        )}
      </span>
    ),
  },
  {
    label: "Scheduled At",
    render: (row) => <span>{row.photoRequest.scheduledAt ?? "-"}</span>,
  },
  {
    label: "Occupancy",
    render: (row) => <span>{row.photoRequest.occupancy ?? "-"}</span>,
  },
  {
    label: "Key Location",
    render: (row) => <span>{row.photoRequest.keyLocation}</span>,
  },
  {
    label: "Building Access Card Location",
    render: (row) => <span>{row.photoRequest.buildingAccessCardLocation}</span>,
  },
  {
    label: "Parking Access Card Location",
    render: (row) => (
      <span>{row.photoRequest.parkingAccessCardLocation ?? "-"}</span>
    ),
  },
  {
    label: "Broker Present",
    render: ({ photoRequest: { isBrokerPresent } }) => (
      <Badge variant={isBrokerPresent ? "success" : "danger"}>
        {isBrokerPresent ? "YES" : "NO"}
      </Badge>
    ),
  },
  {
    label: "Photographer",
    render: (row) => (
      <span>{row.photographer ? row.photographer.name : "-"}</span>
    ),
  },
  {
    label: "Editor",
    render: (row) => <span>{row.editor ? row.editor.name : "-"}</span>,
  },
];

export const Index = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<string[]>(statuses);

  const handleOnChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const status = value === "ALL" ? statuses : [value];
    setStatus(status);
  };

  const [params, setParams] = useSearchParams({
    page: "1",
    pageSize: "25",
  });

  const { data, isLoading } = useGetPhotoshootsQuery({
    page: params.get("page") ?? undefined,
    pageSize: params.get("pageSize") ?? undefined,
    include: "listings,photoRequest,photographer,editor",
    status,
  });

  return (
    <div>
      <select
        value={status ? status : "ALL"}
        onChange={handleOnChange}
        className="mb-4 rounded-md border-gray-400 text-sm"
      >
        <option value="ALL">All</option>
        <option value="UNASSIGNED">Unassigned</option>
        <option value="ASSIGNED">Assigned</option>
        <option value="PHOTOS_UPLOADED">Photos Uploaded</option>
        <option value="PHOTOS_EDITED">Photos Edited</option>
      </select>

      <AppDataTable
        columns={columns}
        data={data?.data || []}
        loading={isLoading}
        identifier="photoshoots"
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
          navigate(`/photo-requests/${row.photoRequest.id}/show`);
        }}
        filterable
      />
    </div>
  );
};
