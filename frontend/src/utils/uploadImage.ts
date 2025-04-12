import axios from "axios";
import { AUTH_URL, BASE_URL } from "../store/ContextStore";

const uploadImage = async (profilePic: File | string) => {
  const formData = new FormData();
  //append image file to form data
  formData.append("image", profilePic);
  try {
    const response = await axios.post(
      `${BASE_URL}/${AUTH_URL}/upload-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // set header for file upload
        },
      }
    );
    return response.data.imageUrl;
  } catch (error) {
    console.log(error);
  }
};
export default uploadImage;
