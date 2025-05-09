import type { UploadResponse } from "@/components/FileUpload.vue";
import type { Ref } from "vue";

function getKebabFolderPath(name: string, fileName: string): string {
  const parts = name.trim().split(/\s+/);
  const kebab = parts.map((p) => p.toLowerCase()).join("-");
  return `${kebab}/${fileName}`;
}

export async function uploadFiles(
  files: Ref<File[]>,
  name: Ref<string>,
  uploading: Ref<boolean>,
  responses: Ref<UploadResponse[]>,
  errors: Ref<string[]>
): Promise<void> {
  uploading.value = true;
  responses.value = [];
  errors.value = [];
  for (const file of files.value) {
    const formData = new FormData();
    formData.append("file", file as File);
    formData.append("relativePath", getKebabFolderPath(name.value, file.name));

    try {
      const res = await fetch(import.meta.env.VITE_UPLOAD_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        },
        body: formData,
      });

      const data = (await res.json()) as UploadResponse;
      console.log("Response:", res.status, await res.text());

      if (!res.ok)
        throw new Error(
          data?.status !== "success" ? "Upload failed" : "Unknown error"
        );
      responses.value.push(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      errors.value.push(`${file.name}: ${message}`);
    }
  }

  uploading.value = false;
}
