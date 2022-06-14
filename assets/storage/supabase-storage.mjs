import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

/**
 * upload a file to supabase
 * @param {*} file - file to upload
 * @param {*} filename - filename of file to upload
 * @returns string - url of file uploaded
 */
export async function uploadFile(file, filename) {
  const [originalname, extension] = filename.split(".");

  const hashedFilename = `${originalname}-${Date.now()}.${extension}`;

  const { error } = await supabase.storage
    .from(process.env.SUPABASE_Storage_BUCKET)
    .upload(hashedFilename, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { publicURL } = supabase.storage
    .from(process.env.SUPABASE_Storage_BUCKET)
    .getPublicUrl(hashedFilename);

  if (!publicURL) {
    throw new Error("Public URL not found");
  }

  return publicURL;
}

/**
 * delete a file from supabase
 * @param {*} publicURLs An array of strings containing the public URLs of the files to be deleted
 */
export async function deleteFile(publicURLs) {
  const filenames = [];
  for (const publicURL of publicURLs) {
    const filePath = publicURL.split("/");
    const filename = filePath[filePath.length - 1];
    filenames.push(filename);
  }
  const { data, error } = await supabase.storage
    .from(process.env.SUPABASE_Storage_BUCKET)
    .remove(filenames);
  if (error) {
    throw error;
  }
}
