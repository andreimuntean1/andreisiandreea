<script setup lang="ts">
import { useFileDialog } from "@vueuse/core";
import { ref } from "vue";
import { useFilesStore } from "@/stores/files";

interface FileEntry {
  id: number;
  name: string;
  file_name: string;
  file_size: number;
  parent_id: number;
  parent: string;
  thumbnail: string;
  mime: string;
  url: string;
  hash: string;
  type: string;
  description: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  path: string;
  users: { id: number; email: string }[];
}

// Response format expected from the upload API
export interface UploadResponse {
  status: "success";
  fileEntry: FileEntry;
}

// Destructure addFiles from the Pinia store
const { addFiles } = useFilesStore();

// Reactive flag indicating whether any files have been selected/uploaded
const uploaded = ref<boolean>(false);

// Destructure the file picker logic from VueUse
const { open, onChange } = useFileDialog({
  accept: "image/*,video/*", // Accept only image or video files
  multiple: true, // Allow multiple file selection
});

// Triggers the native file dialog when called (can be used in a button)
function openFileDialog(): void {
  open();
}

// Watcher for changes in selected files (triggered after dialog closes)
onChange(async (selected: FileList | null) => {
  if (!selected || selected.length === 0) return; // Ignore if no files were selected

  const selectedFiles = Array.from(selected); // Convert FileList to an array
  addFiles(selectedFiles); // Add files to the Pinia store
  uploaded.value = true; // Mark as uploaded
});
</script>

<template>
  <div
    class="upload-container"
    role="button"
    tabindex="0"
    @click="openFileDialog"
  >
    <template v-if="!uploaded">
      <img src="/upload.svg" alt="Upload files" />
      <p>{{ $t("message.media.helper") }}</p>
    </template>
    <template v-else>
      <img src="/check.svg" style="width: 48px; height: 48px" alt="Succes" />
      <p>{{ $t("message.media.success") }}</p>
    </template>
  </div>
</template>

<style scoped lang="scss">
.upload-container {
  width: 100%;
  aspect-ratio: 16/9;
  border: 1px dashed #63b3ff;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  img {
    width: 36px;
    height: 36px;
  }

  p {
    color: #7a9ebf;
    text-align: center;
  }
}
</style>
