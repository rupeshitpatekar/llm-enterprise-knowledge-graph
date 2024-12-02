import type { CreateNodeFormMethods, UserAuthentication } from "@/types";

export const INITIAL_ROOT_STATE: UserAuthentication = {
  user_id: "",
  exp: 0,
};

export const ERROR_ADMIN = "SNACKBAR_ERROR_ADMIN_MESSAGE";

export const DATE_FORMAT_PLACEHOLDER = "dd/mm/yyyy";
export const FULL_DATE_FORMAT = "dd/MM/yyyy";

export const CREATE_NODE_DEFAULT_VALUES: CreateNodeFormMethods = {
  projectName: "",
  description: "",
  startDate: null,
  endDate: null,
  budget: "",
  status: null,
  projectIndustry: "",
  assets: false,
  benefits: "",
  activities: [
    {
      activityName: "",
      author: "",
      startDate: null,
      endDate: null,
      status: null,
    },
  ],
  documents: [
    {
      documentName: "",
      author: "",
      version: "",
      summary: "",
      type: "",
      createdDate: null,
    },
  ],
  members: [
    {
      name: "",
      role: "",
      email: "",
      yearsOfExperience: "",
      startDate: null,
    },
  ],
};
