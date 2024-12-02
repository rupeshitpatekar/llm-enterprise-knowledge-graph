import {
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
  useTheme,
  Select,
  Box,
  Stack,
  Grid,
  Chip,
  styled,
} from "@mui/material";
import type { FC } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { Controller, UseFormReturn } from "react-hook-form";
import {
  CustomInputField,
  CustomInputFieldState,
  SelectField,
} from "../../types";

interface CustomDatePickerProps {
  inputData: SelectField;
  formMethods: UseFormReturn;
}

const StyledChip = styled(Chip)(() => ({
  marginLeft: 1,
  marginRight: 1,
  textTransform: "capitalize",
  height: "23px",
  "& .MuiChip-label": {
    fontSize: 12,
  },
  "& .MuiChip-deleteIcon": {
    position: "static",
  },
}));

const CustomSelect: FC<CustomDatePickerProps> = ({
  inputData,
  formMethods,
}) => {
  const theme = useTheme();
  const handleDeleteItem = (item: string, fieldValue: string[]) => {
    const newVal = fieldValue.filter((val: string) => val !== item);
    formMethods.setValue(inputData.name, newVal);
  };

  const SelectField = ({
    field,
    fieldState,
  }: {
    field: CustomInputField;
    fieldState: CustomInputFieldState;
  }) => (
    <Box sx={{ width: "100%" }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <FormControl
          fullWidth
          disabled={inputData.disabled}
          error={!!fieldState.error}
        >
          <InputLabel
            error={!!fieldState.error}
            required={inputData.required}
            size="small"
            id={inputData.labelId}
          >
            {inputData.label}
          </InputLabel>
          <Select
            size="small"
            labelId={inputData.labelId}
            id={inputData.id}
            label={inputData.label}
            fullWidth
            required={inputData.required}
            onChange={val => {
              formMethods.clearErrors(inputData.name);
              field.onChange(val as unknown as string);
            }}
            multiple={inputData.multiSelect}
            value={field.value as string}
            error={!!fieldState.error}
            placeholder={inputData.placeholder}
            renderValue={
              inputData.multiSelect
                ? selected => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {(selected as unknown as string[]).map(value => {
                        let label = value;
                        const splitted = value.split("_");
                        if (splitted.length > 1) {
                          label = splitted.join(" ");
                        }
                        return (
                          <StyledChip
                            key={value}
                            label={label}
                            deleteIcon={
                              <ClearIcon
                                onMouseDown={event => event.stopPropagation()}
                              />
                            }
                            onDelete={() => {
                              if (!inputData.disabled) {
                                handleDeleteItem(
                                  value,
                                  field.value as string[]
                                );
                              }
                            }}
                          />
                        );
                      })}
                    </Box>
                  )
                : undefined
            }
          >
            <MenuItem sx={{ display: "none" }} />
            {inputData.selectItems.map(item => (
              <MenuItem id={item.label} key={item.value} value={item.value}>
                {inputData.notLocalize ? item.label : item.label}
              </MenuItem>
            ))}
          </Select>
          {fieldState.error && (
            <FormHelperText sx={{ color: theme.palette.error.main }}>
              {fieldState.error.message as string}
            </FormHelperText>
          )}
        </FormControl>
      </Stack>
      {inputData.renderAdditionalField && inputData.renderAdditionalField()}
    </Box>
  );

  return (
    <Grid
      item
      xs={inputData.gridXsWidth || 12}
      md={inputData.gridMdWidth}
      key={inputData.name}
    >
      <Controller
        control={formMethods.control}
        name={inputData.name}
        rules={{
          required: inputData.required,
        }}
        render={({ field, fieldState }) => (
          <SelectField
            field={field}
            fieldState={fieldState as CustomInputFieldState}
          />
        )}
      />
    </Grid>
  );
};

export default CustomSelect;
