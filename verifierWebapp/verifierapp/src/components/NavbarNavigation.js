import { Button, Stack } from "@mui/material";
import { useLocation } from "react-router-dom";

const NavbarNavigation = () => {
  const location = useLocation();
  return location.pathname.includes("verifycredential") ? (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <Button variant="text">Solicitar trabajo</Button>
    </Stack>
  ) : (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <Button variant="text">Solicitudes</Button>
    </Stack>
  );
};

export default NavbarNavigation;
