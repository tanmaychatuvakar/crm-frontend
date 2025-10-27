import { useState } from "react";
import { Badge } from "@/components/shared";
import { AppDataTable } from "@/components/AppDataTable";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ConfirmCancelDialog } from "@/components/ConfirmCancelPhotoRequestDialog";
import { BadgeVariants } from "@/components/shared/badge/badge.props";
import { useGetPhotoRequestsQuery } from "@/app/services/api";
import { Column } from "@/types/column.type";
import { GetPhotoRequestPayload } from "@/types/photo-request.type";

type Payload = GetPhotoRequestPayload<{ listing: true; photoshoot: true }>;

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

export const PhotoRequests = () => {
  const { type } = useParams();

  const [selectedPhotoRequest, setSelectedPhotoRequest] = useState<any | null>(
    null
  );

  const [dialogOpen, setDialogOpen] = useState(false);

  const columns: Column<Payload>[] = [
    {
      label: "Title",
      render: (row) => <span>{row.listing.title}</span>,
    },

    {
      label: "Ref",
      render: (row) => (
        <span>
          <Link to={row.listing.id}>{row.listing.reference}</Link>
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
      accessor: "parkingAccessCardLocation",
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
    {
      label: "Actions",
      render: (row) => {
        return (
          <>
            {row.status === "PENDING" ? (
              <span>
                <button
                  className="font-medium text-red-500"
                  onClick={() => {
                    setSelectedPhotoRequest(row);
                    setDialogOpen(true);
                  }}
                >
                  Cancel
                </button>
              </span>
            ) : null}
          </>
        );
      },
    },
  ];

  const [q, setQ] = useState("");

  const [params, setParams] = useSearchParams({
    page: "1",
    pageSize: "25",
  });

  const { data, isLoading, refetch } = useGetPhotoRequestsQuery({
    page: params.get("page") ?? undefined,
    pageSize: params.get("pageSize") ?? undefined,
    isSale: type === "sale" ? "true" : undefined,
    isRental: type === "rental" ? "true" : undefined,
    include: "listing,photoshoot",
    search: q,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-12">Photo Requests</h1>
      <div>
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
        <ConfirmCancelDialog
          id={selectedPhotoRequest?.id}
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            refetch();
          }}
          title={selectedPhotoRequest?.title}
        />
      </div>
    </div>
  );
};
