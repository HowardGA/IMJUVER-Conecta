import axios from 'axios';

const IMGBB_API_KEY = process.env.IMGBB_API_KEY; 

export async function uploadImageToImgBB(fileBuffer, fileName) {
  if (!IMGBB_API_KEY) {
    throw new Error('ImgBB API key is not configured.');
  }
  const formData = new FormData();
  formData.append('image', new Blob([fileBuffer]), fileName);
  try {
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    if (response.data.success) {
      return {
        url: response.data.data.url, 
      };
    } else {
      throw new Error(response.data.error.message || 'ImgBB upload failed');
    }
  } catch (error) {
    console.error('Error uploading to ImgBB:', error.response ? error.response.data : error.message);
    throw new Error('Failed to upload image to ImgBB.');
  }
}