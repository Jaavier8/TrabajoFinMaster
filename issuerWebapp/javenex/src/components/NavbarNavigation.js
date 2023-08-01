import { Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

const NavbarNavigation = () => {
    return (
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
            <Button component={Link} to="/home" variant="text">
                Página principal
            </Button>
            <Button component={Link} to="/eventos" variant="text">
                Eventos
            </Button>
            <Button component={Link} to="/galeria" variant="text">
                Galería
            </Button>
            <Button component={Link} to="/rrpp" variant="text">
                RR.PP.
            </Button>
            <Button component={Link} to="/documentos" variant="text">
                Documentos
            </Button>
        </Stack>
    );
};

export default NavbarNavigation;
