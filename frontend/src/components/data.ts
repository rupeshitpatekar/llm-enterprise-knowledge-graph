import { CreateProjectApiRes } from "@/types";

export type TreeNode = {
  name: string;
  children?: TreeNode[];
};

export const treeData: CreateProjectApiRes = [
  {
    projectName: "Project Beta",
    description: "Development of an AI/ML model for predictive maintenance.",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    budget: "500000",
    status: "Ongoing",
    projectIndustry: "Manufacturing",
    assets: "Yes",
    benefits:
      "This project will enhance manufacturing efficiency and reduce costs.",
    activities: [
      {
        activityName: "Data Collection",
        startDate: "2023-01-05",
        endDate: "2023-03-31",
        status: "Completed",
        author: "null",
      },
      {
        activityName: "Data Collection",
        startDate: "2023-01-05",
        endDate: "2023-03-31",
        status: "Completed",
        author: "null",
      },
    ],
    documents: [
      {
        documentName: "Initial Requirements",
        type: "Requirements",
        createdDate: "2023-01-10",
        author: "dfaefa",
        summary: "qdaef",
        version: "adad",
      },
      {
        documentName: "Initial Requirements",
        type: "Requirements",
        createdDate: "2023-01-10",
        author: "dfaefa",
        summary: "qdaef",
        version: "adad",
      },
    ],
    members: [
      {
        name: "John Doe",
        role: "Project Manager",
        startDate: "2023-01-01",
        email: "qaa",
        yearsOfExperience: "adf",
      },
      {
        name: "John Doe",
        role: "Project Manager",
        startDate: "2023-01-01",
        email: "qaa",
        yearsOfExperience: "adf",
      },
    ],
  },
];
