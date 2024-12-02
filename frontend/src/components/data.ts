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
    status: "completed",
    projectIndustry: "Manufacturing",
    assets: true,
    benefits:
      "This project will enhance manufacturing efficiency and reduce costs.",
    activities: [
      {
        activityName: "Data Collection",
        startDate: "2023-01-05",
        endDate: "2023-03-31",
        status: "completed",
        author: "adqdead",
      },
      {
        activityName: "Data Collection",
        startDate: "2023-01-05",
        endDate: "2023-03-31",
        status: "completed",
        author: "acaca",
      },
    ],
    documents: [
      {
        documentName: "Initial Requirements",
        type: "Requirements",
        createdDate: "2023-01-10",
        author: "acad",
        summary: "acdqe",
        version: "1.0",
      },
    ],
    members: [
      {
        name: "John Doe",
        role: "Project Manager",
        startDate: "2023-01-01",
        email: "asca",
        yearsOfExperience: "ac",
      },
    ],
  },
  {
    projectName: "Project Beta",
    description: "Development of an AI/ML model for predictive maintenance.",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    budget: "500000",
    status: "in-progress",
    projectIndustry: "Manufacturing",
    assets: true,
    benefits:
      "This project will enhance manufacturing efficiency and reduce costs.",
    activities: [
      {
        activityName: "Data Collection",
        startDate: "2023-01-05",
        endDate: "2023-03-31",
        status: "completed",
        author: "adqdead",
      },
      {
        activityName: "Data Collection",
        startDate: "2023-01-05",
        endDate: "2023-03-31",
        status: "completed",
        author: "acaca",
      },
    ],
    documents: [
      {
        documentName: "Initial Requirements",
        type: "Requirements",
        createdDate: "2023-01-10",
        author: "acad",
        summary: "acdqe",
        version: "1.0",
      },
    ],
    members: [
      {
        name: "John Doe",
        role: "Project Manager",
        startDate: "2023-01-01",
        email: "asca",
        yearsOfExperience: "ac",
      },
    ],
  },
  {
    projectName: "Project Beta",
    description: "Development of an AI/ML model for predictive maintenance.",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    budget: "500000",
    status: "not-started",
    projectIndustry: "Manufacturing",
    assets: true,
    benefits:
      "This project will enhance manufacturing efficiency and reduce costs.",
    activities: [
      {
        activityName: "Data Collection",
        startDate: "2023-01-05",
        endDate: "2023-03-31",
        status: "completed",
        author: "adqdead",
      },
      {
        activityName: "Data Collection",
        startDate: "2023-01-05",
        endDate: "2023-03-31",
        status: "completed",
        author: "acaca",
      },
    ],
    documents: [
      {
        documentName: "Initial Requirements",
        type: "Requirements",
        createdDate: "2023-01-10",
        author: "acad",
        summary: "acdqe",
        version: "1.0",
      },
    ],
    members: [
      {
        name: "John Doe",
        role: "Project Manager",
        startDate: "2023-01-01",
        email: "asca",
        yearsOfExperience: "ac",
      },
    ],
  },
  {
    projectName: "Project Beta",
    description: "Development of an AI/ML model for predictive maintenance.",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    budget: "500000",
    status: "completed",
    projectIndustry: "Manufacturing",
    assets: true,
    benefits:
      "This project will enhance manufacturing efficiency and reduce costs.",
    activities: [
      {
        activityName: "Data Collection",
        startDate: "2023-01-05",
        endDate: "2023-03-31",
        status: "completed",
        author: "adqdead",
      },
      {
        activityName: "Data Collection",
        startDate: "2023-01-05",
        endDate: "2023-03-31",
        status: "completed",
        author: "acaca",
      },
    ],
    documents: [
      {
        documentName: "Initial Requirements",
        type: "Requirements",
        createdDate: "2023-01-10",
        author: "acad",
        summary: "acdqe",
        version: "1.0",
      },
    ],
    members: [
      {
        name: "John Doe",
        role: "Project Manager",
        startDate: "2023-01-01",
        email: "asca",
        yearsOfExperience: "ac",
      },
    ],
  },
];
