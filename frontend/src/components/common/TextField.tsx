import { Grid, TextField } from "@mui/material";
import type { FC } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import type { BaseInputValues } from "../../types";
import _ from "lodash";

interface CustomTextFieldProps {
  inputData: BaseInputValues;
  formMethods: UseFormReturn;
}

const CustomTextField: FC<CustomTextFieldProps> = ({
  inputData,
  formMethods,
}) => {
  return (
    <Grid
      item
      xs={12}
      md={inputData.gridMdWidth}
      key={inputData.name}
      position="relative"
    >
      <Controller
        control={formMethods.control}
        name={inputData.name}
        rules={{
          required: inputData.required,
        }}
        render={({ field: { onChange, onBlur, value, ref }, fieldState }) => (
          <TextField
            id={inputData.id}
            type={inputData.type}
            required={!!inputData.required}
            onChange={val => {
              formMethods.clearErrors(inputData.name);
              onChange(val);
            }}
            onBlur={inputData.onBlur ?? onBlur}
            value={value}
            placeholder={inputData.placeholder}
            fullWidth
            label={inputData.label}
            size={inputData.size || "small"}
            InputProps={{
              readOnly: inputData.readOnly,
              disableUnderline: inputData.readOnly,
            }}
            variant={
              inputData.readOnly ? "standard" : inputData.variant || "outlined"
            }
            error={!!fieldState.error}
            inputRef={ref}
            helperText={fieldState.error && fieldState.error.message}
            disabled={inputData.disabled}
            multiline={inputData.multiline}
            rows={inputData.rows}
            maxRows={inputData.maxRows}
            minRows={inputData.minRows}
          />
        )}
      />
    </Grid>
  );
};

export default CustomTextField;
