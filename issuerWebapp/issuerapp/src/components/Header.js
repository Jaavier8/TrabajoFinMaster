// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Box,
  ButtonBase,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

import { useLocation } from "react-router-dom";

// project imports
import LogoSection from "./LogoSection";
import NavbarNavigation from "./NavbarNavigation";

// assets
import { Stack } from "@mui/system";

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = () => {
  const theme = useTheme();
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
            {location.pathname.split("/")[1].charAt(0).toUpperCase() +
              location.pathname.split("/")[1].slice(1)}
          </Typography>
        ) : null}
      </Box>
    </Stack>
  );
};

export default Header;
