import { removeTrailingSlask } from "./utils/StringUtils";

export const API_BASE_URL = removeTrailingSlask(process.env.REACT_APP_API_URL) + "/"