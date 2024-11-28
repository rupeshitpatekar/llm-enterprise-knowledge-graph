import type { FC, SyntheticEvent } from "react";
import { useEffect, useRef, useState } from "react";
import copy from "copy-to-clipboard";
import {
  Alert,
  alpha,
  Box,
  Button,
  Skeleton,
  Snackbar,
  SnackbarCloseReason,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { AccountCircle, ContentCopyOutlined } from "@mui/icons-material";
import { useGenerateLLMOutputMutation } from "@/services";
import { convertToCapitalize, ptTokenValidityCheck } from "@/util";
import type {
  ApiError,
  ApiResponse,
  GenerateLLMOutputApiRes,
  MessageType,
} from "@/types";
import WelcomePage from "./WelcomePage";
import InputField from "./InputField";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Meera = new URL("./meera.png", import.meta.url).href;

interface HomePageProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const HomePage: FC<HomePageProps> = ({ setIsAuthenticated }) => {
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [snakbarMessage, setSnackbarMessage] = useState<ApiResponse>();
  const [input, setInput] = useState<string>("");
  const chatRef = useRef<HTMLDivElement>(null);

  const [generateLLMOutput, { isLoading: outputLoading }] =
    useGenerateLLMOutputMutation();

  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessage: MessageType = {
        user: "You",
        text: input,
      };

      setMessages((prev) => [...prev, newMessage]);
      setInput("");

      try {
        const response = await generateLLMOutput({ prompt: input }).unwrap();
        const parsedResponse: GenerateLLMOutputApiRes = JSON.parse(response);
        const llmResponse = JSON.parse(
          parsedResponse.choices[0].message.content
        );
        const botResponse: MessageType = {
          user: "Meera",
          text:
            llmResponse.response ||
            "I'm sorry, but I couldn't generate a response at this time. Please try rephrasing your input.",
        };

        setMessages((prev) => [...prev, botResponse]);
      } catch (e) {
        const error = e as ApiError;
        const botResponse: MessageType = {
          user: "Meera",
          text:
            error.data ||
            "I'm sorry, but I couldn't generate a response at this time. Please try again later.",
        };

        setMessages((prev) => [...prev, botResponse]);
      }
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSignout = () => {
    localStorage.clear();
    setIsAuthenticated(ptTokenValidityCheck());
  };

  const handleCardClick = (description: string) => {
    setInput(description);
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
  };

  const copyResponseToTheClipboard = async (msg: string) => {
    try {
      copy(msg);
      setOpen(true);
      setSnackbarMessage({
        message: "Content copied to clipboard",
        type: "success",
      });
    } catch (error) {
      setOpen(true);
      setSnackbarMessage({
        message: "Failed to copy",
        type: "error",
      });
    }
  };

  const renderMessages = (msg: MessageType, index: number) => {
    return (
      <Box
        key={index}
        gap={1}
        display="flex"
        flexDirection="column"
        justifyContent={msg.user === "You" ? "flex-end" : "flex-start"}
        alignItems={msg.user === "You" ? "flex-end" : "flex-start"}
      >
        <Stack direction="row" spacing={0.5} alignItems="center">
          {msg.user === "You" ? (
            <AccountCircle color="primary" />
          ) : (
            <Box
              component="img"
              src={Meera}
              sx={{
                width: 25,
                height: 25,
                borderRadius: "50%",
              }}
            />
          )}
          <Typography variant="body1">{msg.user}</Typography>
        </Stack>
        <Box
          sx={{
            backgroundColor:
              msg.user === "You"
                ? alpha(theme.palette.primary.light, 0.15)
                : theme.palette.grey[200],
            padding: "0.5rem 1rem",
            marginBottom: "0.5rem",
            borderRadius:
              msg.user === "You" ? "15px 0 15px 15px" : "0 15px 15px 15px",
            boxShadow:
              msg.user === "You"
                ? `0 4px 4px ${alpha(theme.palette.primary.main, 0.3)}`
                : `0 4px 4px ${alpha(theme.palette.grey[700], 0.3)}`,
          }}
          ref={chatRef}
        >
          <Typography variant="body1">
            {msg.user === "You" ? convertToCapitalize(msg.text) : msg.text}
          </Typography>
        </Box>
        {msg.user === "Meera" && (
          <Button
            disableRipple
            variant="text"
            startIcon={<ContentCopyOutlined />}
            onClick={() => copyResponseToTheClipboard(msg.text)}
          >
            Copy to clipboard
          </Button>
        )}
      </Box>
    );
  };

  const handleSnackbarClose = (
    _event?: SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      bgcolor={theme.palette.background.default}
    >
      <Navbar signout={handleSignout} handleNewChat={handleNewChat} />
      <Box
        display="flex"
        flexDirection="column"
        flexGrow={1}
        mb="8rem"
        overflow="auto"
        alignItems="center"
        justifyContent={messages.length > 0 ? "flex-start" : "center"}
      >
        {messages.length > 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            gap={1}
            width="70%"
            p="1rem"
            mb="1rem"
            flexGrow={1}
            maxHeight="calc(100vh - 250px)"
          >
            {messages.map((msg, index) => renderMessages(msg, index))}
            {outputLoading && (
              <Box
                gap={1}
                mb="0.5rem"
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="flex-start"
              >
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Box
                    component="img"
                    src={Meera}
                    sx={{
                      width: 25,
                      height: 25,
                      borderRadius: "50%",
                    }}
                  />
                  <Typography variant="body1">Meera</Typography>
                </Stack>
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  width="70%"
                  height={100}
                  sx={{
                    padding: "0.5rem 1rem",
                    borderRadius: "0 15px 15px 15px",
                  }}
                />
              </Box>
            )}
          </Box>
        ) : (
          <WelcomePage onCardClick={handleCardClick} />
        )}
        <InputField
          input={input}
          isLoading={outputLoading}
          setInput={setInput}
          handleNewChat={handleNewChat}
          handleSendMessage={handleSendMessage}
        />
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snakbarMessage?.type}
          variant="filled"
          sx={{ width: "100%", color: theme.palette.common.white }}
        >
          {snakbarMessage?.message}
        </Alert>
      </Snackbar>
      <Footer />
    </Box>
  );
};

export default HomePage;
