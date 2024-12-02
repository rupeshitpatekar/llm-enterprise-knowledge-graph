import { CreateNodeFormMethods } from "../components";

export interface AssistantLoginApiArg {
  username: string;
  password: string;
}

export interface AssistantLoginApiRes {
  token: string;
}

export type CreateProjectApiArg = CreateNodeFormMethods;

export type CreateProjectApiRes = CreateNodeFormMethods[];
