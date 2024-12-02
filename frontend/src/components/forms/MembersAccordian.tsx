import { DeleteOutline, ExpandMoreOutlined } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  alpha,
  Button,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import type { FC } from "react";
import CustomFormFields from "../common";
import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";
import { CreateNodeFormMethods, Inputs } from "@/types";
import { DATE_FORMAT_PLACEHOLDER, FULL_DATE_FORMAT } from "@/constants";

interface MembersAccordianProps {
  index: number;
  formMethods: UseFormReturn<CreateNodeFormMethods>;
  fieldArray: UseFieldArrayReturn<CreateNodeFormMethods, "members", "id">;
  isOpen: boolean;
  onAccordionChange: (index: number) => void;
}

const MembersAccordian: FC<MembersAccordianProps> = ({
  index,
  formMethods,
  fieldArray,
  isOpen,
  onAccordionChange,
}) => {
  const theme = useTheme();
  const documentInputs: Inputs[] = [
    {
      name: `members.${index}.name`,
      type: "text",
      label: "Member Name",
      gridMdWidth: 6,
      required: true,
      placeholder: "Enter member name",
      id: "member-name",
    },
    {
      name: `members.${index}.email`,
      type: "text",
      label: "Email",
      gridMdWidth: 6,
      required: true,
      placeholder: "Enter email",
      id: "member-email",
    },
    {
      name: `members.${index}.role`,
      type: "text",
      label: "Role",
      gridMdWidth: 3,
      required: true,
      placeholder: "Enter role",
      id: "role",
    },
    {
      name: `members.${index}.yearsOfExperience`,
      type: "text",
      label: "Years of experience",
      gridMdWidth: 6,
      required: true,
      placeholder: "Enter years of experience",
      id: "years-of-experience",
    },
    {
      name: `members.${index}.startDate`,
      type: "date",
      id: "start-date",
      label: "Start date",
      placeholder: "Select start date",
      datePlaceholder: DATE_FORMAT_PLACEHOLDER,
      gridMdWidth: 3,
      required: true,
      dateFormat: FULL_DATE_FORMAT,
      disablePast: true,
    },
  ];

  return (
    <Accordion
      expanded={isOpen}
      onChange={() => onAccordionChange(index)}
      sx={{
        marginBottom: 2,
        color: theme.palette.text.primary,
        backgroundColor: alpha(theme.palette.primary.light, 0.1),
      }}
    >
      <AccordionSummary
        expandIcon={
          <Stack direction="row" alignItems="center" justifyContent="center">
            {!isOpen && (
              <IconButton
                color="error"
                onClick={() => fieldArray.remove(index)}
                size="small"
                sx={{ ml: 2 }}
              >
                <DeleteOutline />
              </IconButton>
            )}
            <ExpandMoreOutlined />
          </Stack>
        }
      >
        <Typography variant="subtitle1">{`Member ${
          index + 1
        }: ${formMethods.watch(`members.${index}.name`)}`}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <CustomFormFields inputs={documentInputs} formMethods={formMethods} />
        <Button
          color="error"
          onClick={() => fieldArray.remove(index)}
          variant="contained"
          sx={{ mt: 2, ml: "auto", display: "block" }}
        >
          Remove member
        </Button>
      </AccordionDetails>
    </Accordion>
  );
};

export default MembersAccordian;
