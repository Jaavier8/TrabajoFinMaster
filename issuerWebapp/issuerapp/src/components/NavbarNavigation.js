import { Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

const NavbarNavigation = () => {
    return (
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
            <Button component={Link} to="/connections" variant="text">
                Conexiones
            </Button>
            <Button component={Link} to="/definitions" variant="text">
                Esquemas/Credenciales
            </Button>
            <Button component={Link} to="/credentialsreq" variant="text">
                Solicitudes Credenciales
            </Button>
            <Button component={Link} to="/galeria" variant="text">
                RR.PP.
            </Button>
        </Stack>
    );
};

export default NavbarNavigation;
