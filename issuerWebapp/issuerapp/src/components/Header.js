// material-ui
import { Box, Typography } from "@mui/material";

import { useLocation } from "react-router-dom";

// project imports
import LogoSection from "./LogoSection";
import NavbarNavigation from "./NavbarNavigation";

// assets
import { Stack } from "@mui/system";

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = () => {
  const location = useLocation();

  const getIssuer = (issuer) => {
    switch (issuer) {
      case "police":
        return "Policía";
      case "academy":
        return "Academia";
      case "university":
        return "Universidad";
      default:
        return "";
    }
  };

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ width: "100%" }}
    >
      {/* logo & toggler button */}
      <Box
        component="span"
        sx={{ display: { xs: "none", md: "block" }, width: "15%" }}
      >
        <LogoSection />
      </Box>

      {/* navbar navigation */}
      <Box sx={{ width: "70%" }}>
        <NavbarNavigation />
      </Box>

      <Box
        component="span"
        sx={{ display: { xs: "none", md: "block" }, width: "15%" }}
      >
        {!location.pathname.includes("requestcredential") ? (
          <Typography variant="h1" align="right" style={{ color: "red" }}>
            {getIssuer(location.pathname.split("/")[1])}
          </Typography>
        ) : null}
      </Box>
    </Stack>
  );
};

export default Header;
