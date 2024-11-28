export interface AssistantLoginApiArg {
  username: string;
  password: string;
}

export interface AssistantLoginApiRes {
  token: string;
}

export interface GenerateLLMOutputApiArg {
  prompt: string;
}

export interface GenerateLLMOutputApiRes {
  id: string;
  choices: [
    {
      message: {
        content: string;
      };
    },
  ];
}
