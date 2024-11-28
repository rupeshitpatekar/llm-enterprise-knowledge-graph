import type { FC } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { Box, Stack, TextField } from "@mui/material";
import type { AssistantLoginApiArg, LoginFormFieldTypes } from "@/types";

interface LoginFormProps {
  isLoading: boolean;
  formMethods: UseFormReturn<AssistantLoginApiArg>;
}

const LoginForm: FC<LoginFormProps> = ({ isLoading, formMethods }) => {
  const renderTextField = (
    fieldName: LoginFormFieldTypes,
    label: string,
    requiredHelper: string,
    pattern?: RegExp,
    patternError?: string
  ) => {
    return (
      <Controller
        name={fieldName}
        control={formMethods.control}
        rules={{
          required: requiredHelper,
          pattern:
            !!pattern && !!patternError
              ? {
                  value: pattern,
                  message: patternError,
                }
              : undefined,
        }}
        render={({ field: { onChange, value, ref }, fieldState }) => (
          <TextField
            fullWidth
            required
            disabled={isLoading}
            size="small"
            type={fieldName === "password" ? "password" : "text"}
            inputRef={ref}
            label={label}
            value={value}
            error={!!fieldState.error}
            onChange={(val) => {
              formMethods.clearErrors(fieldName);
              onChange(val);
            }}
            helperText={fieldState.error && fieldState.error.message}
          />
        )}
      />
    );
  };

  return (
    <Box
      display="flex"
      justifyContent={{ xs: "center", md: "flex-start" }}
      width="100%"
    >
      <Stack direction="column" spacing={2} width="70%">
        {renderTextField("username", "Username", "Username is required")}
        {renderTextField("password", "Password", "Password is required")}
      </Stack>
    </Box>
  );
};

export default LoginForm;
