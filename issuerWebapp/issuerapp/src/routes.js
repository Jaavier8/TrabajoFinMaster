import { Outlet, useRoutes } from "react-router-dom";

import MainLayout from "pages/MainLayout";
import Events from "pages/Events";
import Connections from "pages/Connections";
import RequestCredential from "pages/RequestCredential";
import RequestCredentialPolice from "pages/RequestCredentialPolice";

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
          path: "connections",
          element: <Connections />
        },
        {
          path: "definitions",
          element: <Events />
        },
        {
          path: "credentialsreq",
          element: <Events />
        }
      ],
    },
  ]);
}
