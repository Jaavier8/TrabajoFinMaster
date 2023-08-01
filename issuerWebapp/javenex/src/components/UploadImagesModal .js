import React, { useState } from 'react';
// Material
import { Container, Typography, Stack, Modal, TextField, Divider, MenuItem, Step, StepLabel, CircularProgress, Button } from '@mui/material';
import { LoadingButton } from "@mui/lab";

import Cross from './Cross';
import { styled, useTheme } from '@mui/material/styles';

import { useFormik, Form, FormikProvider } from "formik";

import FileUpload from 'react-mui-fileuploader';

const RootStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    border: '2px solid',
    borderColor: theme.palette.primary.main,
    borderRadius: 16,
    boxShadow: 24,
    backgroundColor: 'white'
}));

const MyContainer = styled(Container)(({ theme }) => ({
    position: 'relative',
    maxWidth: 480,
    margin: 15,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
}));

export default function UploadImagesModal(props) {
    const theme = useTheme();
    const { show, onClose, events, onUpdateEvent } = props;

    const [eventSelected, setEventSelected] = useState("");
    const [imagesFiles, setImagesFiles] = useState([]);
    const [uploadingImages, setUploadingImages] = useState(false);

    const setDefaultValues = () => {
        setEventSelected("");
        setImagesFiles([]);
        setUploadingImages(false);
    }

    const handleFilesChange = (files) => {
        setImagesFiles(files);
    };

    const menuItemEvents = () => {
        return events.map((event, index) => {
            return (
                <MenuItem key={index} value={event._id}>
                    {event.name}
                </MenuItem>
            )
        })
    }

    return (
        <>
            <Modal
                open={show}
                onClose={() => {
                    onClose();
                    setDefaultValues();
                }}
                onBackdropClick={() => {
                    onClose();
                    setDefaultValues();
                }}
            >
                <RootStyle>
                    <MyContainer>
                        <Stack sx={{ mb: 2 }}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Typography variant="h4" gutterBottom>
                                    Subir imágenes
                                </Typography>
                                <Cross
                                    onClick={() => {
                                        onClose();
                                        setDefaultValues();
                                    }}
                                />
                            </Stack>
                            <Typography sx={{ color: 'text.secondary' }}>A continuación podrá subir imágenes de un evento.</Typography>
                        </Stack>

                        <Divider sx={{ my: 2, opacity: 1, borderColor: theme.palette.primary.main }} />

                        {uploadingImages ? (
                            <Stack sx={{ mb: 5 }} alignItems="center">
                                <Typography variant="h4" gutterBottom>
                                    Subiendo imágenes...
                                </Typography>
                                <CircularProgress
                                    sx={{
                                        marginRight: "auto",
                                        marginLeft: "auto",
                                    }}
                                />
                            </Stack>
                        ) : (
                            <>
                                <Step active={true} index={0}>
                                    <StepLabel>
                                        Selecciona el evento del que quiere subir imágenes.
                                    </StepLabel>
                                </Step>

                                <TextField
                                    fullWidth
                                    select
                                    label="Evento"
                                    value={eventSelected}
                                    onChange={(event) => setEventSelected(event.target.value)}
                                    sx={{ my: 2 }}
                                >
                                    {menuItemEvents()}
                                </TextField>

                                {eventSelected !== "" && (
                                    <>
                                        <Step sx={{ mb: 2 }} active={true} index={1}>
                                            <StepLabel>
                                                Seleccione las imágenes que desea subir.
                                            </StepLabel>
                                        </Step>

                                        <FileUpload
                                            multiFile={false}
                                            title="Imágenes del evento"
                                            showPlaceholderImage={false}
                                            header="Arrastre los archivo aquí"
                                            leftLabel="o"
                                            buttonLabel="Pulse aquí"
                                            rightLabel="para seleccionar los archivos"
                                            onFilesChange={handleFilesChange}
                                        />

                                        <Stack sx={{ mt: 2 }} direction="row">
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                onClick={async() => {
                                                    setUploadingImages(true);
                                                    let updatedEvent = {};
                                                    for (const imageFile of imagesFiles) {
                                                        const formData = new FormData();
                                                        formData.append('file', imageFile);
                                                        let request = new XMLHttpRequest();
                                                        request.open('POST', `/images/${eventSelected}`);
                                                        request.send(formData);

                                                        request.onload = function () {
                                                            if (request.status === 200) {
                                                                updatedEvent = JSON.parse(request.response);
                                                            } else {
                                                                //TODO: nothing to do
                                                            }
                                                        }
                                                    }

                                                    //TODO: remove
                                                    await new Promise(r => setTimeout(r, 2000));

                                                    onUpdateEvent(updatedEvent);
                                                    onClose();
                                                    setDefaultValues();
                                                    setUploadingImages(false);
                                                }}
                                            >
                                                Subir imágenes
                                            </Button>
                                        </Stack>
                                    </>
                                )}
                            </>
                        )}

                    </MyContainer>
                </RootStyle>
            </Modal>

        </>
    );
}

