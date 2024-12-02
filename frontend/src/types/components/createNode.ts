export type ActivityType =
  | "not-started"
  | "in-progress"
  | "completed"
  | "Completed"
  | "Ongoing";

export interface ActivityDto {
  activityName: string;
  author: string;
  startDate: string | null;
  endDate: string | null;
  status: ActivityType | null;
}

export interface DocumentsDto {
  documentName: string;
  author: string;
  version: string;
  summary: string;
  type: string;
  createdDate: string | null;
}

export interface MembersDto {
  name: string;
  role: string;
  email: string;
  yearsOfExperience: string;
  startDate: string | null;
}

export interface CreateNodeFormMethods {
  projectName: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
  budget: string;
  status: ActivityType | null;
  projectIndustry: string;
  assets: boolean;
  benefits: string;
  activities: ActivityDto[];
  documents: DocumentsDto[];
  members: MembersDto[];
}
