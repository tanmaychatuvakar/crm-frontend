import { AppDataTable } from "@/components/AppDataTable";
import { useSearchParams } from "react-router-dom";

import { useState } from "react";

import { Column } from "@/types/column.type";
import { ReusableSidebar } from "@/components/ReusableSideBar";
import { Navbar } from "@/components/Navbar";
import { useGetLeadContactsQuery } from "@/app/services/api";
import { GetLeadContactPayload } from "@/types/lead-contact.type";
// import { useGetCallsQuery } from "@/app/services/api";

const sections = [
  {
    title: "Calls",
    links: [
      {
        label: "Calls",
        path: "/my/calls",
      },
    ],
  },
];

const CallsLayout: React.FC<{ children?: React.ReactNode }> = ({
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

const Calls = () => {
  const columns: Column<GetLeadContactPayload<{ lead: true }>>[] = [
    {
      label: "Title",
      render: (row) => <span>{row.title}</span>,
    },
    {
      label: "Name",
      render: (row) => <span>{row.name}</span>,
    },
    {
      label: "Email",
      render: (row) => <span>{row.email}</span>,
    },
    {
      label: "Status",
      render: (row) => <span>{row.prettyResponse}</span>,
    },
    {
      label: "Customer Type",
      render: (row) => <span>{row.prettyType}</span>,
    },
  ];

  const [q, setQ] = useState("");

  const [params, setParams] = useSearchParams({
    page: "1",
    pageSize: "25",
  });

  const { data } = useGetLeadContactsQuery({
    page: params.get("page") ?? undefined,
    pageSize: params.get("pageSize") ?? undefined,
    search: q,
    include: "lead",
  });

  return (
    <CallsLayout>
      <h1 className="text-2xl font-bold mb-12">Calls</h1>
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
    </CallsLayout>
  );
};

export default Calls;
