import {
  Box,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import type { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import CustomFormFields from "../common";
import { Inputs, CreateNodeFormMethods } from "@/types";
import { FULL_DATE_FORMAT, DATE_FORMAT_PLACEHOLDER } from "@/constants";

interface ProjectDetailsProps {
  borderColor: string;
  formMethods: UseFormReturn<CreateNodeFormMethods>;
}

const ProjectDetails: FC<ProjectDetailsProps> = ({
  borderColor,
  formMethods,
}) => {
  const inputs: Inputs[] = [
    {
      name: "projectName",
      type: "text",
      id: "project-name",
      label: "Project name",
      gridMdWidth: 6,
      required: true,
      placeholder: "Please enter the project name",
    },
    {
      name: "projectIndustry",
      type: "text",
      id: "project-industry",
      label: "Project industry",
      gridMdWidth: 6,
      required: true,
      placeholder: "Please enter the project industry",
    },
    {
      name: "startDate",
      type: "date",
      id: "start-date",
      label: "Start date",
      placeholder: "Select start date",
      datePlaceholder: DATE_FORMAT_PLACEHOLDER,
      gridMdWidth: 2,
      required: true,
      dateFormat: FULL_DATE_FORMAT,
      disablePast: true,
    },
    {
      name: "endDate",
      type: "date",
      id: "end-date",
      label: "End date",
      placeholder: "Select end date",
      datePlaceholder: DATE_FORMAT_PLACEHOLDER,
      gridMdWidth: 2,
      required: true,
      dateFormat: FULL_DATE_FORMAT,
      disablePast: true,
    },
    {
      name: "budget",
      id: "budget",
      type: "number",
      label: "Budget",
      gridMdWidth: 2,
      required: true,
      placeholder: "Project budget",
    },
    {
      name: "benefits",
      type: "text",
      id: "benefits",
      label: "Benefits",
      gridMdWidth: 6,
      required: true,
      placeholder: "Please enter the project benefits",
    },
    {
      name: "status",
      type: "select",
      id: "status",
      label: "Status",
      gridMdWidth: 2,
      required: true,
      placeholder: "Select status",
      selectItems: [
        { label: "Not started", value: "not-started" },
        { label: "In progress", value: "in-progress" },
        { label: "Completed", value: "completed" },
      ],
    },
    {
      name: "description",
      type: "text",
      id: "description",
      label: "Description",
      gridMdWidth: 10,
      required: true,
      placeholder: "Please enter the project description",
    },
  ];

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: borderColor,
        borderRadius: 4,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography px={2} py={1} variant="subtitle1">
          Project details
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={formMethods.watch("assets")}
              onChange={e => formMethods.setValue("assets", e.target.checked)}
              color="primary"
            />
          }
          label="Assets"
        />
      </Stack>
      <Divider variant="fullWidth" sx={{ borderColor: borderColor }} />
      <Box p={2}>
        <CustomFormFields inputs={inputs} formMethods={formMethods} />
      </Box>
    </Box>
  );
};

export default ProjectDetails;
