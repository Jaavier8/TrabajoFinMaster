import { Outlet, useRoutes } from "react-router-dom";

import MainLayout from "pages/MainLayout";
import Events from "pages/Events";
import Connections from "pages/Connections";
import RequestCredential from "pages/RequestCredential";
import RequestCredentialPolice from "pages/RequestCredentialPolice";
import Police from "pages/Police";
import PoliceScred from "pages/PoliceScred";
import PoliceRequests from "pages/PoliceRequests"

export default function ThemeRoutes() {
  return useRoutes([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "requestcredential",
          element: <Outlet />,
          children: [
            {
              index: true,
              element: <RequestCredential />
            },
            {
              path: "police",
              element: <RequestCredentialPolice />
            }
          ]
        },
        {
          path: "police",
          element: <Outlet />,
          children: [
            {
              index: true,
              element: <Police />
            },
            {
              path: "scred",
              element: <PoliceScred />
            },
            {
              path: "requests",
              element: <PoliceRequests />
            },
            {
              path: "issued",
              element: <PoliceRequests />
            }
          ]
        },
        {
          path: "university",
          element: <Outlet />,
          children: [
            {
              index: true,
              element: <Police />
            },
            {
              path: "scred",
              element: <PoliceScred />
            },
            {
              path: "requests",
              element: <PoliceRequests />
            },
            {
              path: "issued",
              element: <PoliceRequests />
            }
          ]
        },
        {
          path: "academy",
          element: <Outlet />,
          children: [
            {
              index: true,
              element: <Police />
            },
            {
              path: "scred",
              element: <PoliceScred />
            },
            {
              path: "requests",
              element: <PoliceRequests />
            },
            {
              path: "issued",
              element: <PoliceRequests />
            }
          ]
        },
        {
          path: "connections",
          element: <Connections />
        }
      ],
    },
  ]);
}
