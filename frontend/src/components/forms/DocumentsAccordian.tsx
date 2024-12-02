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

interface DocumentsAccordianProps {
  index: number;
  formMethods: UseFormReturn<CreateNodeFormMethods>;
  fieldArray: UseFieldArrayReturn<CreateNodeFormMethods, "documents", "id">;
  isOpen: boolean;
  onAccordionChange: (index: number) => void;
}

const DocumentsAccordian: FC<DocumentsAccordianProps> = ({
  index,
  formMethods,
  fieldArray,
  isOpen,
  onAccordionChange,
}) => {
  const theme = useTheme();
  const documentInputs: Inputs[] = [
    {
      name: `documents.${index}.documentName`,
      type: "text",
      label: "Document Name",
      gridMdWidth: 6,
      required: true,
      placeholder: "Enter document name",
      id: "document-name",
    },
    {
      name: `documents.${index}.author`,
      type: "text",
      label: "Author email",
      gridMdWidth: 6,
      required: true,
      placeholder: "Enter author email",
      id: "author-email",
    },
    {
      name: `documents.${index}.version`,
      type: "text",
      label: "Version",
      gridMdWidth: 3,
      required: true,
      placeholder: "Enter version",
      id: "version",
    },
    {
      name: `documents.${index}.createdDate`,
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
    {
      name: `documents.${index}.summary`,
      type: "text",
      label: "Summary",
      gridMdWidth: 6,
      required: true,
      placeholder: "Enter summary",
      id: "summary",
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
        <Typography variant="subtitle1">{`Document ${
          index + 1
        }: ${formMethods.watch(
          `documents.${index}.documentName`
        )}`}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <CustomFormFields inputs={documentInputs} formMethods={formMethods} />
        <Button
          color="error"
          onClick={() => fieldArray.remove(index)}
          variant="contained"
          sx={{ mt: 2, ml: "auto", display: "block" }}
        >
          Remove document
        </Button>
      </AccordionDetails>
    </Accordion>
  );
};

export default DocumentsAccordian;
