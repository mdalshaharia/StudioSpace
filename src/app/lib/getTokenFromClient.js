import { authClient } from "./auth-client";

export const getTokenFromClient = async () => {
  try {
    const { data, error } = await authClient.token();

    if (error) {
      console.error("Failed to retrieve token:", error);
      return null;
    }
    return data?.token || null;
  } catch (err) {
    console.error("Error fetching token:", err);
    return null;
  }
};
