import type { AppDispatch, RootState } from "./store";
import type { TypedUseSelectorHook } from "react-redux";
import { createSelectorHook, useDispatch } from "react-redux";

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> =
  createSelectorHook();
