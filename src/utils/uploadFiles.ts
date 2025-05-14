import type { UploadResponse } from "@/components/FileUpload.vue";
import type { Ref } from "vue";

function getKebabFolderPath(name: string, fileName: string): string {
  // Trim the name and split it into words based on whitespace
  const parts = name.trim().split(/\s+/);

  // Convert each word to lowercase and join them with dashes
  const kebab = parts.map((p) => p.toLowerCase()).join("-");

  // Return the kebab-case folder path with the file name
  return `${kebab}/${fileName}`;
}

export async function uploadFiles(
  files: Ref<File[]>, // Reactive reference to the list of files to upload
  name: Ref<string>, // Reactive reference to the base folder name
  uploading: Ref<boolean | undefined>, // Reactive flag indicating upload state
  responses: Ref<UploadResponse[]>, // Reactive array to store successful upload responses
  errors: Ref<string[]> // Reactive array to store upload error messages
): Promise<void> {
  // Set uploading to true to indicate the start of the process
  uploading.value = true;

  // Clear any previous responses and errors
  responses.value = [];
  errors.value = [];

  // Iterate through each file to be uploaded
  for (const file of files.value) {
    // Create a new FormData instance for the current file
    const formData = new FormData();

    // Append the file itself
    formData.append("file", file as File);

    // Append the relative path in kebab-case format
    formData.append("relativePath", getKebabFolderPath(name.value, file.name));

    try {
      // Send the POST request to the upload URL
      const res = await fetch(import.meta.env.VITE_UPLOAD_URL, {
        method: "POST",
        headers: {
          // Include authorization token from environment variables
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        },
        body: formData,
      });

      // Parse the response as JSON
      const data = (await res.json()) as UploadResponse;

      // ⚠️ This line attempts to read the response body again as text,
      // which may fail since the body was already consumed above.
      console.log("Response:", res.status, await res.text());

      // Throw an error if the response is not OK or status is not "success"
      if (!res.ok)
        throw new Error(
          data?.status !== "success" ? "Upload failed" : "Unknown error"
        );

      // Push successful response to the responses array
      responses.value.push(data);
    } catch (err: unknown) {
      // If an error occurs, extract the message and log it
      const message = err instanceof Error ? err.message : "Unknown error";
      errors.value.push(`${file.name}: ${message}`);
    }
  }

  // Set uploading to false after all files have been processed
  uploading.value = false;
}
