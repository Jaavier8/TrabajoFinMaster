import { Link } from "react-router-dom";

// material-ui
import { ButtonBase } from "@mui/material";

import { useLocation } from "react-router-dom";

// project imports
import Logo from "./Logo";

// ==============================|| MAIN LOGO ||============================== //

export default function LogoSection() {
  const location = useLocation();

  return (
    <ButtonBase
      disableRipple
      component={Link}
      to={location.pathname.split("/")[1]}
    >
      <Logo />
    </ButtonBase>
  );
}
