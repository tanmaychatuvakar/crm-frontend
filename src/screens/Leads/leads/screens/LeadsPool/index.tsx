import { useCallback, useState } from "react";
import { Badge, Button } from "@/components/shared";
import { AppDataTable } from "@/components/AppDataTable";
import { useSearchParams } from "react-router-dom";
import {
  HiEye,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiTag,
} from "react-icons/hi2";
import { useLeadStatusVariant, useLeadTypeVariant } from "@/utils";

import { Column } from "@/types/column.type";
import { GetLeadPayload } from "@/types/lead.type";
import {
  useGetLeadsPoolQuery,
  usePickUpLeadMutation,
} from "@/app/services/api";

export const LeadsPool = () => {
  const [mutate, { isLoading }] = usePickUpLeadMutation();

  const handleOnPickUp = useCallback(async (leadId: string) => {
    try {
      await mutate(leadId).unwrap();
    } catch (err) {
      console.error(err);
    }
  }, []);

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
    {
      label: "Actions",
      render: (row) => (
        <Button
          isLoading={isLoading}
          size="sm"
          onClick={() => handleOnPickUp(row.id)}
        >
          Pick Up
        </Button>
      ),
    },
  ];

  const [q, setQ] = useState("");

  const [params, setParams] = useSearchParams({
    page: "1",
    pageSize: "25",
  });

  const { data } = useGetLeadsPoolQuery({
    page: params.get("page") ?? undefined,
    pageSize: params.get("pageSize") ?? undefined,
    include: "contact,preference,listing,count",
    search: q,
  });

  return (
    <div>
      <div className="flex justify-between mb-12">
        <h1 className="text-2xl font-bold">Leads Pool</h1>
      </div>

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
        searchable
      />
    </div>
  );
};
