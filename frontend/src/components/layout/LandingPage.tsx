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
import { useAssistantLoginMutation, useRegisterUserMutation } from "@/services";
import { ptTokenValidityCheck, setToken } from "@/util";
import type { ApiError, AssistantLoginApiArg } from "@/types";
import LoginForm from "./LoginForm";

const Logo = new URL("./logo.png", import.meta.url).href;

interface LandingPageProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const LandingPage: FC<LandingPageProps> = ({ setIsAuthenticated }) => {
  const theme = useTheme();
  const [showLoginForm, setShowLoginForm] = useState<boolean>(false);
  const [showSignupForm, setShowSignupForm] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [login, { isLoading: loginLoading }] = useAssistantLoginMutation();
  const [register, { isLoading: registerLoading }] = useRegisterUserMutation();

  const loading = loginLoading || registerLoading;

  const loginFormMethods = useForm<AssistantLoginApiArg>({
    mode: "onSubmit",
  });

  const handleLoginSubmit = async (data: AssistantLoginApiArg) => {
    try {
      let callback = showSignupForm ? register : login;
      const response = await callback(data).unwrap();
      if (response && !showSignupForm) {
        setToken(response);
        setIsAuthenticated(ptTokenValidityCheck());
      }

      setShowSignupForm(false);
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

  const handleSignUpClick = () => {
    setShowLoginForm(false);
    setShowSignupForm(true);
  };

  const handleCancelSignupClick = () => {
    setErrorMessage("");
    setShowSignupForm(false);
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
              variant="h5"
              sx={{
                textAlign: { xs: "center", md: "left" },
              }}
            >
              Enterprise Knowledge Graph for Teams
            </Typography>
            {
              <Typography
                variant="h6"
                sx={{
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                {showSignupForm
                  ? "Please enter username and password to register."
                  : "Please sign in with your credentials."}
              </Typography>
            }
            {errorMessage && (
              <Typography color="error" variant="body2">
                {errorMessage}
              </Typography>
            )}
            {(showLoginForm || showSignupForm) && (
              <LoginForm isLoading={loading} formMethods={loginFormMethods} />
            )}
            <Stack
              direction="row"
              justifyContent={
                showLoginForm || showSignupForm ? "center" : "flex-start"
              }
              width="100%"
              alignItems="center"
              spacing={4}
              maxWidth="70%"
            >
              <Button
                variant="outlined"
                disableTouchRipple
                disabled={loading}
                onClick={
                  showLoginForm
                    ? handleCancelClick
                    : showSignupForm
                    ? handleCancelSignupClick
                    : handleSignUpClick
                }
              >
                {showLoginForm
                  ? "Cancel"
                  : showSignupForm
                  ? "Cancel "
                  : "Sign up"}
              </Button>
              <Button
                variant="contained"
                disableTouchRipple
                disabled={loading}
                startIcon={loading && <CircularProgress size={24} />}
                onClick={() => {
                  if (showLoginForm || showSignupForm) {
                    loginFormMethods.handleSubmit(handleLoginSubmit)();
                  } else {
                    setShowLoginForm(true);
                  }
                }}
                sx={{ mr: showLoginForm ? 0 : "auto" }}
              >
                {showSignupForm ? "Sign up" : "Sign in"}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default LandingPage;
