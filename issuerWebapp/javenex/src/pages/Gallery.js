import { useState, useEffect } from 'react';

// material-ui
import { Grid, Typography, Stack, Divider, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';

import FileUpload from 'react-mui-fileuploader';

// icons
import AddIcon from '@mui/icons-material/Add';

// modals
import UploadImagesModal from 'components/UploadImagesModal ';
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

export default function Gallery(props) {
    const [events, setEvents] = useState([]);
    const [eventsPreImages, setEventsPreImages] = useState({});

    const [showUploadImagesModal, setShowUploadImagesModal] = useState(false);

    const [showImageViewerModal, setShowImageViewerModal] = useState(false);
    const [imagesSelected, setImagesSelected] = useState([]);
    const [imageIndexSelected, setImageIndexSelected] = useState(0);

    const [eventSelected, setEventSelected] = useState(null);
    const [eventSelectedImages, setEventSelectedImages] = useState([]);

    useEffect(() => {
        async function getEvents() {
            const resEvents = await fetch(`${PYBACK}/events`);
            if (resEvents.status === 200) {
                const events = await resEvents.json();
                setEvents(events);
            } else {
                console.log('Error al obtener los eventos');
                //TODO: error
            }
        }
        getEvents();
    }, []);

    useEffect(() => {
        async function getEventsPreImages() {
            let images = {};
            for (const event of events) {
                let eventImages = [];
                if (event.imagesPath.length === 0) {
                    images[event._id] = eventImages;
                    continue;
                }
                if (event.imagesPath.length > 6) {
                    for (var i = 0; i < 5; i++) {
                        const imageRes = await fetch(`${PYBACK}/images/${event._id}/${event.imagesPath[i]}`);
                        if (imageRes.status === 200) {
                            const imageBlob = await imageRes.blob();
                            let urlCreator = window.URL || window.webkitURL;
                            let imgUrl = urlCreator.createObjectURL(imageBlob);

                            eventImages.push(imgUrl);
                        } else {
                            //Nothing to do
                        }
                    }
                } else {
                    for (const imagePath of event.imagesPath) {
                        const imageRes = await fetch(`${PYBACK}/images/${event._id}/${imagePath}`);
                        if (imageRes.status === 200) {
                            const imageBlob = await imageRes.blob();
                            let urlCreator = window.URL || window.webkitURL;
                            let imgUrl = urlCreator.createObjectURL(imageBlob);

                            eventImages.push(imgUrl);
                        } else {
                            //Nothing to do
                        }
                    }
                }
                images[event._id] = eventImages;
            }
            setEventsPreImages(images);
        }

        if (events.length !== 0) {
            getEventsPreImages();
        }
    }, [events]);

    useEffect(() => {
        async function getEventImages() {
            let images = [];
            for (const imagePath of eventSelected.imagesPath) {
                const imageRes = await fetch(`${PYBACK}/images/${eventSelected._id}/${imagePath}`);
                if (imageRes.status === 200) {
                    const imageBlob = await imageRes.blob();
                    let urlCreator = window.URL || window.webkitURL;
                    let imgUrl = urlCreator.createObjectURL(imageBlob);

                    images.push(imgUrl);
                } else {
                    //Nothing to do
                }
            }
            setEventSelectedImages(images);
        }

        if (eventSelected) {
            getEventImages();
        }
    }, [eventSelected]);

    return (
        <>
            <MainCard
                title="Galería"
                secondary={
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setShowUploadImagesModal(true)}
                    >
                        Subir imágenes
                    </Button>
                }
            >
                {events.length === 0 ? (
                    <Stack>
                        <Typography align="center">
                            No hay imágenes
                        </Typography>
                    </Stack>
                ) : (
                    <MyGrid container spacing={gridSpacing}>
                        {eventSelected ? (
                            <Grid item xs={12}>
                                <SubCard
                                    title={"Imágenes de " + eventSelected.name}
                                    secondary={
                                        <Button
                                            variant="outlined"
                                            onClick={() => setEventSelected(null)}
                                        >
                                            Volver a galería
                                        </Button>
                                    }
                                >
                                    <MyGrid container spacing={gridSpacing}>
                                        {eventSelectedImages && eventSelectedImages.map((image, index) => {
                                            return (
                                                <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
                                                    <Stack justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
                                                        <StyledImage
                                                            src={image}
                                                            alt={eventSelected.name}
                                                            style={{ maxWidth: '100%' }}
                                                            onClick={() => {
                                                                setImagesSelected(eventSelectedImages);
                                                                setImageIndexSelected(index);
                                                                setShowImageViewerModal(true);
                                                            }}
                                                        />
                                                    </Stack>
                                                </Grid>
                                            )
                                        })}
                                    </MyGrid>
                                </SubCard>
                            </Grid>
                        ) : (
                            <>
                                {events.map((event, index) => {
                                    return (
                                        <Grid item xs={12} key={index}>
                                            <SubCard title={event.name}>
                                                {eventsPreImages[event._id] && eventsPreImages[event._id].length === 0 ? (
                                                    <Typography variant="h6" align="center">
                                                        No hay imágenes para este evento
                                                    </Typography>
                                                ) : (
                                                    <MyGrid container spacing={gridSpacing}>
                                                        {eventsPreImages[event._id] && eventsPreImages[event._id].map((image, index) => {
                                                            return (
                                                                <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
                                                                    <Stack justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
                                                                        <StyledImage
                                                                            src={image}
                                                                            alt={event.name}
                                                                            style={{ maxWidth: '100%' }}
                                                                            onClick={() => {
                                                                                setImagesSelected(eventsPreImages[event._id]);
                                                                                setImageIndexSelected(index);
                                                                                setShowImageViewerModal(true);
                                                                            }}
                                                                        />
                                                                    </Stack>
                                                                </Grid>
                                                            )
                                                        })}
                                                        {event.imagesPath.length > 6 && (
                                                            <Grid item xs={12} sm={6} md={4} lg={2}>
                                                                <Stack justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
                                                                    <Button
                                                                        variant="text"
                                                                        onClick={() => setEventSelected(event)}
                                                                    >
                                                                        Ver más
                                                                    </Button>
                                                                </Stack>
                                                            </Grid>
                                                        )}
                                                    </MyGrid>
                                                )}
                                            </SubCard>
                                        </Grid>
                                    )
                                })}
                            </>
                        )}
                    </MyGrid>
                )}
            </MainCard >

            <UploadImagesModal
                show={showUploadImagesModal}
                onClose={() => setShowUploadImagesModal(false)}
                events={events}
                onUpdateEvent={(updateEvent) => {
                    setEvents((prevState) => {
                        return prevState.map((event) => {
                            if (event._id === updateEvent._id) {
                                return updateEvent;
                            } else {
                                return event;
                            }
                        });
                    });
                }}
            />

            <ImageViewerModal
                show={showImageViewerModal}
                onClose={() => setShowImageViewerModal(false)}
                images={imagesSelected}
                currentImage={imageIndexSelected}
            />

        </>
    );
}
