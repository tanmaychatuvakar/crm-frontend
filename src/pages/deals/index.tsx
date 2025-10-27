import { useMemo, useState } from "react";

import { useSearchParams } from "react-router-dom";

import { AppDataTable } from "@/components/AppDataTable";

import { useGetDealsQuery } from "@/app/services/api";
import { Column } from "@/types/column.type";
import { getFormattedDate } from "@/utils";
import { GetDealPayload } from "@/types/deal.type";
import { ReusableSidebar } from "@/components/ReusableSideBar";
import { Navbar } from "@/components/Navbar";

type Payload = GetDealPayload<{ offer: true }>;

const sections = [
  {
    title: "Deals",
    links: [
      {
        path: "/deals",
        label: "Deals",
      },
    ],
  },
];

const LeadsLayout: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div>
      <div className="ml-64 px-8 py-4">
        <Navbar />
        <ReusableSidebar sections={sections} />
        <main>{children}</main>
      </div>
    </div>
  );
};

const Deals = () => {
  const [params, setParams] = useSearchParams({
    page: "1",
    pageSize: "25",
  });

  const [q, setQ] = useState("");

  const { data, isLoading } = useGetDealsQuery({
    page: params.get("page") ?? undefined,
    pageSize: params.get("pageSize") ?? undefined,
    include: "offer",
  });

  const columns: Column<Payload>[] = useMemo(
    () => [
      {
        label: "Offer Ref",
        render: (row) => <span>{row.offer.reference}</span>,
      },
      {
        label: "Offer Price",
        render: (row) => <span>{row.offer.price}</span>,
      },
      {
        label: "Offer Cheques",
        render: (row) => <span>{row.offer.cheques}</span>,
      },
      {
        label: "Created At",
        render: (row) => {
          return <span>{getFormattedDate(row.createdAt)}</span>;
        },
      },
    ],
    []
  );

  return (
    <>
      <LeadsLayout>
        <div className="flex justify-between mb-12">
          <h1 className="font-bold text-2xl">Deals</h1>
        </div>

        <AppDataTable
          columns={columns}
          data={data?.data || []}
          total={data?.total || 0}
          identifier="deals"
          loading={isLoading}
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
        />
      </LeadsLayout>
    </>
  );
};

export default Deals;
