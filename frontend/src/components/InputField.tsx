import type { FC } from "react";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  useTheme,
} from "@mui/material";
import { ChatOutlined, Send } from "@mui/icons-material";

interface InputFieldProps {
  input: string;
  isLoading: boolean;
  setInput: (input: string) => void;
  handleNewChat: () => void;
  handleSendMessage: () => void;
}

const InputField: FC<InputFieldProps> = ({
  input,
  isLoading,
  setInput,
  handleNewChat,
  handleSendMessage,
}) => {
  const theme = useTheme();

  return (
    <Box
      bottom="2rem"
      zIndex={1}
      width="70%"
      display="flex"
      position="absolute"
      bgcolor={theme.palette.background.default}
    >
      <TextField
        fullWidth
        placeholder="Message Meera ..."
        variant="outlined"
        value={input}
        multiline
        minRows={3}
        maxRows={3}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
          }
        }}
        slotProps={{
          input: {
            sx: {
              bgcolor: "white",
              borderRadius: 3,
            },
            endAdornment: (
              <InputAdornment
                position="end"
                sx={{
                  position: "absolute",
                  margin: 1,
                  bottom: 0,
                  right: 0,
                }}
              >
                <Tooltip title="Start a new chat" arrow placement="top">
                  <IconButton
                    disableRipple
                    onClick={handleNewChat}
                    color="primary"
                  >
                    <ChatOutlined />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Send message" arrow placement="top">
                  <IconButton
                    disableRipple
                    onClick={handleSendMessage}
                    color="primary"
                    disabled={!input.trim() || isLoading}
                  >
                    <Send />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  );
};

export default InputField;
