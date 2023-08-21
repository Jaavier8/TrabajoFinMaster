// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Menu, MenuItem } from '@mui/material';

// project imports
import LogoSection from './LogoSection';
import NavbarNavigation from './NavbarNavigation';

// assets
import { Stack } from '@mui/system';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = () => {
    const theme = useTheme();

    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
            {/* logo & toggler button */}
            <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, width: '15%' }}>
                <LogoSection />
            </Box>

            {/* navbar navigation */}
            <Box sx={{ width: '70%' }}>
                <NavbarNavigation />
            </Box>

            <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, width: '15%' }}/>
        </Stack>
    );
};

export default Header;
