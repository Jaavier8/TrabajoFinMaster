import { useState } from "react";

// material-ui
import {
  Grid,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useNavigate } from "react-router-dom";

// project imports
import SubCard from "components/SubCard";
import MainCard from "components/MainCard";

// icons
import schema from "../assets/images/schema.png";
import requests from "../assets/images/requests.png";
import issued from "../assets/images/issued.png"

// modals
import NewEventModal from "components/NewEventModal";

const MyGrid = styled(Grid)(({ theme }) => ({
  gridAutoRows: "1fr",
  justifyContent: "center",
}));

const gridSpacing = 3;

const PAGES = [
  {
    name: "Esquemas/Credenciales",
    img: schema,
    path: "/academy/scred",
    message: "Pulse el siguiente botón para ser redirigido a la página donde se podrán ver todos los esquemas y credenciales definidas por Policia."
  },
  {
    name: "Credenciales solicitadas",
    img: requests,
    path: "/academy/requests",
    message: "Pulse el siguiente botón para ser redirigido a la página donde se podrán ver las solicitudes de credenciales recibidas."
  },
  {
    name: "Credenciales expedidas",
    img: issued,
    path: "/academy/issued",
    message: "Pulse el siguiente botón para ser redirigido a la página donde se podrán ver las credenciales que se han expedido."
  }
];

export default function Academy(props) {
  const navigate = useNavigate();

  return (
    <>
      <MainCard title="Menú de navegación" secondary={<></>}>
        <MyGrid container spacing={gridSpacing}>
          {PAGES.map((page, index) => {
            return (
              <Grid item xs={6} key={index}>
                <SubCard title={page.name}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                  >
                    <img
                      src={page.img}
                      alt={page.name}
                      height="200"
                      width="200"
                    />
                    <Stack
                      direction="column"
                      justifyContent="center"
                      alignItems="center"
                      sx={{ width: "100%" }}
                    >
                      <Typography align="center" variant="subtitle1">
                        {page.message}
                      </Typography>
                      <Button
                        variant="outlined"
                        onClick={() => navigate(page.path)}
                      >
                        Acceder
                      </Button>
                    </Stack>
                  </Stack>
                </SubCard>
              </Grid>
            );
          })}
        </MyGrid>
      </MainCard>
    </>
  );
}
