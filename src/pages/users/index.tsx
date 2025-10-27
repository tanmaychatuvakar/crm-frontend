import { useMemo, useState } from "react";
import { Badge, Button } from "@/components/shared";
import { useSearchParams } from "react-router-dom";

import { AppDataTable } from "@/components/AppDataTable";

import { useGetUsersQuery, useHoldUserMutation } from "@/app/services/api";
import { Column } from "@/types/column.type";
import { RolesFullName } from "@/constants/roles";
import { User } from "@/types/user.type";
import { useAppSelector } from "@/hooks/useAppSelector";
import { getFormattedDate } from "@/utils";
import { CreateUserDialog } from "./dialogs/create-user";
import { EditUserDialog } from "./dialogs/edit-user";
import { DeleteUserDialog } from "./dialogs/delete-user";
import { ReusableSidebar } from "@/components/ReusableSideBar";

const sections = [
  {
    title: "Users",
    links: [
      {
        path: "/users",
        label: "Users",
      },
    ],
  },
];

const UsersLayout: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="ml-64 mt-10 px-8 py-4">
      <ReusableSidebar sections={sections} />
      <main>{children}</main>
    </div>
  );
};

const Users = () => {
  const userId = useAppSelector((state) => state.auth.user?.id);

  const [params, setParams] = useSearchParams({
    page: "1",
    pageSize: "25",
  });

  const [user, setUser] = useState<User | null>(null);

  const [dialogs, setDialogs] = useState({
    create: false,
    edit: false,
    delete: false,
  });

  const [q, setQ] = useState("");

  const { data, isLoading } = useGetUsersQuery({
    search: encodeURIComponent(q),
    page: params.get("page") ?? undefined,
    pageSize: params.get("pageSize") ?? undefined,
    include: "role",
  });

  const [holdUser] = useHoldUserMutation();

  const columns: Column<User>[] = useMemo(
    () => [
      {
        label: "Full name",
        render: ({ id, name }) => {
          return (
            <span>
              {name} {id === userId && <Badge pill>Me</Badge>}
            </span>
          );
        },
      },
      {
        label: "Email",
        accessor: "email",
      },
      {
        label: "Phone Number",
        accessor: "phoneNumber",
      },
      {
        label: "Role",
        render: ({ role }) => {
          return <Badge>{RolesFullName[role]}</Badge>;
        },
      },
      {
        label: "Actions",
        render: (row) => {
          return (
            <div className="flex gap-x-3">
              <button
                className="text-blue-500 font-medium"
                onClick={() => {
                  setUser(row);
                  setDialogs((prevState) => ({ ...prevState, edit: true }));
                }}
              >
                Edit
              </button>
              {row.role !== "ADMINISTRATOR" && (
                <button
                  className="text-gray-600 font-medium disabled:text-gray-300"
                  onClick={() => {
                    holdUser(row.id);
                  }}
                >
                  {row.heldAt ? "Unhold" : "Hold"}
                </button>
              )}
              {row.id !== userId && (
                <button
                  className="text-red-500 font-medium"
                  onClick={() => {
                    setUser(row);
                    setDialogs((prevState) => ({
                      ...prevState,
                      delete: true,
                    }));
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          );
        },
      },
      {
        label: "Created at",
        render: (row) => {
          return <span>{getFormattedDate(row.createdAt)}</span>;
        },
      },
    ],
    []
  );

  return (
    <>
      <UsersLayout>
        <div className="flex justify-between mb-12">
          <h1 className="font-bold text-2xl">Users</h1>
          <Button
            variant="secondary"
            onClick={() => {
              setDialogs((prevState) => ({ ...prevState, create: true }));
            }}
          >
            Create
          </Button>
        </div>

        <AppDataTable
          columns={columns}
          data={data?.data || []}
          total={data?.total || 0}
          identifier="users"
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
          searchable
        />
      </UsersLayout>
      <CreateUserDialog
        open={dialogs.create}
        onClose={() => {
          setDialogs((prevState) => ({ ...prevState, create: false }));
        }}
      />
      {user && (
        <EditUserDialog
          open={dialogs.edit}
          user={user}
          onClose={() =>
            setDialogs((prevState) => ({ ...prevState, edit: false }))
          }
        />
      )}
      {user && (
        <DeleteUserDialog
          open={dialogs.delete}
          user={user}
          onClose={() =>
            setDialogs((prevState) => ({ ...prevState, delete: false }))
          }
        />
      )}
    </>
  );
};

export default Users;
