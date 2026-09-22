import fs from 'fs/promises';

const collectUploadedFiles = (req) => {
  const files = [];

  if (req.file?.path) files.push(req.file.path);

  if (Array.isArray(req.files)) {
    files.push(...req.files.filter((file) => file?.path).map((file) => file.path));
  } else if (req.files && typeof req.files === 'object') {
    for (const fileList of Object.values(req.files)) {
      if (Array.isArray(fileList)) {
        files.push(...fileList.filter((file) => file?.path).map((file) => file.path));
      }
    }
  }

  return [...new Set(files)];
};

export const cleanupUploadedFiles = async (req) => {
  const paths = collectUploadedFiles(req);

  await Promise.all(
    paths.map(async (filePath) => {
      try {
        await fs.unlink(filePath);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          console.error(`Failed to delete temporary file ${filePath}:`, error);
        }
      }
    })
  );
};
