import { useState, useEffect } from "react";

// material-ui
import { Grid, Typography, Stack, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";

// project imports
import SubCard from "components/SubCard";
import MainCard from "components/MainCard";

// constants
import { VERIFIER } from "constants/constants";

const MyGrid = styled(Grid)(({ theme }) => ({
  gridAutoRows: "1fr",
  justifyContent: "center",
}));

const gridSpacing = 3;

export default function Proofs(props) {
  const [loadingProofs, setLoadingProofs] = useState(false);
  const [proofs, setProofs] = useState([]);

  useEffect(() => {
    async function getProofRecords() {
      setLoadingProofs(true);
      const proofReqRes = await fetch(`${VERIFIER}/present-proof/records`);
      if (proofReqRes.status === 200) {
        const proofReqResJson = await proofReqRes.json();

        let verifiedProofs = [];
        for (const proof of proofReqResJson["results"]) {
          if (proof["verified"]) verifiedProofs.push(proof);
        }

        setProofs(verifiedProofs);

        await new Promise((r) => setTimeout(r, 2000));

        setLoadingProofs(false);
      } else {
        console.log("Error al obtener las solicitudes");
      }
    }
    getProofRecords();
  }, []);

  return (
    <>
      <MainCard title="Solicitudes presentadas" secondary={<></>}>
        {proofs.length === 0 ? (
          <Stack>
            <Typography align="center">No hay solicitudes</Typography>
          </Stack>
        ) : loadingProofs ? (
          <Stack sx={{ mb: 5 }} alignItems="center">
            <Typography variant="h4" gutterBottom>
              Cargando solicitudes...
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
            {proofs.map((proof, index) => {
              return (
                <Grid item xs={6} key={index}>
                  <SubCard
                    title={
                      <>
                        {proof.verified === "true" ? (
                          <Typography
                            variant="h2"
                            align="center"
                            sx={{ color: "green" }}
                          >
                            Válido
                          </Typography>
                        ) : (
                          <Typography
                            variant="h2"
                            align="center"
                            sx={{ color: "red" }}
                          >
                            No Válido
                          </Typography>
                        )}
                        <br />
                        <Typography
                          variant="h5"
                          align="center"
                        >
                          {"ID de la conexión: " + proof.connection_id}
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
                      <Typography variant="subtitle1">
                        {"Nombre: " +
                          proof.presentation.requested_proof.revealed_attrs[
                            "firstName"
                          ].raw}
                      </Typography>
                      <Typography variant="subtitle1">
                        {"Apellido: " +
                          proof.presentation.requested_proof.revealed_attrs[
                            "lastName"
                          ].raw}
                      </Typography>
                      <Typography variant="subtitle1">
                        {"Número de identificación: " +
                          proof.presentation.requested_proof.revealed_attrs[
                            "idNumber"
                          ].raw}
                      </Typography>
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
