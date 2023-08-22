import { useState, useEffect } from "react";

// material-ui
import {
  Grid,
  Typography,
  Stack,
  Button,
  CircularProgress,
  TextField,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// project imports
import SubCard from "components/SubCard";
import MainCard from "components/MainCard";

// constants
import { ACADEMY_ISSUER, HOLDER } from "constants/constants";
import { SEND_PROPOSAL_ACADEMY } from "constants/jsonBodys";

const MyGrid = styled(Grid)(({ theme }) => ({
  gridAutoRows: "1fr",
  justifyContent: "center",
}));

const gridSpacing = 3;

const LANGUAGE_MAP = {
  english: "1",
  french: "2",
  spanish: "3",
  1: "english",
  2: "french",
  3: "spanish",
};

export default function RequestCredentialAcademy(props) {
  const [language, setLanguage] = useState("");
  const [languageId, setLanguageId] = useState("");
  const [score, setScore] = useState("");
  const [age, setAge] = useState("");

  const [activeStep, setActiveStep] = useState(0);

  const [credExId, setCredExId] = useState("");

  const [loadingConnections, setLoadingConnections] = useState(false);
  const [stablishingConnection, setStablishingConnection] = useState(false);
  const [requestingCertificate, setRequestingCertificate] = useState(false);
  const [acceptingOffer, setAcceptingOffer] = useState(false);
  const [savingCredential, setSavingCredential] = useState(false);
  const [academyConnectionId, setAcademyConnectionId] = useState("");

  useEffect(() => {
    async function getConnections() {
      setLoadingConnections(true);
      const resConn = await fetch(`${HOLDER}/connections`);
      if (resConn.status === 200) {
        const conn = await resConn.json();

        for (const connection of conn["results"]) {
          if (connection["their_label"] === "academy") {
            setAcademyConnectionId(connection["connection_id"]);

            let newActiveStep = activeStep + 1;
            setActiveStep(newActiveStep);
          }
        }

        await new Promise((r) => setTimeout(r, 2000));

        setLoadingConnections(false);
      } else {
        console.log("Error al obtener las conexiones");
      }
    }
    getConnections();
  }, []);

  const stablishConnection = async () => {
    setStablishingConnection(true);
    const createConn = await fetch(
      `${ACADEMY_ISSUER}/connections/create-invitation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );
    if (createConn.status === 200) {
      const createConnJson = await createConn.json();
      console.log(createConnJson.invitation);

      const receiveConn = await fetch(
        `${HOLDER}/connections/receive-invitation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(createConnJson.invitation),
        }
      );
      if (receiveConn.status === 200) {
        const receiveConnJson = await receiveConn.json();
        setAcademyConnectionId(receiveConnJson["connection_id"]);

        let newActiveStep = activeStep + 1;
        setActiveStep(newActiveStep);
      } else {
        console.log("Error");
      }

      await new Promise((r) => setTimeout(r, 2000));

      setStablishingConnection(false);
    } else {
      console.log("Error al establecer la conexión");
    }
  };

  const waitingOffer = async (credExId) => {
    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        const credRecords = await fetch(
          `${HOLDER}/issue-credential-2.0/records`
        );
        const credRecordsJson = await credRecords.json();
        for (const record of credRecordsJson["results"]) {
          if (
            record["cred_ex_record"]["cred_ex_id"] === credExId &&
            record["cred_ex_record"]["state"] === "offer-received"
          ) {
            const offerReceived =
              record["cred_ex_record"]["cred_offer"]["credential_preview"][
                "attributes"
              ];
            for (const data of offerReceived) {
              switch (data["name"]) {
                case "language":
                  setLanguageId(data["value"]);
                  setLanguage(LANGUAGE_MAP[data["value"]])
                  break;
                case "score":
                  setScore(data["value"]);
                  break;
                default:
                  break;
              }
            }
            clearInterval(interval);
            resolve();
          }
        }
      }, 2000);
    });
  };

  const requestCertificate = async () => {
    setRequestingCertificate(true);

    //Get credId
    const credIdRes = await fetch(
      `${ACADEMY_ISSUER}/credential-definitions/created`
    );
    const credIdResJson = await credIdRes.json();
    const credId = credIdResJson["credential_definition_ids"][0];

    //Get schemaId and version
    const schemaIdRes = await fetch(`${ACADEMY_ISSUER}/schemas/created`);
    const schemaIdResJson = await schemaIdRes.json();
    const schemaId = schemaIdResJson["schema_ids"][0];

    //Send proposal
    const reqCert = await fetch(
      `${HOLDER}/issue-credential-2.0/send-proposal`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          SEND_PROPOSAL_ACADEMY(
            academyConnectionId,
            languageId,
            credId,
            schemaId,
            schemaId.slice(-3)
          )
        ),
      }
    );
    if (reqCert.status === 200) {
      const reqCertJson = await reqCert.json();
      const credExId = reqCertJson["cred_ex_id"];
      setCredExId(credExId);

      await waitingOffer(credExId);

      let newActiveStep = activeStep + 1;
      setActiveStep(newActiveStep);

      setRequestingCertificate(false);
    } else {
      console.log("Error al solicitar certificado");
      //TODO: error
    }
  };

  const waitingCertificate = async () => {
    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        const credRecords = await fetch(
          `${HOLDER}/issue-credential-2.0/records`
        );
        const credRecordsJson = await credRecords.json();
        for (const record of credRecordsJson["results"]) {
          if (
            record["cred_ex_record"]["cred_ex_id"] === credExId &&
            record["cred_ex_record"]["state"] === "credential-received"
          ) {
            clearInterval(interval);
            resolve();
          }
        }
      }, 2000);
    });
  };

  const acceptOffer = async () => {
    setAcceptingOffer(true);
    const accOffer = await fetch(
      `${HOLDER}/issue-credential-2.0/records/${credExId}/send-request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );
    if (accOffer.status === 200) {
      await waitingCertificate();

      let newActiveStep = activeStep + 1;
      setActiveStep(newActiveStep);

      setAcceptingOffer(false);
    } else {
      console.log("Error al aceptar la oferta");
    }
  };

  const saveCredential = async () => {
    setSavingCredential(true);
    const accOffer = await fetch(
      `${HOLDER}/issue-credential-2.0/records/${credExId}/store`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );
    if (accOffer.status === 200) {
      let newActiveStep = activeStep + 1;
      setActiveStep(newActiveStep);

      setSavingCredential(false);
    } else {
      console.log("Error guardando la credencial");
    }
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return loadingConnections ? (
          <Stack sx={{ mb: 5 }} alignItems="center">
            <Typography variant="h4" gutterBottom>
              Cargando información...
            </Typography>
            <CircularProgress
              sx={{
                marginRight: "auto",
                marginLeft: "auto",
              }}
            />
          </Stack>
        ) : stablishingConnection ? (
          <Stack sx={{ mb: 5 }} alignItems="center">
            <Typography variant="h4" gutterBottom>
              Estableciendo conexión entre agentes...
            </Typography>
            <CircularProgress
              sx={{
                marginRight: "auto",
                marginLeft: "auto",
              }}
            />
          </Stack>
        ) : (
          <Stack spacing={2}>
            <Typography align="center">
              Para solicitar el certificado, debe establecer primero una
              conexión con el agente de la policía.
            </Typography>
            <Button variant="outlined" onClick={stablishConnection}>
              Establecer conexión
            </Button>
          </Stack>
        );
      case 1:
        return requestingCertificate ? (
          <Stack sx={{ mb: 5 }} alignItems="center">
            <Typography variant="h4" gutterBottom>
              Se ha enviado una propuesta de certificado. Espere hasta que una
              oferta sea recibida.
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
            <Grid item xs={6}>
              <SubCard title={"ID de la conexión: " + academyConnectionId}>
                <Stack
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ width: "100%" }}
                  spacing={2}
                >
                  <Typography align="center" variant="subtitle2">
                    Rellene los siguientes campos y pulse el botón 'Solicitar'
                    para solicitar el certificado.
                  </Typography>

                  <TextField
                    select
                    fullWidth
                    value={language}
                    label="Idioma"
                    onChange={(event) => {
                      setLanguage(event.target.value);
                      setLanguageId(LANGUAGE_MAP[event.target.value]);
                    }}
                  >
                    <MenuItem key={1} value={"english"}>
                      Inglés
                    </MenuItem>
                    <MenuItem key={2} value={"french"}>
                      Francés
                    </MenuItem>
                    <MenuItem key={3} value={"spanish"}>
                      Español
                    </MenuItem>
                  </TextField>
                  <TextField
                    fullWidth
                    value={languageId}
                    disabled
                    label="ID del Idioma (El que aparece en la credencial)"
                  />

                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={requestCertificate}
                  >
                    Solicitar
                  </Button>
                </Stack>
              </SubCard>
            </Grid>
          </MyGrid>
        );
      case 2:
        return acceptingOffer ? (
          <Stack sx={{ mb: 5 }} alignItems="center">
            <Typography variant="h4" gutterBottom>
              Se ha aceptado la oferta sea recibida. Esperando el certificado...
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
            <Grid item xs={6}>
              <SubCard title={"ID de la conexión: " + academyConnectionId}>
                <Stack
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ width: "100%" }}
                  spacing={2}
                >
                  <Typography align="center" variant="subtitle2">
                    La oferta recibida es la siguiente.
                  </Typography>

                  <TextField
                    select
                    fullWidth
                    value={language}
                    label="Idioma"
                    onChange={(event) => {
                      setLanguage(event.target.value);
                      setLanguageId(LANGUAGE_MAP[event.target.value]);
                    }}
                  >
                    <MenuItem key={1} value={"english"}>
                      Inglés
                    </MenuItem>
                    <MenuItem key={2} value={"french"}>
                      Francés
                    </MenuItem>
                    <MenuItem key={3} value={"spanish"}>
                      Español
                    </MenuItem>
                  </TextField>
                  <TextField
                    fullWidth
                    disabled
                    value={languageId}
                    label="ID del Idioma (El que aparece en la credencial)"
                    onChange={(event) => {
                      setLanguage(event.target.value);
                    }}
                  />
                  <TextField
                    fullWidth
                    disabled
                    value={score}
                    label="Nota"
                    onChange={(event) => {
                      setScore(event.target.value);
                    }}
                  />

                  <Button fullWidth variant="outlined" onClick={acceptOffer}>
                    Aceptar
                  </Button>
                </Stack>
              </SubCard>
            </Grid>
          </MyGrid>
        );
      case 3:
        return savingCredential ? (
          <Stack sx={{ mb: 5 }} alignItems="center">
            <Typography variant="h4" gutterBottom>
              La credencial se está guardando en su Wallet.
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
            <Grid item xs={6}>
              <SubCard title={"ID de la conexión: " + academyConnectionId}>
                <Stack
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ width: "100%" }}
                  spacing={2}
                >
                  <Typography align="center" variant="subtitle2">
                    Se ha recibido la credencial. Pulse el botón 'Guardar' para
                    guardar la credencial en su Wallet.
                  </Typography>

                  <Button fullWidth variant="outlined" onClick={saveCredential}>
                    Guardar credencial
                  </Button>
                </Stack>
              </SubCard>
            </Grid>
          </MyGrid>
        );
      case 4:
        return (
          <Stack sx={{ mb: 5 }} alignItems="center">
            <Typography variant="h4" gutterBottom>
              La credencial se ha guardado con éxito en su Wallet.
            </Typography>
          </Stack>
        );
      default:
        break;
    }
  };

  return (
    <>
      <MainCard
        title="Solicitud de certificado 'Cerfificado Idiomas'"
        secondary={<></>}
      >
        {renderStep()}{" "}
      </MainCard>
    </>
  );
}
