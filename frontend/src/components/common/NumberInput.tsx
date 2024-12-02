import { Grid, Stack, TextField } from "@mui/material";

import { BaseInputValues } from "../../types";
import { type FC } from "react";
import { Controller, UseFormReturn } from "react-hook-form";

interface CustomNumberFieldProps {
  inputData: BaseInputValues;
  formMethods: UseFormReturn;
}

const CustomNumberField: FC<CustomNumberFieldProps> = ({
  inputData,
  formMethods,
}) => {
  return (
    <Grid item xs={12} md={inputData.gridMdWidth} key={inputData.name}>
      <Stack direction={"row"} alignItems={"center"}>
        <Controller
          control={formMethods.control}
          name={inputData.name}
          rules={{
            required: inputData.required,
          }}
          render={({ field, fieldState }) => (
            <TextField
              id={inputData.id}
              type="number"
              required={!!inputData.required}
              fullWidth
              onChange={val => {
                formMethods.clearErrors(inputData.name);
                field.onChange(val);
              }}
              onBlur={field.onBlur}
              onKeyDown={e => {
                if (e?.key === "-" || e?.key === "+" || e?.key === "e") {
                  e.preventDefault();
                }
              }}
              value={field.value}
              placeholder={inputData.placeholder}
              label={inputData.label}
              size="small"
              variant={inputData.variant ?? "outlined"}
              error={!!fieldState.error}
              inputRef={field.ref}
              helperText={!!fieldState.error && fieldState.error.message}
              disabled={inputData.disabled}
              key={inputData.key}
            />
          )}
        />
      </Stack>
    </Grid>
  );
};

export default CustomNumberField;
