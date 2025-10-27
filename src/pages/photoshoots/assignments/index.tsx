import { useState } from "react";
import { AppDataTable } from "@/components/AppDataTable";
import { AppTooltip, Badge } from "@/components/shared";
import { BadgeVariants } from "@/components/shared/badge/badge.props";
import { Roles } from "@/constants/roles";
import { useSearchParams } from "react-router-dom";
import { UploadPhotosDialog } from "@/components/UploadPhotosDialog";
import { useGetPhotoshootsQuery } from "@/app/services/api";
import { GetPhotoshootPayload, Photoshoot } from "@/types/photoshoot.type";
import { Column } from "@/types/column.type";
import { useAppSelector } from "@/hooks/useAppSelector";
import { HiExclamationCircle } from "react-icons/hi2";

type Payload = GetPhotoshootPayload<{
  listings: true;
  photoRequest: true;
  photographer: true;
  photographerImages: true;
  editor: true;
  editorImages: true;
}>;

const getVariant = (status: string): BadgeVariants => {
  let variant: BadgeVariants = "info";
  switch (status) {
    case "ASSIGNED":
      variant = "info";
      break;
    case "PHOTOS_UPLOADED":
      variant = "warning";
      break;
    default:
      variant = "info";
  }
  return variant;
};

const Assignments = () => {
  const role = useAppSelector((state) => state.auth.user!.role);
  const [mode, setMode] = useState("preview");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedPhotoshoot, setSelectedPhotoshoot] =
    useState<Photoshoot | null>(null);

  const [params, setParams] = useSearchParams({
    page: "1",
    pageSize: "25",
  });

  const { data, isLoading, refetch } = useGetPhotoshootsQuery({
    page: params.get("page") ?? undefined,
    pageSize: params.get("pageSize") ?? undefined,
    status: role === Roles.PHOTOGRAPHER ? ["ASSIGNED"] : ["PHOTOS_UPLOADED"],
    include:
      "listings,photoRequest,photographerImages,editorImages,photographer,editor",
  });

  const columns: Column<Payload>[] = [
    {
      label: "Title",
      render: (row) => <span>{row.listings[0].title}</span>,
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
      render: (row) => (
        <span>{row.photoRequest.buildingAccessCardLocation}</span>
      ),
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
    {
      label: "Actions",
      render: (row) => {
        return (
          <div className="flex justify-center items-center gap-2">
            <button
              className="text-sm font-medium text-blue-500"
              onClick={() => {
                setMode("create");
                setSelectedPhotoshoot(row);
                setUploadDialogOpen(true);
              }}
            >
              Upload
            </button>
            <button
              className="text-sm font-medium text-blue-500"
              onClick={() => {
                setMode("submit");
                setSelectedPhotoshoot(row);
                setUploadDialogOpen(true);
              }}
            >
              Submit
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-12">Assignments</h1>
      <div className="flex flex-col gap-4">
        <AppDataTable
          columns={columns}
          data={data?.data || []}
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
          identifier="assignments"
          filterable
        />
        <UploadPhotosDialog
          open={uploadDialogOpen}
          onClose={() => {
            setUploadDialogOpen(false);
            refetch();
          }}
          mode={mode}
          data={selectedPhotoshoot}
        />
      </div>
    </div>
  );
};

export default Assignments;
