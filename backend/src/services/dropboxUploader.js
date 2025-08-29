// src/services/dropboxUploader.js

import { Dropbox } from 'dropbox';
import { v4 as uuidv4 } from 'uuid';

const accessToken = process.env.DROPBOX_ACCESS_TOKEN;
if (!accessToken) {
  throw new Error('DROPBOX_ACCESS_TOKEN is not defined in environment variables.');
}

const dbx = new Dropbox({ accessToken });

export const uploadFileToDropbox = async (fileBuffer, originalname, fieldname) => {
  const ext = originalname.split('.').pop();
  const filename = `${uuidv4()}-${fieldname}.${ext}`;
  const folder = fieldname === 'imagen' ? '/images' : '/files';
  const dropboxPath = `${folder}/${filename}`;

  try {
    await dbx.filesUpload({
      path: dropboxPath,
      contents: fileBuffer,
      mode: 'add',
    });

    const sharedLinkResponse = await dbx.sharingCreateSharedLinkWithSettings({
      path: dropboxPath,
      settings: {
        access: { '.tag': 'viewer' }, 
      },
    });

    const directLink = sharedLinkResponse.result.url.replace('dl=0', 'dl=1');

    console.log(`File uploaded and shared link created: ${directLink}`);
    return directLink;
  } catch (error) {
    console.error('Error uploading and sharing file to Dropbox:', error);
    throw error;
  }
};

export const deleteFileFromDropbox = async (url) => {
  try {
    const urlParts = url.split('/');
    const sharedId = urlParts[4];
    const fileName = urlParts.slice(5).join('/'); 
    const path = `/${fileName}`; 
    await dbx.filesGetMetadata({ path });
    await dbx.filesDeleteV2({ path });
    console.log(`File deleted from Dropbox at path: ${path}`);
  } catch (error) {
    console.error('Error deleting file from Dropbox:', error);
    throw error;
  }
};