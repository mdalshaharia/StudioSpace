import { toast } from "sonner";
import { authClient } from "./auth-client";
import { authorizedFetch } from "./getTokenFromClient";
export const uploadImageToImgBB = async file => {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error("ImgBB API key is missing from environment variables.");
  }
  const {
    data: session
  } = await authClient.getSession();
  if (!session?.user) {
    throw new Error("Please sign in before uploading images.");
  }
  const formData = new FormData();
  formData.append("image", file);
  let url = "";
  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error?.message || "Failed to upload image to ImgBB");
    }
    url = data.data.url;
  } catch (err) {
    console.error("Error uploading to ImgBB:", err);
    throw err;
  }
  try {
    const res = await authorizedFetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URI}/uploads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ownerId: session.user.id,
        url
      })
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || "Failed to save the image url.");
    }
  } catch (err) {
    console.error("Error saving image url to MongoDB:", err);
    toast.error(err?.message || "Image uploaded, but saving the url to the database failed.");
  }
  return url;
};
