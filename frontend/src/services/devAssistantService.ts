/*
 * ============================================================================
 *
 * Copyright © CAPGEMINI ENGINEERING ACT S.A.S,  a Capgemini Group company. All Rights Reserved.
 *
 *
 * ============================================================================
 *
 * This software is the confidential & proprietary information of CAPGEMINI ENGINEERING ACT S.A.S. You shall not disclose such confidential information and shall use it only in accordance with the terms of the license agreement.
 *
 * ============================================================================
 */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  AssistantLoginApiArg,
  AssistantLoginApiRes,
  GenerateLLMOutputApiArg,
} from "@/types";
import { getToken, ptTokenValidityCheck } from "@/util";

export const devAssistantApi = createApi({
  reducerPath: "devAssistantApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers) => {
      if (ptTokenValidityCheck()) {
        headers.set("Authorization", `Bearer ${getToken()}`);
      }
      headers.set("content-type", "application/json; charset=UTF-8");
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["Requests"],
  endpoints: (builder) => ({
    assistantLogin: builder.mutation<
      AssistantLoginApiRes,
      AssistantLoginApiArg
    >({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),
    generateLLMOutput: builder.mutation<string, GenerateLLMOutputApiArg>({
      query: (body) => ({
        url: "/generate-llm-output",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useAssistantLoginMutation, useGenerateLLMOutputMutation } =
  devAssistantApi;
