import { useRoutes } from "react-router-dom";

import MainLayout from "pages/MainLayout";
import VerifyCredential from "pages/VerifyCredential";
import Proofs from "pages/Proofs"
import Wallet from "pages/Wallet";

export default function ThemeRoutes() {
  return useRoutes([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "verifycredential",
          element: <VerifyCredential />,
        },
        {
          path: "admin",
          element: <Proofs />,
        },
        {
          path: "wallet",
          element: <Wallet />,
        }
      ],
    },
  ]);
}
