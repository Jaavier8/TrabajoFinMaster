import Color from 'color'
// React
import React from "react";
// Material UI
import {
  Container,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Stack,
  Divider
} from "@mui/material";
import { styled } from '@mui/material/styles';


const downloadNeoLinux = () => {
  window.location.href = `/downloads/Morfeo.zip`;
};

const downloadNeoAndroid = () => {
  window.location.href = `/downloads/Morfeo.apk`;
};

const downloadNeoWindows = () => {
  window.location.href = `/downloads/MorfeoWin.zip`;
};

const downloadNeoRaspberry = () => {
  window.location.href = `/downloads/MorfeoRaspi.zip`;
};

const RootStyle = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  //minHeight: '100vh',
  //overflow: 'hidden',
  //backgroundImage: 'url('+ Image+')'
});

const MyContainer = styled(Container)(({ theme }) => ({
  //backgroundColor: theme.palette.primary.lighter,
  //maxWidth: '80%',
  //border: '3px solid',
  //borderRadius: '16px',
  //borderColor: theme.palette.primary.darker,
  //position: "relative",
  //top: 0,
  //bottom: 0,
  maxWidth: 'auto',
  margin: 'auto',
  display: 'flex',
  //minHeight: '100%',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundColor: 'red'
}));

const MyCardActionArea = styled(CardActionArea)(({ theme }) => ({
  borderRadius: 16,
  transition: "0.2s",
  "&:hover": {
    transform: "scale(1.1)",
  }
}));

const MyCard = styled(Card)(({ theme, color }) => ({
  minWidth: 256,
  borderRadius: 16,
  boxShadow: "none",
  "&:hover": {
    boxShadow: `0 6px 12px 0 ${Color(color)
      .rotate(-12)
      .darken(0.2)
      .fade(0.5)}`,
  },
}));

const MyCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 140,
  backgroundColor: "#424242",
}));

const MyCardContent = styled(CardContent)(({ theme, color }) => ({
  backgroundColor: color,
  padding: "1rem 1.5rem 1.5rem",
}));

const MyGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "20px",
  marginTop: "5px"
}));

const MyTitleTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "Keania One",
  fontSize: "2rem",
  color: "#fff",
  textTransform: "uppercase",
}));

const MySubtitleTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "Montserrat",
  color: "#fff",
  opacity: 0.87,
  marginTop: "2rem",
  fontWeight: 500,
  fontSize: 14,
}));

const CustomCard = ({ image, title, subtitle, action, color }) => {
  return (
    <MyCardActionArea onClick={action}>
      <MyCard color={color}>
        <MyCardMedia image={image} />
        <MyCardContent color={color}>
          <Stack alignItems="center" sx={{ mb: '5px', mt: '5px' }}>
            <MyTitleTypography>
              {title}
            </MyTitleTypography>
            <MySubtitleTypography>
              {subtitle}
            </MySubtitleTypography>
          </Stack>
        </MyCardContent>
      </MyCard>
    </MyCardActionArea>
  );
};

export default function HomeScreen(props) {

  return (
    <>
      <MyContainer>
        <Stack sx={{ my: 5 }}>
          <Typography variant="h4" gutterBottom>
            Hola
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Hola</Typography>
        </Stack>
        </MyContainer>

        <Divider />

        <MyGrid container spacing={10}>
          <Grid item>
            <CustomCard
              title={"Android"}
              subtitle={"Version 0.8"}
              image={"https://wallpapercave.com/wp/wp5627309.jpg"}
              action={downloadNeoAndroid}
              color="#43a047"
            />
          </Grid>
          <Grid item>
            <CustomCard
              title={"Linux"}
              subtitle={"Version 0.8"}
              image={
                "https://www.omgubuntu.co.uk/wp-content/uploads/2016/10/GOUKlfP.jpg"
              }
              action={downloadNeoLinux}
              color="#455a64"
            />
          </Grid>
          <Grid item>
            <CustomCard
              title={"Windows"}
              subtitle={"Version 0.8"}
              image={"https://www.setaswall.com/wp-content/uploads/2017/03/Windows-Logo-Computer-Wallpaper-2560x1600.jpg"}
              action={downloadNeoWindows}
              color="#1565c0"
            />
          </Grid>
          <Grid item>
            <CustomCard
              title={"Raspbian"}
              subtitle={"Version 0.8"}
              image={"http://cdn.ttgtmedia.com/ITKE/uploads/blogs.dir/8/files/2008/02/debian-logo.gif"}
              action={downloadNeoRaspberry}
              color="#c2185b"
            />
          </Grid>
        </MyGrid>
    </>
  );
}