import { AppDialog } from "@/components/shared";
import { Badge } from "@/components/shared";
import { AppDataTable } from "@/components/AppDataTable";
import { useSearchParams } from "react-router-dom";
import { BadgeVariants } from "@/components/shared/badge/badge.props";
import { HiEye } from "react-icons/hi2";
import { RiPriceTagFill } from "react-icons/ri";
import { HiPhoneArrowUpRight, HiEnvelope } from "react-icons/hi2";
import { expirationDate } from "@/utils";
import { Column } from "@/types/column.type";

//Move to constants file
export const STATUS = {
  new: "NEW",
  called: "CALLED",
  contacted: "CONTACTED",
  qualified: "QUALIFIED",
  pending: "PENDING",
  rejected: "REJECTED",
};

export const TYPE = {
  general: "GENERAL",
  listing: "LISTING",
  campaign: "CAMPAIGN",
};

//Move to utils file
export const useLeadStatusVariant = (status: string): BadgeVariants => {
  let statusVariant: BadgeVariants = "info";
  switch (status) {
    case STATUS.new:
      statusVariant = "info";
      break;
    case STATUS.called:
      statusVariant = "bright";
      break;
    case STATUS.rejected:
      statusVariant = "danger";
      break;
    case STATUS.contacted:
      statusVariant = "bright";
      break;
    case STATUS.pending:
      statusVariant = "warning";
      break;
    case STATUS.qualified:
      statusVariant = "success";
      break;
    default:
      statusVariant = "info";
  }
  return statusVariant;
};

export const useLeadTypeVariant = (type: string): BadgeVariants => {
  let typeVariant: BadgeVariants = "info";
  switch (type) {
    case TYPE.general:
      typeVariant = "info";
      break;
    case TYPE.listing:
      typeVariant = "success";
      break;
    case TYPE.campaign:
      typeVariant = "danger";
      break;
    default:
      typeVariant = "info";
  }
  return typeVariant;
};

export const useLeadScoreVariant = (score: number): BadgeVariants => {
  let scoreVariant: BadgeVariants = "info";
  if (score === 100) {
    scoreVariant = "success";
  } else if (score >= 50 && score < 100) {
    scoreVariant = "bright";
  } else if (score < 50 && score >= 0) {
    scoreVariant = "warning";
  } else {
    scoreVariant = "dark";
  }
  return scoreVariant;
};

//Mock interface
export interface Lead {
  id: string;
  reference: string;
  expires: Date;
  score: number;
  contactName: string;
  contactNumber: string;
  contactMail: string;
  type: string;
  listingType: string;
  listingRef: string;
  status: string;
  view: number | null;
  offer: number | null;
  price: string | null;
  campaing: string | null;
}

export const MatchLeads: React.FC<{ onClose: () => void; open: boolean }> = ({
  onClose,
  open,
}) => {
  const columns: Column<any>[] = [
    {
      label: "Reference",
      accessor: "reference",
    },

    {
      label: "Expires",
      render: (row) => <span>{expirationDate(row.expires.toString())}</span>,
    },
    {
      label: "Score",
      render: (row) => (
        <Badge variant={useLeadScoreVariant(row.score)}>{row.score}%</Badge>
      ),
    },
    {
      label: "Contact Name",
      accessor: "contactName",
    },
    {
      label: "Contact Number",
      render: (row) => (
        <span className="flex items-center justify-center space-x-2">
          <HiPhoneArrowUpRight />
          <span>{row.contactNumber}</span>
        </span>
      ),
    },
    {
      label: "Contact Mail",
      render: (row) => (
        <span className="flex items-center justify-center space-x-2">
          <HiEnvelope />
          <span>{row.contactMail}</span>
        </span>
      ),
    },
    {
      label: "Type",
      render: (row) => (
        <Badge variant={useLeadTypeVariant(row.type)}>{row.type}</Badge>
      ),
    },
    {
      label: "Listing Type",
      accessor: "listingType",
    },
    {
      label: "Status",
      render: (row) => (
        <Badge variant={useLeadStatusVariant(row.status)}>{row.status}</Badge>
      ),
    },
    {
      label: "View",
      render: (row) => (
        <Badge variant={row.view ? "bright" : "dark"} icon={<HiEye />}>
          {row.view}
        </Badge>
      ),
    },
    {
      label: "Offer",
      render: (row) => (
        <Badge
          variant={row.offer ? "bright" : "dark"}
          icon={<RiPriceTagFill />}
        >
          {row.offer}
        </Badge>
      ),
    },
    {
      label: "Price",
      accessor: "price",
    },
    {
      label: "Campaing",
      accessor: "campaing",
    },
  ];

  const [params, setParams] = useSearchParams({
    page: "1",
    pageSize: "25",
  });

  const data = { total: 0, data: [] };

  return (
    <AppDialog onClose={onClose} open={open}>
      <AppDialog.Title>Matched Leads</AppDialog.Title>
      <AppDialog.Description>
        All list of all the leads that match your budget and location
      </AppDialog.Description>
      <div className="mt-10">
        <AppDataTable
          columns={columns}
          data={data?.data ?? []}
          identifier="match-leads"
          total={data?.total ?? 0}
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
    </AppDialog>
  );
};
