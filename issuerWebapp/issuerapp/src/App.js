// React
import React from "react";
// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';

export default function App(props) {

  return (
    <ThemeConfig>
      <GlobalStyles />
        <Router />
    </ThemeConfig>
  );
}