import { useRoutes } from "react-router-dom";

import MainLayout from "pages/MainLayout";
import Events from "pages/Events";
import Connections from "pages/Connections";

export default function ThemeRoutes() {
  return useRoutes([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "connections",
          element: <Connections />,
        },
        {
          path: "definitions",
          element: <Events />,
        },
        {
          path: "credentialsreq",
          element: <Events />,
        }
      ],
    },
  ]);
}
