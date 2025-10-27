import { Roles } from "@/constants/roles";
import { ReusableSidebar } from "@/components/ReusableSideBar";
import RequireAuth from "@/components/RequireAuth";

enum Paths {
  MyLeads = "/my/leads",
  LeadsPool = "/my/leads/pool",
  Closed = "closed",
  PendingApproval = "pending-approval",
  ExtensionRequests = "extension-requests",
}

interface Link {
  path: string;
  label: string;
  icon?: React.ReactNode;
}

interface Section {
  title: string;
  links: Link[];
}

export const AgentSections: Section[] = [
  {
    title: "Leads",
    links: [
      { label: "My Leads", path: Paths.MyLeads },
      { label: "Leads Pool", path: Paths.LeadsPool },
      { label: "Closed", path: Paths.Closed },
    ],
  },
  {
    title: "Requests",
    links: [
      { label: "Leads Pending Approval", path: Paths.PendingApproval },
      { label: "Extension Requests", path: Paths.ExtensionRequests },
    ],
  },
];

export const LineManagerSections: Section[] = [
  {
    title: "Leads",
    links: [
      {
        label: "Pending Approval",
        path: Paths.PendingApproval,
      },
    ],
  },
  {
    title: "Requests",
    links: [
      {
        label: "Extension Requests",
        path: Paths.ExtensionRequests,
      },
    ],
  },
];

export const LDAdminSections: Section[] = [];

export const AgentLeads = () => {
  return (
    <>
      <ReusableSidebar sections={AgentSections} />
      <div className="md:ml-64">
        <RequireAuth allowedRoles={[Roles.AGENT]} />
      </div>
    </>
  );
};

export const LineManagerLeads = () => {
  return (
    <>
      <ReusableSidebar sections={LineManagerSections} />
      <div className="md:ml-64">
        <RequireAuth allowedRoles={[Roles.LINE_MANAGER]} />
      </div>
    </>
  );
};

export const LDAdminLeads = () => {
  return (
    <>
      <ReusableSidebar sections={LDAdminSections} />
      <div className="md:ml-64">
        <RequireAuth allowedRoles={[Roles.LISTING_DEPARTMENT]} />
      </div>
    </>
  );
};
