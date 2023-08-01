// React
import React from 'react';
import { Icon } from '@iconify/react';
import crossIcon from '@iconify/icons-akar-icons/cross';

// Material UI
import { IconButton, Box } from '@mui/material';

export default function Cross(props) {
    const { onClick } = props;

    return (
        <IconButton
            onClick={onClick}
            sx={{
                color: 'text.primary',
                padding: 0,
                width: 44,
                height: 44,
                bgcolor: (theme) => theme.palette.background.light
                //bgcolor: (theme) => theme.palette.error.main
            }}
        >
            <Box
                component={Icon}
                icon={crossIcon}
                sx={{
                    width: 24,
                    height: 24
                }}
            />
        </IconButton>
    );
}
