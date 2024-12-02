import { useCreateProjectMutation } from "@/services";
import { Box, Button, Divider, Paper, Stack, useTheme } from "@mui/material";
import type { FC } from "react";
import ProjectDetails from "./forms/ProjectDetails";
import { useForm } from "react-hook-form";
import { ApiResponse, CreateNodeFormMethods } from "@/types";
import ActivityDetails from "./forms/ActivityDetails";
import { CREATE_NODE_DEFAULT_VALUES } from "@/constants";
import DocumentDetails from "./forms/DocumentDetails";
import MemberDetails from "./forms/MemberDetails";
import { useNavigate } from "react-router-dom";

interface CreateNodeProps {
  setOpen: (open: boolean) => void;
  setSnackbarMessage: (message: ApiResponse) => void;
}

const CreateNode: FC<CreateNodeProps> = ({ setOpen, setSnackbarMessage }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const borderColor = theme.palette.grey[300];

  const [createProject, { isLoading: createLoading }] =
    useCreateProjectMutation();

  const createNodeFormMethods = useForm<CreateNodeFormMethods>({
    defaultValues: CREATE_NODE_DEFAULT_VALUES,
  });

  const onSubmit = async (data: CreateNodeFormMethods) => {
    try {
      await createProject(data).unwrap();
      setOpen(true);
      setSnackbarMessage({
        message: "Project created successfully",
        type: "success",
      });
      navigate("/");
    } catch (error) {
      setOpen(true);
      setSnackbarMessage({
        message: "Unable to create project",
        type: "error",
      });
    }
  };

  return (
    <Box>
      <Button
        color="primary"
        onClick={() => {}}
        variant="outlined"
        sx={{ mb: 1, ml: "auto", display: "block" }}
      >
        Import from CSV
      </Button>
      <Paper elevation={2} sx={{ p: 2, borderRadius: 4 }}>
        <Box
          style={{
            opacity: createLoading ? 0.25 : 1,
            pointerEvents: createLoading ? "none" : "auto",
          }}
        >
          <ProjectDetails
            borderColor={borderColor}
            formMethods={createNodeFormMethods}
          />
          <Divider sx={{ my: 2, borderColor: borderColor }} />
          <ActivityDetails
            borderColor={borderColor}
            formMethods={createNodeFormMethods}
          />
          <Divider sx={{ my: 2, borderColor: borderColor }} />
          <DocumentDetails
            borderColor={borderColor}
            formMethods={createNodeFormMethods}
          />
          <Divider sx={{ my: 2, borderColor: borderColor }} />
          <MemberDetails
            borderColor={borderColor}
            formMethods={createNodeFormMethods}
          />
          <Divider sx={{ marginTop: 2, marginBottom: 1.5, width: "100%" }} />
          <Stack
            width={{ xs: "100%", md: "60%", lg: "50%" }}
            direction="row"
            spacing={2}
            mt={2}
            justifyContent="space-between"
          >
            <Button
              variant="outlined"
              onClick={() => navigate("/")}
              id="cancel-action"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={createNodeFormMethods.handleSubmit(onSubmit)}
              id="create-action"
            >
              Create
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateNode;
