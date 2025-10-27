import { AppDataTable } from "@/components/AppDataTable";
import { useSearchParams } from "react-router-dom";

import { useState } from "react";

import { Column } from "@/types/column.type";
import { ReusableSidebar } from "@/components/ReusableSideBar";
import { Navbar } from "@/components/Navbar";
import { useGetViewingsQuery } from "@/app/services/api";
import { GetViewingPayload } from "@/types/viewing.type";
// import { useGetViewingsQuery } from "@/app/services/api";

const sections = [
  {
    title: "Viewings",
    links: [
      {
        label: "Viewings",
        path: "/my/viewings",
      },
    ],
  },
];

const ViewingsLayout: React.FC<{ children?: React.ReactNode }> = ({
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

const Viewings = () => {
  const columns: Column<
    GetViewingPayload<{
      lead: true;
      listing: true;
    }>
  >[] = [
    {
      label: "Listing Ref",
      render: (row) => <span>{row.listing.reference}</span>,
    },
    {
      label: "Lead Ref",
      render: (row) => <span>{row.lead.reference}</span>,
    },
    {
      label: "Location",
      render: (row) => <span>{row.listing.city?.name}</span>,
    },
    {
      label: "Community",
      render: (row) => <span>{row.listing.community?.name}</span>,
    },
    {
      label: "Sub Community",
      render: (row) => <span>{row.listing.subcommunity?.name ?? "-"}</span>,
    },
    {
      label: "Property",
      render: (row) => <span>{row.listing.property?.name ?? "-"}</span>,
    },
  ];

  const [q, setQ] = useState("");

  const [params, setParams] = useSearchParams({
    page: "1",
    pageSize: "25",
  });

  const { data } = useGetViewingsQuery({
    page: params.get("page") ?? undefined,
    pageSize: params.get("pageSize") ?? undefined,
    search: q,
    include: "listing,lead",
    // status,
  });

  return (
    <ViewingsLayout>
      <h1 className="text-2xl font-bold mb-12">Viewings</h1>
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
    </ViewingsLayout>
  );
};

export default Viewings;
