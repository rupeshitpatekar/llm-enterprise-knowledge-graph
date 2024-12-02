import { useState, type FC } from "react";
import { Box, Typography, IconButton, Divider, Stack } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { CreateNodeFormMethods } from "@/types";
import DocumentsAccordian from "./DocumentsAccordian";

interface DocumentDetailsProps {
  borderColor: string;
  formMethods: UseFormReturn<CreateNodeFormMethods>;
}

const DocumentDetails: FC<DocumentDetailsProps> = ({
  borderColor,
  formMethods,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const fieldArray = useFieldArray({
    control: formMethods.control,
    name: "documents",
  });

  const handleAddActivity = () => {
    fieldArray.append({
      author: "",
      createdDate: "",
      documentName: "",
      summary: "",
      type: "",
      version: "",
    });
    setOpenIndex(fieldArray.fields.length);
  };

  const handleAccordionChange = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: borderColor,
        borderRadius: 4,
      }}
    >
      <Stack
        px={2}
        py={1}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="subtitle1">Manage documents</Typography>
        <IconButton
          color="primary"
          size="small"
          onClick={handleAddActivity}
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            "&:hover": {
              backgroundColor: "primary.main",
            },
          }}
        >
          <Add />
        </IconButton>
      </Stack>
      <Divider variant="fullWidth" sx={{ borderColor: borderColor }} />
      <Box p={2}>
        {fieldArray.fields.map((field, index) => (
          <DocumentsAccordian
            key={field.id}
            fieldArray={fieldArray}
            formMethods={formMethods}
            index={index}
            isOpen={openIndex === index}
            onAccordionChange={handleAccordionChange}
          />
        ))}
      </Box>
    </Box>
  );
};

export default DocumentDetails;
