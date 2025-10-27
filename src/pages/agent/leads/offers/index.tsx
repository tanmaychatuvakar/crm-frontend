import { AppDataTable } from "@/components/AppDataTable";
import { useSearchParams } from "react-router-dom";

import { useState } from "react";

import { Column } from "@/types/column.type";
import { ReusableSidebar } from "@/components/ReusableSideBar";
import { Navbar } from "@/components/Navbar";
import { useGetOffersQuery } from "@/app/services/api";
import { GetOfferPayload } from "@/types/offer.type";
// import { useGetOffersQuery } from "@/app/services/api";

const sections = [
  {
    title: "Offers",
    links: [
      {
        label: "Offers",
        path: "/my/offers",
      },
    ],
  },
];

const OffersLayout: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div>
      <ReusableSidebar sections={sections} />
      <div className="ml-64 px-8 py-4">
        <Navbar />
        <main>{children}</main>
      </div>
    </div>
  );
};

const Offers = () => {
  const columns: Column<GetOfferPayload<{ lead: true }>>[] = [
    {
      label: "Offer Ref",
      render: (row) => <span>{row.reference}</span>,
    },
    {
      label: "Lead Ref",
      render: (row) => <span>{row.lead.reference}</span>,
    },
    {
      label: "Listing Ref",
      render: (row) => <span>{row.lead.listing?.reference}</span>,
    },
    {
      label: "City",
      render: (row) => <span>{row.lead.listing?.city?.name}</span>,
    },
    {
      label: "Community",
      render: (row) => <span>{row.lead.listing?.community?.name}</span>,
    },
    {
      label: "Sub Community",
      render: (row) => (
        <span>{row.lead.listing?.subcommunity?.name ?? "-"}</span>
      ),
    },
    {
      label: "Property",
      render: (row) => <span>{row.lead.listing?.property?.name ?? "-"}</span>,
    },
  ];

  const [q, setQ] = useState("");

  const [params, setParams] = useSearchParams({
    page: "1",
    pageSize: "25",
  });

  const { data } = useGetOffersQuery({
    page: params.get("page") ?? undefined,
    pageSize: params.get("pageSize") ?? undefined,
    search: q,
    include: "lead",
  });

  return (
    <OffersLayout>
      <h1 className="text-2xl font-bold mb-12">Offers</h1>
      <AppDataTable
        columns={columns}
        data={data?.data || []}
        identifier="viewings"
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
    </OffersLayout>
  );
};

export default Offers;
