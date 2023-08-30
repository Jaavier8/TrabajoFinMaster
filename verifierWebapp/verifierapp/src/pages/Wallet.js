import { useState, useEffect } from "react";

// material-ui
import { Grid, Typography, Stack, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";

// project imports
import SubCard from "components/SubCard";
import MainCard from "components/MainCard";

// constants
import { HOLDER } from "constants/constants";

const MyGrid = styled(Grid)(({ theme }) => ({
  gridAutoRows: "1fr",
  justifyContent: "center",
}));

const gridSpacing = 3;

export default function Wallet(props) {
  const [loadingCredentials, setLoadingCredentials] = useState(false);
  const [credentials, setCredentials] = useState([]);

  useEffect(() => {
    async function getCredentials() {
      setLoadingCredentials(true);
      const credRed = await fetch(`${HOLDER}/credentials`);
      if (credRed.status === 200) {
        const credRedJson = await credRed.json();
        const credentials = credRedJson["results"];

        setCredentials(credentials);

        await new Promise((r) => setTimeout(r, 2000));

        setLoadingCredentials(false);
      } else {
        console.log("Error al obtener las credenciales");
      }
    }
    getCredentials();
  }, []);

  const getCredentialType = (schema) => {
    if (schema.includes("degree")) {
      return "Finalización de Estudios";
    } else if (schema.includes("passport")) {
      return "Identificación Personal";
    } else if (schema.includes("certificate")) {
      return "Certificado de Idiomas";
    } else {
      return "Credencial no conocida";
    }
  };

  const renderCred = (credType, attrs) => {
    switch (credType) {
      case "Finalización de Estudios":
        return (
          <>
            <Typography variant="subtitle1">
              {"Grado: " + attrs["degree"]}
            </Typography>
            <Typography variant="subtitle1">
              {"Escuela: " + attrs["school"]}
            </Typography>
            <Typography variant="subtitle1">
              {"Nota media final: " + attrs["finalgrade"]}
            </Typography>
          </>
        );
      case "Identificación Personal":
        const date = new Date(parseInt(attrs["dateofbirth"]) * 1000);
        const simpleDate =
          date.getDate() +
          "/" +
          (date.getMonth() + 1) +
          "/" +
          date.getFullYear();
        return (
          <>
            <Typography variant="subtitle1">
              {"Nombre: " + attrs["firstname"]}
            </Typography>
            <Typography variant="subtitle1">
              {"Apellido: " + attrs["lastname"]}
            </Typography>
            <Typography variant="subtitle1">
              {"Fecha de nacimiento: " + simpleDate}
            </Typography>
            <Typography variant="subtitle1">
              {"Número de identificación: " + attrs["idnumber"]}
            </Typography>
          </>
        );
      case "Certificado de Idiomas":
        return (
          <>
            <Typography variant="subtitle1">
              {"Idioma: " + attrs["language"]}
            </Typography>
            <Typography variant="subtitle1">
              {"Puntuación: " + attrs["score"]}
            </Typography>
          </>
        );
      default:
        return (
          <>
            <Typography align="center" variant="subtitle1">
              Credencial no conocida
            </Typography>
          </>
        );
    }
  };

  return (
    <>
      <MainCard title="Credenciales" secondary={<></>}>
        {credentials.length === 0 ? (
          <Stack>
            <Typography align="center">No hay credenciales.</Typography>
          </Stack>
        ) : loadingCredentials ? (
          <Stack sx={{ mb: 5 }} alignItems="center">
            <Typography variant="h4" gutterBottom>
              Cargando credenciales...
            </Typography>
            <CircularProgress
              sx={{
                marginRight: "auto",
                marginLeft: "auto",
              }}
            />
          </Stack>
        ) : (
          <MyGrid container spacing={gridSpacing}>
            {credentials.map((cred, index) => {
              const credType = getCredentialType(cred.schema_id);
              return (
                <Grid item xs={6} key={index}>
                  <SubCard
                    title={
                      <>
                        <Typography
                          variant="h2"
                          align="center"
                          sx={{ alignSelf: "center", color: "#673ab7" }}
                        >
                          {credType}
                        </Typography>
                        <br />
                        <Typography
                          variant="h3"
                          align="center"
                          sx={{ alignSelf: "center", color: "#b39ddb" }}
                        >
                          {cred.referent}
                        </Typography>
                      </>
                    }
                  >
                    <Stack
                      direction="column"
                      justifyContent="center"
                      alignItems="flex-start"
                      spacing={2}
                    >
                      {renderCred(credType, cred.attrs)}
                    </Stack>
                  </SubCard>
                </Grid>
              );
            })}
          </MyGrid>
        )}
      </MainCard>
    </>
  );
}
