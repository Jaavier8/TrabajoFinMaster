import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

// SETUP COLORS
const GREY = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
  500_8: alpha('#919EAB', 0.08),
  500_12: alpha('#919EAB', 0.12),
  500_16: alpha('#919EAB', 0.16),
  500_24: alpha('#919EAB', 0.24),
  500_32: alpha('#919EAB', 0.32),
  500_48: alpha('#919EAB', 0.48),
  500_56: alpha('#919EAB', 0.56),
  500_80: alpha('#919EAB', 0.8)
};

const GREEN = {
  light: '#16A34A',
  main: '#15803D',
  dark: '#166534',
  darker: '#14532D',
};
const BLUE = {
  light: '#60A5FA',
  main: '#3B82F6',
  dark: '#2563EB',
  darker: '#1D4ED8',
};
const PURPLE = {
  light: '#d781ff',
  main: '#cc5fff',
  dark: '#be32ff',
  darker: '#ae00ff',
};
const ERROR = {
  light: '#DC2626',
  main: '#B91C1C',
  dark: '#991B1B',
  darker: '#7F1D1D',
};
const DARK_BACKGROUND = {
  light: '#1F2937',
  main: '#111827'
}
const LIGHT_BACKGROUND = {
  light: '#F9FAFB',
  main: '#F3F4F6'
}
const DARK_TEXTCOLOR = {
  primary: GREY[0],
  secondary: GREY[100],
  disabled: GREY[200]
}
const LIGHT_TEXTCOLOR = {
  primary: GREY[800],
  secondary: GREY[600],
  disabled: GREY[500]
}

const CHART_COLORS = {
  violet: ['#826AF9', '#9E86FF', '#D0AEFF', '#F7D2FF'],
  blue: ['#2D99FF', '#83CFFF', '#A5F3FF', '#CCFAFF'],
  green: ['#2CD9C5', '#60F1C8', '#A4F7CC', '#C0F2DC'],
  yellow: ['#FFE700', '#FFEF5A', '#FFF7AE', '#FFF3D6'],
  red: ['#FF6C40', '#FF8F6D', '#FFBD98', '#FFF2D4']
};

const palette = (theme) => {
  if (theme === 'dark')
    return {
      primary: { ...GREEN },
      secondary: { ...BLUE },
      error: { ...ERROR },
      grey: GREY,
      chart: CHART_COLORS,
      divider: GREY[500_24],
      text: { ...LIGHT_TEXTCOLOR },
      background: { ...LIGHT_BACKGROUND },
      action: {
        hover: GREY[500_8],
        selected: GREY[500_16],
        disabledBackground: GREY[500_24],
        focus: GREY[500_24],
      }
    };
  else
    return {
      primary: { ...BLUE },
      secondary: { ...PURPLE },
      error: { ...ERROR },
      grey: GREY,
      chart: CHART_COLORS,
      divider: GREY[500_24],
      text: { ...DARK_TEXTCOLOR },
      background: { ...DARK_BACKGROUND },
      action: {
        hover: GREY[500_8],
        selected: GREY[500_16],
        disabledBackground: GREY[500_24],
        focus: GREY[500_24],
      }
    };
}

export default palette;
