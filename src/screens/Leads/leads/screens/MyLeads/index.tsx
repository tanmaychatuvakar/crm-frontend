import { Badge, Button } from "@/components/shared";

import { AppDataTable } from "@/components/AppDataTable";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLeadStatusVariant, useLeadTypeVariant } from "@/utils";
import { useState } from "react";

import LeadViewDialog from "@/components/Leads/LeadFlow";
import { Column } from "@/types/column.type";

import {
  HiEye,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiTag,
} from "react-icons/hi2";
import { useGetLeadsQuery } from "@/app/services/api";
import { GetLeadPayload } from "@/types/lead.type";

export const MyLeads = () => {
  const navigate = useNavigate();

  const columns: Column<
    GetLeadPayload<{
      contact: true;
      preference: true;
      listing: true;
      _count: true;
    }>
  >[] = [
    {
      label: "Contact Name",
      render: ({ contact }) => (
        <p>
          {contact.title} {contact.name}
        </p>
      ),
    },
    {
      label: "Contact Number",
      render: (row) => (
        <span className="inline-flex items-center space-x-2">
          <HiOutlinePhone />
          <span>{row.contact.mobileNumber}</span>
        </span>
      ),
    },
    {
      label: "Contact Mail",
      render: (row) => (
        <span className="inline-flex items-center space-x-2">
          <HiOutlineEnvelope />
          <span>{row.contact.email}</span>
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
      render: ({ listing }) => {
        if (!listing) {
          return <p>-</p>;
        }
        return <p>{listing.isSale ? "Sale" : "Rental"}</p>;
      },
    },
    {
      label: "Listing Ref",
      render: ({ listing }) => <p>{listing?.reference || "-"}</p>,
    },
    {
      label: "Status",
      render: (row) => (
        <Badge variant={useLeadStatusVariant(row.status)}>{row.status}</Badge>
      ),
    },
    {
      label: "View & Offer",
      render: ({ _count: { viewings, offers } }) => (
        <div className="inline-flex gap-2">
          <Badge icon={<HiEye />} variant={viewings > 0 ? "warning" : "info"}>
            {viewings}
          </Badge>
          <Badge icon={<HiTag />} variant={offers > 0 ? "warning" : "info"}>
            {offers}
          </Badge>
        </div>
      ),
    },
    {
      label: "Price",
      render: ({ preference }) => (
        <p>
          {preference.minPrice} - {preference.maxPrice}
        </p>
      ),
    },
    {
      label: "Bedrooms",
      render: ({ preference }) => (
        <p>
          {preference.minBedrooms}-{preference.maxBedrooms} Bedrooms
        </p>
      ),
    },
  ];

  const [selectedLead, setSelectedLead] = useState(null);
  const [isLeadDialogOpen, setLeadDialogOpen] = useState(false);

  const [q, setQ] = useState("");
  // const [status, setStatus] = useState("ALL");

  const [params, setParams] = useSearchParams({
    page: "1",
    pageSize: "25",
  });

  const { data } = useGetLeadsQuery({
    page: params.get("page") ?? undefined,
    pageSize: params.get("pageSize") ?? undefined,
    include: "contact,preference,listing,count",
    search: q,
    status: ["NEW", "CALLED", "CONTACTED", "QUALIFIED"],
  });

  return (
    <div>
      <div className="flex justify-between mb-12">
        <h1 className="text-2xl font-bold">My Leads</h1>
        <Button
          variant="secondary"
          onClick={() => {
            navigate("/my/leads/create");
          }}
        >
          Create Lead
        </Button>
      </div>

      {/* 
        <div className="flex w-full justify-end space-x-2 mb-6">
          <div className="w-48">
            <AppSelect
              onChange={(e: string) => setStatus(e)}
              options={[
                { label: "All", value: "ALL" },
                { label: "Pending", value: "PENDING" },
                { label: "Approved", value: "APPROVED" },
                { label: "Rejected", value: "REJECTED" },
                { label: "Canceled", value: "CANCELED" },
              ]}
              value={status}
            ></AppSelect>
          </div>
        </div> */}

      <AppDataTable
        columns={columns}
        data={data?.data || []}
        identifier="my-leads"
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
        onRowClick={(row) => {
          setLeadDialogOpen(true);
          setSelectedLead(row.id);
        }}
        searchable
      />

      {selectedLead && (
        <LeadViewDialog
          leadId={selectedLead}
          open={isLeadDialogOpen}
          onClose={() => setLeadDialogOpen(false)}
        />
      )}
    </div>
  );
};
