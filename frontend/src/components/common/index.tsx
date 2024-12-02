import type { UseFormReturn } from "react-hook-form";
import { Grid } from "@mui/material";

import CustomDatePicker from "./DatePicker";
import CustomTextField from "./TextField";

import type { FC } from "react";
import { DateField, Inputs, BaseInputValues, SelectField } from "@/types";
import CustomSelect from "./Select";

interface CustomFormFieldsProps {
  inputs: Inputs[];
  formMethods: UseFormReturn<any>;
  isGrid?: boolean;
}

const CustomFormFields: FC<CustomFormFieldsProps> = ({
  inputs,
  formMethods,
  isGrid = true,
}) => {
  const renderFormInputs = () => {
    return inputs.map(input => {
      if (!input) return;
      switch (input.type) {
        case "text":
        case "password":
        default:
          return (
            <CustomTextField
              inputData={input as BaseInputValues}
              formMethods={formMethods}
            />
          );

        case "date":
          return (
            <CustomDatePicker
              inputData={input as DateField}
              formMethods={formMethods}
            />
          );
        case "select":
          return (
            <CustomSelect
              inputData={input as SelectField}
              formMethods={formMethods}
            />
          );
      }
    });
  };

  return isGrid ? (
    <Grid container direction="row" spacing={2}>
      {renderFormInputs()}
    </Grid>
  ) : (
    renderFormInputs()
  );
};

export default CustomFormFields;
