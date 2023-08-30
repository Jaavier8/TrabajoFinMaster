// material-ui
import { Box, Typography } from "@mui/material";

import { useLocation } from "react-router-dom";

// project imports
import LogoSection from "./LogoSection";

// assets
import { Stack } from "@mui/system";

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = () => {
  const location = useLocation();

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
        sx={{ display: { xs: "none", md: "block" }, width: "50%" }}
      >
        <LogoSection />
      </Box>

      <Box sx={{ width: "50%" }}>
        {location.pathname.includes("verifycredential") ? (
          <Typography variant="h1" align="right" style={{ color: "#673ab7" }}>
            Solicitud de puesto de trabajo
          </Typography>
        ) : location.pathname.includes("admin") ? (
          <Typography variant="h1" align="right" style={{ color: "#673ab7" }}>
            Solicitudes presentadas
          </Typography>
        ): null}
      </Box>
    </Stack>
  );
};

export default Header;
