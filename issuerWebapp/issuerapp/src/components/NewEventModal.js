import React, { useState } from "react";
// Material
import {
  Container,
  Typography,
  Stack,
  Modal,
  TextField,
  Divider,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import Cross from "./Cross";
import { styled, useTheme } from "@mui/material/styles";

// Yup
import * as Yup from "yup";

import { useFormik, Form, FormikProvider } from "formik";

//constants
import { PYBACK } from "constants/constants";

const RootStyle = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  border: "2px solid",
  borderColor: theme.palette.primary.main,
  borderRadius: 16,
  boxShadow: 24,
  backgroundColor: "white",
}));

const MyContainer = styled(Container)(({ theme }) => ({
  position: "relative",
  maxWidth: 480,
  margin: 15,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
}));

const STEPS = ["Información del evento", "Cartel del evento"];

export default function NewEventModal(props) {
  const theme = useTheme();
  const { show, onClose, onAddEvent } = props;

  const [createdEvent, setCreatedEvent] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [posterFile, setPosterFile] = useState([]);
  const [savingEvent, setSavingEvent] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);

  const setDefaultValues = () => {
    formikEventInformation.resetForm();
    setActiveStep(0);
    setPosterFile([]);
    setSavingEvent(false);
    setUploadingPoster(false);
  };

  const EventInformationSchema = Yup.object().shape({
    eventName: Yup.string()
      .max(30, "La longitud máxima son 30 caracteres")
      .required("Campo obligatorio"),
    eventLocation: Yup.string()
      .max(30, "La longitud máxima son 30 caracteres")
      .required("Campo obligatorio"),
    eventDate: Yup.string()
      .max(30, "La longitud máxima son 30 caracteres")
      .required("Campo obligatorio"),
    eventDescription: Yup.string()
      .max(500, "La longitud máxima son 500 caracteres")
      .required("Campo obligatorio"),
  });

  const formikEventInformation = useFormik({
    initialValues: {
      eventName: "",
      eventLocation: "",
      eventDate: "",
      eventDescription: "",
    },
    enableReinitialize: true,
    validationSchema: EventInformationSchema,
    onSubmit: async (values, actions) => {
      try {
        setSavingEvent(true);
        const createRes = await fetch(`/events/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.eventName,
            location: values.eventLocation,
            date: values.eventDate,
            description: values.eventDescription,
          }),
        });
        if (createRes.status === 201) {
          console.log("Evento creado correctamente");
          const createResJson = await createRes.json();
          setCreatedEvent(createResJson);

          actions.resetForm();

          //TODO: remove
          await new Promise((r) => setTimeout(r, 2000));

          let newActiveStep = activeStep + 1;
          setActiveStep(newActiveStep);

          setSavingEvent(false);
        } else {
          console.log("Error al crear el evento");
        }
      } catch (e) {
        // Nothing to do
      }
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } =
    formikEventInformation;

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
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stepper activeStep={activeStep}>
                {STEPS.map((label) => {
                  return (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              <Cross
                onClick={() => {
                  onClose();
                  setDefaultValues();
                }}
              />
            </Stack>
            <Divider
              sx={{
                my: 2,
                opacity: 1,
                borderColor: theme.palette.primary.main,
              }}
            />
            {savingEvent ? (
              <Stack sx={{ mb: 5 }} alignItems="center">
                <Typography variant="h4" gutterBottom>
                  Guardando evento...
                </Typography>
                <CircularProgress
                  sx={{
                    marginRight: "auto",
                    marginLeft: "auto",
                  }}
                />
              </Stack>
            ) : (
              <React.Fragment>
                <Stack sx={{ mb: 2 }}>
                  <Typography variant="h4" gutterBottom>
                    Crear evento
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    Introduce a continuación los datos del nuevo evento
                  </Typography>
                </Stack>
                <FormikProvider value={formikEventInformation}>
                  <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        label="Nombre del evento"
                        {...getFieldProps("eventName")}
                        error={Boolean(touched.eventName && errors.eventName)}
                        helperText={touched.eventName && errors.eventName}
                      />

                      <TextField
                        fullWidth
                        label="Lugar del evento"
                        {...getFieldProps("eventLocation")}
                        error={Boolean(
                          touched.eventLocation && errors.eventLocation
                        )}
                        helperText={
                          touched.eventLocation && errors.eventLocation
                        }
                      />

                      <TextField
                        fullWidth
                        label="Fecha del evento"
                        {...getFieldProps("eventDate")}
                        error={Boolean(touched.eventDate && errors.eventDate)}
                        helperText={touched.eventDate && errors.eventDate}
                      />

                      <TextField
                        fullWidth
                        label="Descripción del evento"
                        {...getFieldProps("eventDescription")}
                        error={Boolean(
                          touched.eventDescription && errors.eventDescription
                        )}
                        helperText={
                          touched.eventDescription && errors.eventDescription
                        }
                      />
                    </Stack>
                    <Stack sx={{ mt: 5 }} direction="row">
                      <LoadingButton
                        sx={{ ml: 1 }}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                      >
                        Crear evento
                      </LoadingButton>
                    </Stack>
                  </Form>
                </FormikProvider>
              </React.Fragment>
            )}
          </MyContainer>
        </RootStyle>
      </Modal>
    </>
  );
}
