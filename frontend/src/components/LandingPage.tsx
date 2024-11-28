import type { FC } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  alpha,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useAssistantLoginMutation } from "@/services";
import { ptTokenValidityCheck, setToken } from "@/util";
import type { ApiError, AssistantLoginApiArg } from "@/types";
import LoginForm from "./LoginForm";

const Logo = new URL("./meera.png", import.meta.url).href;

interface LandingPageProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const LandingPage: FC<LandingPageProps> = ({ setIsAuthenticated }) => {
  const theme = useTheme();
  const [showLoginForm, setShowLoginForm] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [login, { isLoading: loginLoading }] = useAssistantLoginMutation();

  const loginFormMethods = useForm<AssistantLoginApiArg>({
    mode: "onSubmit",
  });

  const handleLoginSubmit = async (data: AssistantLoginApiArg) => {
    try {
      const response = await login(data).unwrap();
      if (response) {
        setToken(response);
        setIsAuthenticated(ptTokenValidityCheck());
      }
    } catch (e) {
      const error = e as ApiError;
      error.data.includes("Got `401`")
        ? setErrorMessage("Invalid credentials, please try again.")
        : setErrorMessage(error.data);
    }
  };

  const handleCancelClick = () => {
    setErrorMessage("");
    setShowLoginForm(false);
    loginFormMethods.reset();
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor={alpha(theme.palette.primary.light, 0.2)}
      minHeight="100vh"
    >
      <Paper
        elevation={4}
        sx={{
          my: 5,
          padding: 3,
          maxWidth: "60%",
          minHeight: "70vh",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          width="100%"
          alignItems="center"
        >
          <Box
            src={Logo}
            component="img"
            width={{ xs: "80%", sm: "60%", md: "40%" }}
            mx="auto"
            mb={{ xs: 3, md: 0 }}
          />
          <Box
            p={{ sm: 0, md: 5 }}
            width={{ sm: "100%", md: "60%" }}
            display="flex"
            gap={3}
            flexDirection="column"
            justifyContent="center"
            alignItems={{ xs: "center", md: "flex-start" }}
          >
            <Typography
              variant="h4"
              sx={{
                textAlign: { xs: "center", md: "left" },
              }}
            >
              Sign in to experience IMPS Developer Assistant
            </Typography>
            <Typography
              variant="h5"
              sx={{
                textAlign: { xs: "center", md: "left" },
              }}
            >
              Please sign in with your credentials.
            </Typography>
            {errorMessage && (
              <Typography color="error" variant="body2">
                {errorMessage}
              </Typography>
            )}
            {showLoginForm && (
              <LoginForm
                isLoading={loginLoading}
                formMethods={loginFormMethods}
              />
            )}
            <Stack
              direction="row"
              justifyContent={showLoginForm ? "space-between" : "flex-start"}
              width={showLoginForm ? "100%" : "auto"}
              alignItems="center"
              maxWidth="70%"
            >
              {showLoginForm && (
                <Button
                  variant="outlined"
                  disableTouchRipple
                  disabled={loginLoading}
                  onClick={handleCancelClick}
                >
                  Cancel
                </Button>
              )}
              <Button
                variant="contained"
                disableTouchRipple
                disabled={loginLoading}
                startIcon={loginLoading && <CircularProgress size={24} />}
                onClick={() => {
                  if (showLoginForm) {
                    loginFormMethods.handleSubmit(handleLoginSubmit)();
                  } else {
                    setShowLoginForm(true);
                  }
                }}
                sx={{ mr: showLoginForm ? 0 : "auto" }}
              >
                Sign in
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default LandingPage;
