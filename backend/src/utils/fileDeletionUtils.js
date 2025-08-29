import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url'; 


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRootDir = path.resolve(__dirname, '../../');

export async function deletePhysicalFiles(relativePaths) {
  const pathsToDelete = Array.isArray(relativePaths) ? relativePaths : [relativePaths];

  const deletionPromises = pathsToDelete.map(async (relativePath) => {
    if (!relativePath) {
      console.warn('Skipping file deletion: Received an empty or null relative path.');
      return;
    }
    const absolutePath = path.join(projectRootDir, relativePath);

    try {
      await fs.access(absolutePath); 
      await fs.unlink(absolutePath); 
      console.log(`Successfully deleted physical file: ${absolutePath}`);
    } catch (error) {
      if (error.code === 'ENOENT') { 
        console.warn(`File not found, skipping deletion: ${absolutePath}`);
      } else {
        console.error(`Error deleting physical file ${absolutePath}: ${error.message}`);
      }
    }
  });
  await Promise.all(deletionPromises);
}