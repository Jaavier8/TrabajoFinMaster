import { useState, useEffect } from 'react';

// material-ui
import { Grid, Typography, Stack, Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';

// icons
import AddIcon from '@mui/icons-material/Add';

// modals
import NewEventModal from 'components/NewEventModal';
import ImageViewerModal from 'components/ImageViewerModal';

// constants
import { PYBACK } from 'constants/constants';

const StyledImage = styled('img')(({ theme }) => ({
    "&:hover": {
        transform: "scale(1.1)",
    }
}));

const MyGrid = styled(Grid)(({ theme }) => ({
    gridAutoRows: "1fr",
    justifyContent: "center"
}));

const gridSpacing = 3;

export default function Events(props) {
    const [events, setEvents] = useState([]);
    const [eventsPosters, setEventsPosters] = useState({});
    const [showNewEventModal, setShowNewEventModal] = useState(false);

    const [showImageViewerModal, setShowImageViewerModal] = useState(false);
    const [imageSelected, setImageSelected] = useState([]);

    const [loadingEvents, setLoadingEvents] = useState(false);

    useEffect(() => {
        async function getEvents() {
            setLoadingEvents(true);
            const resEvents = await fetch(`${PYBACK}/events`);
            if (resEvents.status === 200) {
                const events = await resEvents.json();

                //Getting posters
                let posters = {};
                for (const event of events) {
                    if (event.posterPath === '') {
                        posters[event._id] = undefined;
                        continue;
                    }
                    const imageRes = await fetch(`${PYBACK}/images/${event._id}/${event.posterPath}`);
                    if (imageRes.status === 200) {
                        const imageBlob = await imageRes.blob();
                        let urlCreator = window.URL || window.webkitURL;
                        let imgUrl = urlCreator.createObjectURL(imageBlob);

                        posters[event._id] = imgUrl;
                    } else if (imageRes.status === 404) {
                        posters[event._id] = undefined;
                    } else {
                        //TODO: error
                    }
                }

                setEvents(events);
                setEventsPosters(posters);

                //TODO: remove
                await new Promise(r => setTimeout(r, 2000));

                setLoadingEvents(false);
            } else {
                console.log('Error al obtener los eventos');
                //TODO: error
            }
        }
        getEvents();
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
                {events.length === 0 ? (
                    <Stack>
                        <Typography align="center">
                            No hay eventos
                        </Typography>
                    </Stack>
                ) : (
                    loadingEvents ? (
                        <Stack sx={{ mb: 5 }} alignItems="center">
                            <Typography variant="h4" gutterBottom>
                                Cargando eventos...
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
                            {events.map((event, index) => {
                                let img = eventsPosters[event._id];
                                return (
                                    <Grid item xs={6} key={index}>
                                        <SubCard title={event.name}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                                                <StyledImage
                                                    src={img}
                                                    alt={event.name}
                                                    onClick={() => {
                                                        setImageSelected(img);
                                                        setShowImageViewerModal(true);
                                                    }}
                                                    height="200"
                                                    width="200"
                                                />
                                                <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{ width: '100%' }}>
                                                    <Typography variant="subtitle1">Fecha</Typography>
                                                    <Typography variant="subtitle2">{event.date}</Typography>
                                                    <Typography variant="subtitle1">Lugar</Typography>
                                                    <Typography variant="subtitle2">{event.location}</Typography>
                                                    <Typography variant="subtitle1">Información</Typography>
                                                    <Typography variant="subtitle2">{event.description}</Typography>
                                                </Stack>
                                            </Stack>
                                        </SubCard>
                                    </Grid>
                                )
                            })}
                        </MyGrid>
                    ))
                }
            </MainCard>

            <NewEventModal
                show={showNewEventModal}
                onClose={() => setShowNewEventModal(false)}
                onAddEvent={(event, eventPoster) => {
                    setEvents([...events, event]);
                    setEventsPosters({
                        ...eventsPosters,
                        [event._id]: eventPoster
                    });
                }}
            />

            <ImageViewerModal
                show={showImageViewerModal}
                onClose={() => setShowImageViewerModal(false)}
                images={[imageSelected]}
                currentImage={0} // 0 because in this case there is only one image
            />

        </>
    );
}
