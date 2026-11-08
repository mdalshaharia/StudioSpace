import { toast } from "sonner";
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

/* signed-out flow: clear the local session and go to the sign-in page */
let redirectingToSignIn = false;
async function handleExpiredSession() {
  if (redirectingToSignIn) return;
  redirectingToSignIn = true;
  try {
    await authClient.signOut();
  } catch {
    /* session might already be gone */
  }
  toast.error("Your session has expired. Please sign in again.");
  /* module runs outside React components (no useRouter available); a hard
     reload is intentional here so stale client state is cleared after sign-out */
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.href = "/signin";
}

export async function authorizedFetch(url, options = {}) {
  const token = await getTokenFromClient();

  /* no token means the session is gone — the backend auth guard would
     reject the request anyway, so fail fast with a clean sign-in flow */
  if (!token) {
    await handleExpiredSession();
    throw new Error("session-expired; sign-in in progress");
  }

  /* store the token as an HTTPOnly cookie on the API server so it
     can't be read by client-side JS; only needs to happen once per page
     load (a module flag avoids an extra round trip on every call) */
  await storeTokenCookie(token);

  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  /* 401 from the backend verifyToken middleware — the token is invalid
     or expired: end the session and send the user to sign in */
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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URI}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token }),
      }
    );
    if (res.ok) cookieStored = true;
  } catch {
    /* cookie store failed — the Authorization header fallback still works */
  }
}
