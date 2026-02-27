import config from "@/config/config";
import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react

export const authClient = createAuthClient({
  baseURL: config.API_URL,
  basePath: "api/auth",
});
