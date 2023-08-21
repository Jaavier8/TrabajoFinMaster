import { Outlet, useRoutes } from "react-router-dom";

import MainLayout from "pages/MainLayout";
//import Events from "pages/Events";
import Connections from "pages/Connections";
import RequestCredential from "pages/RequestCredential";
import RequestCredentialPolice from "pages/RequestCredentialPolice";
import RequestCredentialAcademy from "pages/RequestCredentialAcademy";
import RequestCredentialUniversity from "pages/RequestCredentialUniversity";
import Police from "pages/Police";
import PoliceScred from "pages/PoliceScred";
import PoliceRequests from "pages/PoliceRequests"
import Academy from "pages/Academy";
import AcademyScred from "pages/AcademyScred";
import AcademyRequests from "pages/AcademyRequests";
import University from "pages/University";
import UniversityScred from "pages/UniversityScred";
import UniversityRequests from "pages/UniversityRequests";

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
            },
            {
              path: "academy",
              element: <RequestCredentialAcademy />
            },
            {
              path: "university",
              element: <RequestCredentialUniversity />
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
              element: <University />
            },
            {
              path: "scred",
              element: <UniversityScred />
            },
            {
              path: "requests",
              element: <UniversityRequests />
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
              element: <Academy />
            },
            {
              path: "scred",
              element: <AcademyScred />
            },
            {
              path: "requests",
              element: <AcademyRequests />
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
