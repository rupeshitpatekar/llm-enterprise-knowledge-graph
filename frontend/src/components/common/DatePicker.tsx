import { useState } from "react";
import { Grid } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { FC } from "react";
import {
  CustomInputField,
  CustomInputFieldState,
  DateField,
} from "../../types";
import { Controller, UseFormReturn } from "react-hook-form";
import { parseISO } from "date-fns";
import moment from "moment";

interface CustomDatePickerProps {
  inputData: DateField;
  formMethods: UseFormReturn;
}

const CustomDatePicker: FC<CustomDatePickerProps> = ({
  inputData,
  formMethods,
}) => {
  const [openPicker, setOpenPicker] = useState(false);

  const DateComponent = ({
    field,
    fieldState,
  }: {
    field: CustomInputField;
    fieldState: CustomInputFieldState;
  }) => (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={inputData.datePickerLanguage}
    >
      <DatePicker
        disablePast={inputData.disablePast || false}
        disableFuture={inputData.disableFuture || false}
        disabled={inputData.disabled}
        label={inputData.label}
        value={
          typeof field.value === "string" ? parseISO(field.value) : field.value
        }
        onChange={val => {
          formMethods.clearErrors(inputData.name);
          field.onChange(moment(val as Date).format("yyyy-MM-DD"));
        }}
        format={inputData.dateFormat}
        maxDate={inputData.maxDate}
        minDate={inputData.minDate}
        open={openPicker}
        onOpen={() => setOpenPicker(true)}
        onClose={() => setOpenPicker(false)}
        slotProps={{
          textField: {
            id: inputData?.id,
            size: "small",
            placeholder: inputData.placeholder,
            required: inputData.required,
            fullWidth: true,
            onClick: () => setOpenPicker(!openPicker),
            inputProps: {
              placeholder: inputData.datePlaceholder,
            },
            error: !!fieldState.error,
            helperText: !!fieldState.error && fieldState.error.message,
          },
        }}
      />
    </LocalizationProvider>
  );

  return (
    <Grid item xs={12} md={inputData.gridMdWidth} key={inputData.name}>
      <Controller
        control={formMethods.control}
        name={inputData.name}
        rules={{
          required: inputData.required,
        }}
        render={({ field, fieldState }) => (
          <DateComponent
            field={field}
            fieldState={fieldState as CustomInputFieldState}
          />
        )}
      />
    </Grid>
  );
};

export default CustomDatePicker;
