import { GridSize, TextFieldProps } from "@mui/material";
import { Locale } from "date-fns";
import { ReactNode } from "react";
import { Noop, RefCallBack } from "react-hook-form";

export type Inputs = BaseInputValues | SelectField | DateField;

export interface BaseInputValues extends TextFieldProps<"standard"> {
  type: "text" | "select" | "date" | "password" | "number";
  gridMdWidth?: boolean | GridSize | undefined;
  gridXsWidth?: boolean | GridSize | undefined;
  label: string;
  required?: boolean;
  disabled?: boolean;
  placeholder: string;
  id: string;
  name: string;
  optionLabel?: string;
  multiline?: boolean;
  minRows?: number;
  maxRows?: number;
  readOnly?: boolean;
}

export interface SelectItems {
  label: string;
  value: string | number;
}

export interface SelectField extends BaseInputValues {
  type: "select";
  labelId: string;
  selectItems: SelectItems[];
  renderAdditionalField: () => ReactNode;
  notLocalize?: boolean;
  multiSelect?: boolean;
}

export interface DateField extends BaseInputValues {
  type: "date";
  datePickerLanguage: Locale;
  disablePast?: boolean;
  disableFuture?: boolean;
  dateFormat: string;
  minDate?: Date;
  maxDate?: Date;
  datePlaceholder: string;
  minTime?: Date;
}

export interface CustomInputField {
  onChange: (prop: string | Record<string, any> | Date | null) => void;
  value:
    | string
    | Record<string, unknown>
    | string[]
    | Record<string, unknown>[]
    | Date;
  ref?: RefCallBack;
  onBlur?: Noop;
}

export interface CustomInputFieldState {
  error: {
    message: string;
  };
}
