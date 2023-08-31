import { Button, Stack } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const NavbarNavigation = () => {
  const location = useLocation();
  return location.pathname.includes("requestcredential") ? (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <Button component={Link} to="/requestcredential/police" variant="text">
        Policía
      </Button>
      <Button
        component={Link}
        to="/requestcredential/university"
        variant="text"
      >
        Universidad
      </Button>
      <Button component={Link} to="/requestcredential/academy" variant="text">
        Academia
      </Button>
    </Stack>
  ) : (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <Button
        component={Link}
        to={location.pathname.split("/")[1] + "/scred"}
        variant="text"
      >
        Esquemas/Credenciales
      </Button>
      <Button
        component={Link}
        to={location.pathname.split("/")[1] + "/requests"}
        variant="text"
      >
        Solicitudes Credenciales
      </Button>
      <Button
        component={Link}
        to={location.pathname.split("/")[1] + "/issued"}
        variant="text"
      >
        Credenciales Emitidas
      </Button>
    </Stack>
  );
};

export default NavbarNavigation;
