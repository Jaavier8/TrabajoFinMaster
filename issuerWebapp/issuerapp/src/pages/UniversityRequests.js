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
import { UNIVERSITY_ISSUER } from "constants/constants";
import { SEND_OFFER_UNIVERSITY } from "constants/jsonBodys";

// icon
import RefreshIcon from "@mui/icons-material/Refresh";

const MyGrid = styled(Grid)(({ theme }) => ({
  gridAutoRows: "1fr",
  justifyContent: "center",
}));

const gridSpacing = 3;

const DEGREE_MAP = {
  "Ingeniería en Telecomunicaciones": {
    id: "1",
    school: "ETSIT",
    schoolId: "1",
  },
  "Ingeniería de Datos": { id: "2", school: "ETSIT", schoolId: "1" },
  "Ingeniería Informática": { id: "3", school: "ETSIINF", schoolId: "2" },
  "Ingeniería Industrial": { id: "4", school: "ETSII", schoolId: "3" },
};

export default function UniversityRequests(props) {
  const [attributes, setAttributes] = useState({});

  const [credReq, setCredReq] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const addAttributes = (credReq) => {
    let result = {};
    for (const req of credReq) {
      const attrs =
        req.cred_ex_record.cred_proposal.credential_preview.attributes;
      if (!result[req["cred_ex_record"]["cred_ex_id"]]) {
        result[req["cred_ex_record"]["cred_ex_id"]] = {};
      }
      for (const attr of attrs) {
        result[req["cred_ex_record"]["cred_ex_id"]][attr["name"]] =
          attr["value"];
      }
    }
    setAttributes(result);
  };

  useEffect(() => {
    async function getCredentialRequests() {
      setLoadingRequests(true);
      const credReqRes = await fetch(
        `${UNIVERSITY_ISSUER}/issue-credential-2.0/records`
      );
      if (credReqRes.status === 200) {
        const credReqResJson = await credReqRes.json();
        const credReq = credReqResJson["results"];

        setCredReq(credReq);
        addAttributes(credReq);

        await new Promise((r) => setTimeout(r, 2000));

        setLoadingRequests(false);
      } else {
        console.log("Error al obtener las solicitudes de credenciales");
      }
    }
    getCredentialRequests();
  }, []);

  const reloadCredentialRequests = async () => {
    setLoadingRequests(true);
    const credReqRes = await fetch(
      `${UNIVERSITY_ISSUER}/issue-credential-2.0/records`
    );
    if (credReqRes.status === 200) {
      const credReqResJson = await credReqRes.json();
      const credReq = credReqResJson["results"];

      setCredReq(credReq);
      addAttributes(credReq);

      await new Promise((r) => setTimeout(r, 2000));

      setLoadingRequests(false);
    } else {
      console.log("Error al obtener las solicitudes de credenciales");
    }
  };

  const sendOffer = async (
    credExId,
    degree,
    degreeId,
    school,
    schoolId,
    finalGrade
  ) => {
    //Get credId
    const credIdRes = await fetch(
      `${UNIVERSITY_ISSUER}/credential-definitions/created`
    );
    const credIdResJson = await credIdRes.json();
    const credId = credIdResJson["credential_definition_ids"][0];

    //Get schemaId and version
    const schemaIdRes = await fetch(`${UNIVERSITY_ISSUER}/schemas/created`);
    const schemaIdResJson = await schemaIdRes.json();
    const schemaId = schemaIdResJson["schema_ids"][0];

    const sendOffer = await fetch(
      `${UNIVERSITY_ISSUER}/issue-credential-2.0/records/${credExId}/send-offer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          SEND_OFFER_UNIVERSITY(
            degree,
            degreeId,
            school,
            schoolId,
            finalGrade,
            credId,
            schemaId,
            schemaId.slice(-3)
          )
        ),
      }
    );
    if (sendOffer.status === 200) {
      reloadCredentialRequests();
    } else {
      console.log("Error enviando oferta");
    }
  };

  const issueCredential = async (credExId, connId) => {
    const issueCred = await fetch(
      `${UNIVERSITY_ISSUER}/issue-credential-2.0/records/${credExId}/issue`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: "" }),
      }
    );
    if (issueCred.status === 200) {
      let universityCredentials =
        JSON.parse(localStorage.getItem("universityCredentials")) || [];
      universityCredentials.push({
        connId,
        credExId,
        attrs: attributes[credExId],
      });
      localStorage.setItem(
        "universityCredentials",
        JSON.stringify(universityCredentials)
      );
      reloadCredentialRequests();
    } else {
      console.log("Error expediendo credencial");
    }
  };

  const deleteReq = async (credExId) => {
    const deleteReq = await fetch(
      `${UNIVERSITY_ISSUER}/issue-credential-2.0/records/${credExId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (deleteReq.status === 200) {
      reloadCredentialRequests();
    } else {
      console.log("Error eliminando");
    }
  };

  const renderStep = (state, credExId, connId) => {
    switch (state) {
      case "proposal-received":
        return (
          <>
            <TextField
              select
              fullWidth
              value={attributes[credExId].degree}
              label="Grado"
              onChange={(event) => {
                setAttributes((prevState) => ({
                  ...prevState,
                  [credExId]: {
                    ...prevState[credExId],
                    degree: event.target.value,
                    degreeid: DEGREE_MAP[event.target.value]["id"],
                    school: DEGREE_MAP[event.target.value]["school"],
                    schoolid: DEGREE_MAP[event.target.value]["schoolId"],
                  },
                }));
              }}
            >
              <MenuItem key={1} value={"Ingeniería en Telecomunicaciones"}>
                Ingeniería en Telecomunicaciones
              </MenuItem>
              <MenuItem key={2} value={"Ingeniería de Datos"}>
                Ingeniería de Datos
              </MenuItem>
              <MenuItem key={3} value={"Ingeniería Informática"}>
                Ingeniería Informática
              </MenuItem>
              <MenuItem key={4} value={"Ingeniería Industrial"}>
                Ingeniería Industrial
              </MenuItem>
            </TextField>
            <TextField
              fullWidth
              disabled
              value={attributes[credExId].school}
              label="Escuela"
            />
            <TextField
              fullWidth
              value={attributes[credExId].finalgrade}
              label="Nota final (sobre 100 y sin decimales)"
              onChange={(event) => {
                setAttributes((prevState) => ({
                  ...prevState,
                  [credExId]: {
                    ...prevState[credExId],
                    finalgrade: event.target.value,
                  },
                }));
              }}
            />
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
              sx={{ width: "100%" }}
            >
              <Button
                fullWidth
                variant="outlined"
                onClick={() => deleteReq(credExId)}
              >
                Eliminar
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() =>
                  sendOffer(
                    credExId,
                    attributes[credExId].degree,
                    attributes[credExId].degreeid,
                    attributes[credExId].school,
                    attributes[credExId].schoolid,
                    attributes[credExId].finalgrade
                  )
                }
              >
                Enviar Oferta
              </Button>
            </Stack>
          </>
        );
      case "offer-sent":
        return (
          <Typography align="center">
            Se ha enviado la oferta, esperando respuesta.
          </Typography>
        );
      case "request-received":
        return (
          <>
            <Typography align="center">
              Se ha aceptado la oferta. Pulsa el siguiente botón para expedir la
              credencial.
            </Typography>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => issueCredential(credExId, connId)}
            >
              Expedir credencial
            </Button>
          </>
        );
      default:
        break;
    }
  };

  const getState = (state) => {
    switch (state) {
      case "proposal-received":
        return "Propuesta Recibida";
      case "offer-sent":
        return "Oferta Enviada";
      case "request-received":
        return "Petición Recibida";
      case "credential-issued":
        return "Credencial Emitida";
      default:
        return "Estado Desconocido";
    }
  };

  return (
    <>
      <MainCard
        title="Solicitudes de credenciales"
        secondary={
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={() => reloadCredentialRequests()}
          >
            Recargar
          </Button>
        }
      >
        {credReq.length === 0 ? (
          <Stack>
            <Typography align="center">
              No hay solicitudes de credenciales
            </Typography>
          </Stack>
        ) : loadingRequests ? (
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
            {credReq.map((req, index) => {
              return (
                <Grid item xs={6} key={index}>
                  <SubCard
                    title={
                      <>
                        {"Estado: " + getState(req.cred_ex_record.state)}
                        <br />
                        {"ID de la conexión: " +
                          req.cred_ex_record.connection_id}
                      </>
                    }
                  >
                    <Stack
                      direction="column"
                      justifyContent="center"
                      alignItems="center"
                      spacing={2}
                    >
                      {renderStep(
                        req.cred_ex_record.state,
                        req.cred_ex_record.cred_ex_id,
                        req.cred_ex_record.connection_id
                      )}
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
