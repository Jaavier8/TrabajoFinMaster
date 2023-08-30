import { useState, useEffect } from "react";

// material-ui
import { Grid, Typography, Stack, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";

// project imports
import SubCard from "components/SubCard";
import MainCard from "components/MainCard";

// constants
import { POLICE_ISSUER } from "constants/constants";

const MyGrid = styled(Grid)(({ theme }) => ({
  gridAutoRows: "1fr",
  justifyContent: "center",
}));

const gridSpacing = 3;

export default function PoliceScred(props) {
  const [schemas, setSchemas] = useState([]);
  const [credentialsDef, setCredentialsDef] = useState([]);

  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    async function getData() {
      setLoadingData(true);

      //Schemas
      const schIdsRes = await fetch(`${POLICE_ISSUER}/schemas/created`);
      if (schIdsRes.status === 200) {
        const schIdsResJson = await schIdsRes.json();
        const schIds = schIdsResJson["schema_ids"];

        let schemasInfo = [];
        for (const schId of schIds) {
          const schRes = await fetch(`${POLICE_ISSUER}/schemas/${schId}`);
          const schResJson = await schRes.json();
          schemasInfo.push(schResJson["schema"]);
        }

        setSchemas(schemasInfo);
      } else {
        console.log("Error al obtener los esquemas");
        //TODO: error
      }

      //CredentialsDef
      const credIdsRes = await fetch(
        `${POLICE_ISSUER}/credential-definitions/created`
      );
      if (credIdsRes.status === 200) {
        const credIdsResJson = await credIdsRes.json();
        const credIds = credIdsResJson["credential_definition_ids"];

        let credentialsInfo = [];
        for (const credId of credIds) {
          const credRes = await fetch(
            `${POLICE_ISSUER}/credential-definitions/${credId}`
          );
          const credResJson = await credRes.json();
          credentialsInfo.push(credResJson["credential_definition"]);
        }

        setCredentialsDef(credentialsInfo);
      } else {
        console.log("Error al obtener las credenciales");
        //TODO: error
      }

      await new Promise((r) => setTimeout(r, 2000));
      setLoadingData(false);
    }
    getData();
  }, []);

  const schemaFromSeqNo = (seqNo) => {
    for (const schema of schemas) {
      if (schema.seqNo === parseInt(seqNo)) {
        return schema.name;
      }
    }
  };

  const returnAttrs = (schName) => {
    switch (schName) {
      case "passport":
        return "Nombre, Apellido, Fecha de nacimiento y Número de identificación";
      case "certificate":
        return "Idioma, Identificador del idioma y Puntuación";
      case "degree":
        return "Nombre del grado, Identificador del grado, Nombre de la escuela, Identificador de la escuela y Nota media final";
      default:
        return "Atributos desconocidos";
    }
  };

  return (
    <>
      <MainCard title="Esquemas" secondary={<></>}>
        {schemas.length === 0 ? (
          <Stack>
            <Typography align="center">No hay esquemas</Typography>
          </Stack>
        ) : loadingData ? (
          <Stack sx={{ mb: 5 }} alignItems="center">
            <Typography variant="h4" gutterBottom>
              Cargando esquemas...
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
            {schemas.map((sch, index) => {
              return (
                <Grid item xs={6} key={index}>
                  <SubCard
                    title={
                      <>
                        {"Nombre del esquema:"}
                        <br />
                        <Typography
                          variant="h3"
                          sx={{ alignSelf: "center", color: "red" }}
                        >
                          {sch.name}
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
                        {"Versión: " + sch.version}
                      </Typography>
                      <Typography variant="subtitle1">
                        {"Atributos: " + returnAttrs(sch.name)}
                      </Typography>
                    </Stack>
                  </SubCard>
                </Grid>
              );
            })}
          </MyGrid>
        )}
      </MainCard>
      <MainCard title="Definición Credenciales" secondary={<></>}>
        {credentialsDef.length === 0 ? (
          <Stack>
            <Typography align="center">
              No hay ninguna credencial definida
            </Typography>
          </Stack>
        ) : loadingData ? (
          <Stack sx={{ mb: 5 }} alignItems="center">
            <Typography variant="h4" gutterBottom>
              Cargando definición de credenciales...
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
            {credentialsDef.map((credDef, index) => {
              return (
                <Grid item xs={6} key={index}>
                  <SubCard
                    title={
                      <>
                        {"Nombre de la definición de credencial:"}
                        <br />
                        <Typography
                          variant="h3"
                          sx={{ alignSelf: "center", color: "red" }}
                        >
                          {credDef.tag}
                        </Typography>
                      </>
                    }
                  >
                    <Stack
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="center"
                      spacing={2}
                    >
                      <Typography variant="subtitle1">
                        {"Creado a partir del esquema:"}
                      </Typography>
                      <Typography variant="subtitle1" sx={{color: '#673ab7'}}>
                        {schemaFromSeqNo(credDef.schemaId)}
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
