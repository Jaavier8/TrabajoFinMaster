import { useState, useEffect } from "react";

// material-ui
import {
  Grid,
  Typography,
  Stack,
  Button,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// project imports
import SubCard from "components/SubCard";
import MainCard from "components/MainCard";

// constants
import { POLICE_ISSUER } from "constants/constants";
import { REVOKE_CREDENTIAL } from "constants/jsonBodys";

const MyGrid = styled(Grid)(({ theme }) => ({
  gridAutoRows: "1fr",
  justifyContent: "center",
}));

const gridSpacing = 3;

export default function PoliceCredentials(props) {
  const [credentials, setCredentials] = useState([]);
  const [loadingCredentials, setLoadingCredentials] = useState(false);

  useEffect(() => {
    async function getCredentials() {
      setLoadingCredentials(true);

      const policeCredentials = localStorage.getItem("policeCredentials");
      setCredentials(JSON.parse(policeCredentials) || []);

      await new Promise((r) => setTimeout(r, 2000));

      setLoadingCredentials(false);
    }
    getCredentials();
  }, []);

  const updateCredentials = async () => {
    setLoadingCredentials(true);

    const policeCredentials = localStorage.getItem("policeCredentials");
    setCredentials(JSON.parse(policeCredentials) || []);

    await new Promise((r) => setTimeout(r, 2000));

    setLoadingCredentials(false);
  };

  const revokeCredential = async (index) => {
    const deleteReq = await fetch(`${POLICE_ISSUER}/revocation/revoke`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        REVOKE_CREDENTIAL(
          credentials[index].connId,
          credentials[index].credExId
        )
      ),
    });
    if (deleteReq.status === 200) {
      let newCredentials = credentials;
      newCredentials.splice(index, 1);
      localStorage.setItem("policeCredentials", JSON.stringify(newCredentials));

      updateCredentials();
    } else {
      console.log("Error eliminando");
    }
  };

  return (
    <>
      <MainCard title="Credenciales expedidas" secondary={<></>}>
        {credentials.length === 0 ? (
          <Stack>
            <Typography align="center">
              No hay credenciales expedidas
            </Typography>
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
              const date = new Date(parseInt(cred.attrs["dateofbirth"]) * 1000);
              const simpleDate =
                date.getDate() +
                "/" +
                (date.getMonth() + 1) +
                "/" +
                date.getFullYear();
              return (
                <Grid item xs={6} key={index}>
                  <SubCard
                    title={
                      <>
                        {"ID de la credencial: " + cred.credExId}
                        <br />
                        {"ID de la conexión: " + cred.connId}
                      </>
                    }
                  >
                    <Stack
                      direction="column"
                      justifyContent="center"
                      alignItems="flex-start"
                      spacing={2}
                    >
                      <Typography variant="subtitle1">
                        {"Nombre: " + cred.attrs["firstname"]}
                      </Typography>
                      <Typography variant="subtitle1">
                        {"Apellido: " + cred.attrs["lastname"]}
                      </Typography>
                      <Typography variant="subtitle1">
                        {"Fecha de nacimiento: " + simpleDate}
                      </Typography>
                      <Typography variant="subtitle1">
                        {"Número de identificación: " + cred.attrs["idnumber"]}
                      </Typography>

                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => revokeCredential(index)}
                      >
                        Revocar
                      </Button>
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
