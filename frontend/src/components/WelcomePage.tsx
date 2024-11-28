import type { FC } from "react";
import _ from "lodash";
import {
  Box,
  Grid2 as Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { WELCOME_PAGE_CARD_DATA } from "@/constants";

const Meera = new URL("./meera.png", import.meta.url).href;

interface WelcomePageProps {
  onCardClick: (description: string) => void;
}

const WelcomePage: FC<WelcomePageProps> = ({ onCardClick }) => {
  const theme = useTheme();

  return (
    <Box
      gap={2}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <img src={Meera} alt="Logo" style={{ width: 100, height: 100 }} />
      <Typography variant="h6">Meera - Your IMPS assitant for work</Typography>
      <Grid
        container
        columns={12}
        alignItems="center"
        justifyContent="center"
        spacing={{ xs: 2, md: 3 }}
        width={{ xs: "80%", lg: "60%" }}
      >
        {WELCOME_PAGE_CARD_DATA.map((card, index) => (
          <Grid size={4} key={index}>
            <Stack
              mb={2}
              spacing={1}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <card.icon color="secondary" />
              <Typography color="secondary" variant="body1">
                {card.category}
              </Typography>
            </Stack>
            {card.questions.map((description, descIndex) => (
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  mb: 3,
                  borderRadius: 2,
                  display: "flex",
                  cursor: "pointer",
                  textAlign: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  justifyContent: "center",
                  height: { xs: "3rem", md: "2rem" },
                  bgcolor: theme.palette.background.paper,
                }}
                key={descIndex}
                onClick={() => onCardClick(description)}
              >
                <Typography variant="body2">{description}</Typography>
              </Paper>
            ))}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default WelcomePage;
