import { createRoot } from "react-dom/client";

// third party
import { BrowserRouter } from "react-router-dom";

// project imports
import App from "App";

// style + assets
import "assets/scss/style.scss";

// ==============================|| REACT DOM RENDER  ||============================== //

const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <BrowserRouter basename='/'>
    <App />
  </BrowserRouter>
);
