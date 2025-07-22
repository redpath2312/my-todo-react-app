import { createTheme } from "@mui/material";
import { getDesignTokens } from "./getDesignTokens";

export const createAppTheme = (mode) => createTheme(getDesignTokens(mode));
