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
import identification from "../assets/images/identification.png";
import school from "../assets/images/school.png";
import language from "../assets/images/language.png";


const MyGrid = styled(Grid)(({ theme }) => ({
  gridAutoRows: "1fr",
  justifyContent: "center",
}));

const gridSpacing = 3;

const CREDENTIALS = [
  {
    name: "Identificación personal",
    img: identification,
    path: "/requestcredential/police"
  },
  {
    name: "Finalización de estudios",
    img: school,
    path: "/requestcredential/university"
  },
  {
    name: "Certificado idiomas",
    img: language,
    path: "/requestcredential/academy"
  },
];

export default function RequestCredential(props) {
  const navigate = useNavigate();

  return (
    <>
      <MainCard title="Certificados" secondary={<></>}>
        <MyGrid container spacing={gridSpacing}>
          {CREDENTIALS.map((credential, index) => {
            return (
              <Grid item xs={6} key={index}>
                <SubCard title={credential.name}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                  >
                    <img
                      src={credential.img}
                      alt={credential.name}
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
                        Pulse el siguiente botón para ser redirigido a la página
                        de solicitud del certificado.
                      </Typography>
                      <Button
                        variant="outlined"
                        onClick={() => navigate(credential.path)}
                      >
                        Solicitar certificado
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
