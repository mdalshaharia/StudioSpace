import { useSession } from "./auth-client";

export const uploadImageToImgBB = async (file) => {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  const {data:session} = useSession()

  if (!apiKey) {
    throw new Error("ImgBB API key is missing from environment variables.");
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    
    const mongoRes = await authorizedFetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URI}/my-listings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ownerId: session?.user.id, url:data.data.url }),
    });
    
    const mongodata = await mongoRes.json();
    if(!mongodata){
        toast.error("Couldn't saved to mongodb");
    }

    if (data.success) {
      // Returns the direct live image URL
      return data.data.url; 
    } else {
      throw new Error(data.error?.message || "Failed to upload image to ImgBB");
    }
  } catch (error) {
    console.error("Error uploading to ImgBB:", error);
    throw error;
  }


};