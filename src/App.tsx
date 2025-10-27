import { useEffect, useRef } from "react";

import { Outlet, Route, Routes, useLocation } from "react-router-dom";

import type { Fancybox as FancyboxType } from "@fancyapps/ui/types";
import * as Fancyapps from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

import NotFound from "./pages/not-found";

// import Photoshoots from "./screens/Photoshoots/screens/Photoshoots";
// import { Assignments, Uploaded } from "./screens/Photoshoots";

import {
  MyLeads,
  Archived,
  ClosedLeads,
  CampaignRotation,
  LeadsPendingApproval,
  LeadsPool,
  // ExtensionRequests,
} from "./screens/Leads/leads/screens";
import { Create } from "./screens/Leads/leads/screens";

import Profile from "./pages/profile";

// import { Edit } from "./screens/Leads/leads/screens/Edit";
import { ProtectedRoute } from "./components/shared/protected-route";

import Users from "./pages/users";
import { SignIn } from "./pages/auth/sign-in";
import Dashboard from "./pages/dashboard";
import { Listings as AgentListings } from "./pages/agent/listings";
import { Listings as ListingDepartmentListings } from "./pages/listing-department/listings";
import { PhotoRequests } from "./pages/photo-requests";
import { Photoshoots } from "./pages/photoshoots";
import { UnpublishRequests } from "./pages/listing-department/unpublish-requests";
import { ExtensionRequests } from "./pages/extension-requests";

import { ExtensionRequestsLayout } from "./layouts/line-manager/extension-requests/layout";

import { PhotoshootsLayout } from "./layouts/photoshoots";
import { Campaigns } from "./pages/campaigns";
import { Teams } from "./pages/teams";
import { Leads as AgentLeads } from "./pages/agent/leads";

import { Leads as LineManagerLeads } from "./pages/line-manager/leads";
import Deals from "./pages/deals";

export const NativeFancybox: typeof FancyboxType = Fancyapps.Fancybox;

function App() {
  const containerRef = useRef(null);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/sign-in" && location.pathname !== "/sign-up")
      localStorage.setItem("lastPath", location.pathname);
  }, [location]);

  useEffect(() => {
    const container = containerRef.current;

    const delegate = "[data-fancybox]";
    const options = {};

    NativeFancybox.bind(container, delegate, options);

    return () => {
      NativeFancybox.unbind(container);
      NativeFancybox.close();
    };
  });

  return (
    <div ref={containerRef}>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />

          <Route>
            <Route path="profile" element={<Profile />} />
            <Route path="users" element={<Users />} />

            <Route path="photoshoots" element={<Photoshoots.Layout />}>
              <Route index element={<Photoshoots.Index />} />
            </Route>

            <Route path="listings">
              <Route
                path="extension-requests"
                element={<ExtensionRequestsLayout />}
              >
                <Route index element={<ExtensionRequests.Index />} />
                <Route path=":id/show" element={<ExtensionRequests.Show />} />
              </Route>
            </Route>

            <Route path="leads" element={<LineManagerLeads.Layout />}>
              <Route
                path="pending-approval"
                element={<LeadsPendingApproval />}
              />
              <Route
                path="extension-requests"
                element={<LineManagerLeads.ExtensionRequests />}
              />
              {/* <Route path="pending-approval/:id" element={<Preview />} /> */}
            </Route>

            <Route path="deals" element={<Deals />} />

            {/* <Route path="pool" element={<LeadsPool />} /> */}
            <Route path="my">
              <Route path="photoshoots" element={<PhotoshootsLayout />}>
                <Route index element={<Photoshoots.Index />} />
                <Route
                  index
                  path="assignments"
                  element={<Photoshoots.Assignments />}
                />
                <Route path="uploaded" element={<Photoshoots.Uploaded />} />
              </Route>

              <Route path=":type" element={<AgentListings.Layout />}>
                <Route path="listings">
                  <Route path=":section" element={<AgentListings.Index />} />
                  <Route path=":id/edit" element={<AgentListings.Edit />} />
                  <Route path=":id/show" element={<AgentListings.Show />} />
                  <Route path="create" element={<AgentListings.Create />} />
                </Route>
                <Route
                  path="photo-requests"
                  element={<AgentListings.PhotoRequests />}
                />
                <Route
                  path="extension-requests"
                  element={<AgentListings.ExtensionRequests />}
                />
                <Route
                  path="unpublish-requests"
                  element={<AgentListings.UnpublishRequests />}
                />
              </Route>

              <Route path="viewings" element={<AgentLeads.Viewings />} />
              <Route path="offers" element={<AgentLeads.Offers />} />
              <Route path="calls" element={<AgentLeads.Calls />} />

              <Route path="leads" element={<AgentLeads.Layout />}>
                <Route path="pool" element={<LeadsPool />} />
                <Route index element={<MyLeads />} />
                <Route path="closed" element={<ClosedLeads />} />
                <Route
                  path="campaign-rotation"
                  element={<CampaignRotation />}
                />
                <Route path="archived" element={<Archived />} />
                <Route
                  path="pending-approval"
                  element={<AgentLeads.PendingApproval />}
                />
                <Route
                  path="extension-requests"
                  element={<AgentLeads.ExtensionRequests />}
                />
                {/* <Route path="edit/:id" element={<Edit />} /> */}
                <Route path="create" element={<Create />} />
              </Route>
            </Route>

            <Route element={<ListingDepartmentListings.Layout />}>
              <Route path="unpublish-requests">
                <Route index element={<UnpublishRequests.Index />} />
                <Route path=":id/show" element={<UnpublishRequests.Show />} />
              </Route>

              <Route
                path="listings/:id/show"
                element={<ListingDepartmentListings.Show />}
              />
              <Route
                path="listings/:type"
                element={<ListingDepartmentListings.Index />}
              />
            </Route>

            <Route path="campaigns" element={<Campaigns.Layout />}>
              <Route index element={<Campaigns.Index />} />
              <Route path="create" element={<Campaigns.Create />} />
              <Route path=":id/edit" element={<Campaigns.Edit />} />
            </Route>

            <Route path="teams" element={<Teams.Layout />}>
              <Route index element={<Teams.Index />} />
              <Route path="create" element={<Teams.Create />} />
              <Route path=":id/edit" element={<Teams.Edit />} />
            </Route>

            <Route path="photo-requests" element={<PhotoRequests.Layout />}>
              <Route index element={<PhotoRequests.Index />} />
              <Route path=":id/show" element={<PhotoRequests.Show />} />
            </Route>
          </Route>
        </Route>

        <Route path="/auth/sign-in" element={<SignIn />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
