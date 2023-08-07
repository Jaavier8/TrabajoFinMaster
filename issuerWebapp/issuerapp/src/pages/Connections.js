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

// icons
import AddIcon from "@mui/icons-material/Add";

// modals
import NewEventModal from "components/NewEventModal";

// constants
import { POLICE_ISSUER } from "constants/constants";

const StyledImage = styled("img")(({ theme }) => ({
  "&:hover": {
    transform: "scale(1.1)",
  },
}));

const MyGrid = styled(Grid)(({ theme }) => ({
  gridAutoRows: "1fr",
  justifyContent: "center",
}));

const gridSpacing = 3;

export default function Connections(props) {
  const [conn, setConn] = useState([]);
  const [connPosters, setConnPosters] = useState({});
  const [showNewEventModal, setShowNewEventModal] = useState(false);

  const [showImageViewerModal, setShowImageViewerModal] = useState(false);
  const [imageSelected, setImageSelected] = useState([]);

  const [loadingConnections, setLoadingConnections] = useState(false);

  useEffect(() => {
    async function getConnections() {
      setLoadingConnections(true);
      const resConn = await fetch(`${POLICE_ISSUER}/connections`);
      if (resConn.status === 200) {
        const conn = await resConn.json();

        setConn(conn["results"]);
        console.log(conn["results"]);

        await new Promise((r) => setTimeout(r, 2000));

        setLoadingConnections(false);
      } else {
        console.log("Error al obtener las conexiones");
        //TODO: error
      }
    }
    getConnections();
  }, []);

  return (
    <>
      <MainCard
        title="Eventos"
        secondary={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowNewEventModal(true)}
          >
            Añadir evento
          </Button>
        }
      >
        {conn.length === 0 ? (
          <Stack>
            <Typography align="center">No hay conexiones</Typography>
          </Stack>
        ) : loadingConnections ? (
          <Stack sx={{ mb: 5 }} alignItems="center">
            <Typography variant="h4" gutterBottom>
              Cargando conexiones...
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
            {conn.map((conn, index) => {
              return (
                <Grid item xs={6} key={index}>
                  <SubCard title={"Conexión " + index}>
                    <Stack
                      direction="column"
                      justifyContent="center"
                      alignItems="flex-start"
                      spacing={2}
                    >
                      {Object.keys(conn).map((key, ind) => {
                        return (
                          <>
                            <Typography variant="subtitle1">
                              {key + ": " + conn[key]}
                            </Typography>
                          </>
                        );
                      })}
                    </Stack>
                  </SubCard>
                </Grid>
              );
            })}
          </MyGrid>
        )}
      </MainCard>

      <NewEventModal
        show={showNewEventModal}
        onClose={() => setShowNewEventModal(false)}
        onAddEvent={(event, eventPoster) => {
          setConn([...conn, event]);
          setConnPosters({
            ...connPosters,
            [event._id]: eventPoster,
          });
        }}
      />
    </>
  );
}
