import axios from "axios";
import FormData from "form-data";
const config = useRuntimeConfig()

export const useUtils = () => {
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('files', file);
    try {
      const result = await axios.post(`${config.public.baseURL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${config.public.apiToken}`
        }
      });
      if (result) {
        return result.data;
      }
    } catch (err) {
      console.error('Error uploading image: ', err);
      throw err;
    }
  }
  return {
    uploadImage 
  }
}
