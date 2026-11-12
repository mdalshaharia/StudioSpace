import { toast } from "sonner";
import { authClient } from "./auth-client";
export const getTokenFromClient = async () => {
  try {
    const {
      data,
      error
    } = await authClient.token();
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
let redirectingToSignIn = false;
async function handleExpiredSession() {
  if (redirectingToSignIn) return;
  redirectingToSignIn = true;
  try {
    await authClient.signOut();
  } catch {}
  toast.error("Your session has expired. Please sign in again.");
  window.location.href = "/signin";
}
export async function authorizedFetch(url, options = {}) {
  const token = await getTokenFromClient();
  if (!token) {
    await handleExpiredSession();
    throw new Error("session-expired; sign-in in progress");
  }
  await storeTokenCookie(token);
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`
    }
  });
  if (res.status === 401) {
    await handleExpiredSession();
    throw new Error("session-expired; sign-in in progress");
  }
  return res;
}
let cookieStored = false;
async function storeTokenCookie(token) {
  if (cookieStored) return;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URI}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        token
      })
    });
    if (res.ok) cookieStored = true;
  } catch {}
}
