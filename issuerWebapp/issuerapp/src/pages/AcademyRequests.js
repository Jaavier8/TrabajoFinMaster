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
import { ACADEMY_ISSUER } from "constants/constants";
import { SEND_OFFER_ACADEMY } from "constants/jsonBodys";

const MyGrid = styled(Grid)(({ theme }) => ({
  gridAutoRows: "1fr",
  justifyContent: "center",
}));

const gridSpacing = 3;

export default function AcademyRequests(props) {

  const [credReq, setCredReq] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  useEffect(() => {
    async function getCredentialRequests() {
      setLoadingRequests(true);
      const credReqRes = await fetch(
        `${ACADEMY_ISSUER}/issue-credential-2.0/records`
      );
      if (credReqRes.status === 200) {
        const credReqResJson = await credReqRes.json();

        setCredReq(credReqResJson["results"]);

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
      `${ACADEMY_ISSUER}/issue-credential-2.0/records`
    );
    if (credReqRes.status === 200) {
      const credReqResJson = await credReqRes.json();

      setCredReq(credReqResJson["results"]);

      await new Promise((r) => setTimeout(r, 2000));

      setLoadingRequests(false);
    } else {
      console.log("Error al obtener las solicitudes de credenciales");
    }
  };

  const sendOffer = async (credExId, language, score) => {
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

    const sendOffer = await fetch(
      `${ACADEMY_ISSUER}/issue-credential-2.0/records/${credExId}/send-offer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          SEND_OFFER_ACADEMY(
            language,
            score,
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

  const issueCredential = async (credExId) => {
    const issueCred = await fetch(
      `${ACADEMY_ISSUER}/issue-credential-2.0/records/${credExId}/issue`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: "" }),
      }
    );
    if (issueCred.status === 200) {
      reloadCredentialRequests();
    } else {
      console.log("Error expediendo credencial");
    }
  };

  const formatAttributes = (attrs) => {
    let result = {};
    for (const attr of attrs) {
      result[attr["name"]] = attr["value"];
    }
    return result;
  };

  const renderStep = (state, attributes, credExId) => {
    switch (state) {
      case "proposal-received":
        return (
          <>
            <TextField
              fullWidth
              disabled
              value={attributes["language"]}
              label="Idioma"
              onChange={(event) => {
                return;
              }}
            />
            <TextField
              fullWidth
              disabled
              value={attributes["score"]}
              label="Nota"
              onChange={(event) => {
                return;
              }}
            />
            <Button
              fullWidth
              variant="outlined"
              onClick={() =>
                sendOffer(
                  credExId,
                  attributes.language,
                  attributes.score
                )
              }
            >
              Enviar Oferta
            </Button>
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
              onClick={() => issueCredential(credExId)}
            >
              Expedir credencial
            </Button>
          </>
        );
      default:
        break;
    }
  };

  return (
    <>
      <MainCard title="Solicitudes de credenciales" secondary={<></>}>
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
                  <SubCard title={"Estado: " + req.cred_ex_record.state}>
                    <Stack
                      direction="column"
                      justifyContent="center"
                      alignItems="flex-start"
                      spacing={2}
                    >
                      {renderStep(
                        req.cred_ex_record.state,
                        formatAttributes(
                          req.cred_ex_record.cred_proposal.credential_preview
                            .attributes
                        ),
                        req.cred_ex_record.cred_ex_id
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
