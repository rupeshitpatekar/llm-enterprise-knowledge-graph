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

interface ActivitiesAccordianProps {
  index: number;
  formMethods: UseFormReturn<CreateNodeFormMethods>;
  fieldArray: UseFieldArrayReturn<CreateNodeFormMethods, "activities", "id">;
  isOpen: boolean;
  onAccordionChange: (index: number) => void;
}

const ActivitiesAccordian: FC<ActivitiesAccordianProps> = ({
  index,
  formMethods,
  fieldArray,
  isOpen,
  onAccordionChange,
}) => {
  const theme = useTheme();
  const activityInputs: Inputs[] = [
    {
      name: `activities.${index}.activityName`,
      type: "text",
      label: "Activity Name",
      gridMdWidth: 6,
      required: true,
      placeholder: "Enter activity name",
      id: "activity-name",
    },
    {
      name: `activities.${index}.author`,
      type: "text",
      label: "Author email",
      gridMdWidth: 6,
      required: true,
      placeholder: "Enter author email",
      id: "author-email",
    },
    {
      name: `activities.${index}.status`,
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
      name: `activities.${index}.startDate`,
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
      name: `activities.${index}.endDate`,
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
        <Typography variant="subtitle1">{`Activity ${
          index + 1
        }: ${formMethods.watch(
          `activities.${index}.activityName`
        )}`}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <CustomFormFields inputs={activityInputs} formMethods={formMethods} />
        <Button
          color="error"
          onClick={() => fieldArray.remove(index)}
          variant="contained"
          sx={{ mt: 2, ml: "auto", display: "block" }}
        >
          Remove activity
        </Button>
      </AccordionDetails>
    </Accordion>
  );
};

export default ActivitiesAccordian;
