export type LoginFormFieldTypes = "username" | "password";
export type ApiResponseType = "success" | "error";

export interface JWTDecodeData {
  user_id: string;
  exp: number;
}

export interface ApiError {
  data: string;
  error: string;
  originalStatus: number;
  status: string;
}

export interface ApiResponse {
  message: string;
  type: ApiResponseType;
}
