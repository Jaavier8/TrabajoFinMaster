import { useState, useEffect } from "react";

// material-ui
import {
  Grid,
  Typography,
  Stack,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// project imports
import SubCard from "components/SubCard";
import MainCard from "components/MainCard";

// constants
import {
  VERIFIER,
  HOLDER,
  POLICE_ISSUER,
  ACADEMY_ISSUER,
  UNIVERSITY_ISSUER,
} from "constants/constants";
import { SEND_PROOF_REQUEST, SEND_PRESENTATION } from "constants/jsonBodys";

// icon
import BookIcon from "@mui/icons-material/Book";

const MyGrid = styled(Grid)(({ theme }) => ({
  gridAutoRows: "1fr",
  justifyContent: "center",
}));

const gridSpacing = 3;

export default function VerifyCredential(props) {
  const [passportCredential, setPassportCredential] = useState("");
  const [certificateCredential, setCertificateCredential] = useState("");
  const [degreeCredential, setDegreeCredential] = useState("");

  const [activeStep, setActiveStep] = useState(0);

  const [loadingConnections, setLoadingConnections] = useState(false);
  const [stablishingConnection, setStablishingConnection] = useState(false);
  const [sendingPresentation, setSendingPresentation] = useState(false);
  const [holderConnectionId, setHolderConnectionId] = useState("");
  const [verifierConnectionId, setVerifierConnectionId] = useState("");

  useEffect(() => {
    async function getConnections() {
      setLoadingConnections(true);
      const resConn = await fetch(`${HOLDER}/connections`);
      if (resConn.status === 200) {
        const conn = await resConn.json();

        for (const connection of conn["results"]) {
          if (connection["their_label"] === "verifier") {
            setHolderConnectionId(connection["connection_id"]);

            const resConn = await fetch(`${VERIFIER}/connections`);
            if (resConn.status === 200) {
              const conn = await resConn.json();

              for (const connection of conn["results"]) {
                if (connection["their_label"] === "holder") {
                  setVerifierConnectionId(connection["connection_id"]);
                }
              }
            }

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
      `${VERIFIER}/connections/create-invitation`,
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
      setVerifierConnectionId(createConnJson["connection_id"]);

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
        setHolderConnectionId(receiveConnJson["connection_id"]);

        let newActiveStep = activeStep + 1;
        setActiveStep(newActiveStep);
      } else {
        console.log("Error");
      }

      await new Promise((r) => setTimeout(r, 2000));

      setStablishingConnection(false);
    } else {
      console.log("Error al obtener las conexiones");
    }
  };

  const sendProofRequest = async () => {
    //Get creed_def_ids
    const passportCredIdRes = await fetch(
      `${POLICE_ISSUER}/credential-definitions/created`
    );
    const passportCredIdJson = await passportCredIdRes.json();
    const passportCredId = passportCredIdJson["credential_definition_ids"][0];
    const certificateCredIdRes = await fetch(
      `${ACADEMY_ISSUER}/credential-definitions/created`
    );
    const certificateCredIdJson = await certificateCredIdRes.json();
    const certificateCredId =
      certificateCredIdJson["credential_definition_ids"][0];
    const degreeCredIdRes = await fetch(
      `${UNIVERSITY_ISSUER}/credential-definitions/created`
    );
    const degreeCredIdJson = await degreeCredIdRes.json();
    const degreeCredId = degreeCredIdJson["credential_definition_ids"][0];

    //Proof request verifier
    console.log(verifierConnectionId);
    const proofReqRes = await fetch(`${VERIFIER}/present-proof/send-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        SEND_PROOF_REQUEST(
          verifierConnectionId,
          Math.floor(Date.now() / 1000),
          Math.floor(
            new Date().setFullYear(new Date().getFullYear() - 25) / 1000
          ),
          passportCredId,
          certificateCredId,
          degreeCredId
        )
      ),
    });
    if (proofReqRes.status === 200) {
      //Nothing to do
      await new Promise((r) => setTimeout(r, 3000));
    } else {
      console.log("Error al solicitar certificado");
      //TODO: error
    }
  };

  const sendPresentation = async () => {
    //Proof records holder
    setSendingPresentation(true);

    await sendProofRequest();

    const proofRecordsRes = await fetch(`${HOLDER}/present-proof/records`);
    if (proofRecordsRes.status === 200) {
      const proofRecordsResJson = await proofRecordsRes.json();

      let presExId = "";
      for (const proof of proofRecordsResJson["results"]) {
        if (proof.state === "request_received") {
          presExId = proof.presentation_exchange_id;
          break;
        }
      }

      const sendPresRes = await fetch(
        `${HOLDER}/present-proof/records/${presExId}/send-presentation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            SEND_PRESENTATION(
              Math.floor(Date.now() / 1000),
              certificateCredential,
              passportCredential,
              degreeCredential
            )
          ),
        }
      );
      if (sendPresRes.status === 200) {
        await new Promise((r) => setTimeout(r, 2000));

        setSendingPresentation(false);

        let newActiveStep = activeStep + 1;
        setActiveStep(newActiveStep);
      } else {
        let newActiveStep = activeStep + 2;
        setActiveStep(newActiveStep);
      }
    } else {
      console.log("Error");
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
              Para solicitar el trabajo, debe establecer primero una conexión
              con el agente de la empresa.
            </Typography>
            <Button variant="outlined" onClick={stablishConnection}>
              Establecer conexión
            </Button>
          </Stack>
        );
      case 1:
        return sendingPresentation ? (
          <Stack sx={{ mb: 5 }} alignItems="center">
            <Typography variant="h4" gutterBottom>
              Se están enviando los datos...
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
              <SubCard
                title={
                  <Typography variant="h5" align="center">
                    {"ID de la conexión: " + holderConnectionId}
                  </Typography>
                }
              >
                <Stack
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ width: "100%" }}
                  spacing={2}
                >
                  <Typography align="center" variant="subtitle2">
                    Para optar al trabajo, tiene que demonstrar que posee el
                    título universitario de 'Ingeniería en Telecomunicaciones' o
                    'Ingeniería de Datos' con una nota media mayor a 8,5, que
                    tiene un nivel B2 de inglés (puntuación mayor que 80), y que
                    tiene más de 25 años.
                  </Typography>
                  <br />
                  <Typography align="center" variant="subtitle2">
                    Introduzca el ID de la credencial con la que quiere validar
                    cada uno de los requisitos. Además de lo anterior, la
                    empresa tiene que tener acceso a su nombre, apellido, número
                    de identificación, y grado que ha estudiado.
                  </Typography>

                  <TextField
                    fullWidth
                    label="Identificador de la credencial que verifique la mayoría de edad"
                    onChange={(event) => {
                      setPassportCredential(event.target.value);
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Identificador de la credencial que verifique el nivel de inglés"
                    onChange={(event) => {
                      setCertificateCredential(event.target.value);
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Identificador de la credencial que verifique los estudios"
                    onChange={(event) => {
                      setDegreeCredential(event.target.value);
                    }}
                  />

                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={sendPresentation}
                  >
                    Enviar
                  </Button>
                </Stack>
              </SubCard>
            </Grid>
          </MyGrid>
        );
      case 2:
        return (
          <MyGrid container spacing={gridSpacing}>
            <Grid item xs={6}>
              <SubCard
                title={
                  <Typography variant="h5" align="center">
                    {"ID de la conexión: " + holderConnectionId}
                  </Typography>
                }
              >
                <Stack
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ width: "100%" }}
                  spacing={2}
                >
                  <Typography align="center" variant="subtitle2">
                    Se han enviado los datos.
                  </Typography>
                </Stack>
              </SubCard>
            </Grid>
          </MyGrid>
        );
      case 3:
        return (
          <MyGrid container spacing={gridSpacing}>
            <Grid item xs={6}>
              <SubCard
                title={
                  <Typography variant="h5" align="center">
                    {"ID de la conexión: " + holderConnectionId}
                  </Typography>
                }
              >
                <Stack
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ width: "100%" }}
                  spacing={2}
                >
                  <Typography align="center" variant="subtitle2">
                    No puedes optar al puesto de trabajo porque no cumples los
                    requisitos.
                  </Typography>
                </Stack>
              </SubCard>
            </Grid>
          </MyGrid>
        );
      default:
        break;
    }
  };

  return (
    <>
      <MainCard
        title="Solicitud de puesto de trabajo"
        secondary={
          <Button
            variant="contained"
            startIcon={<BookIcon />}
            onClick={() =>
              window.open("http://localhost:3001/wallet", "_blank")
            }
          >
            Consultar Credenciales
          </Button>
        }
      >
        {renderStep()}{" "}
      </MainCard>
    </>
  );
}
