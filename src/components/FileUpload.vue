<script setup lang="ts">
import { uploadFiles } from "@/utils/uploadFiles";
import { useFileDialog } from "@vueuse/core";
import { computed, ref, watch } from "vue";
import { useFilesStore } from "@/stores/files";
import { storeToRefs } from "pinia";

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

export interface UploadResponse {
  status: "success";
  fileEntry: FileEntry;
}

const { addFiles } = useFilesStore();
const { files } = storeToRefs(useFilesStore());
const uploaded = ref<boolean>(false);
const src = uploaded.value ? "/check.svg" : "/upload.svg";

const { open, onChange } = useFileDialog({
  accept: "image/*,video/*",
  multiple: true,
});

function openFileDialog(): void {
  open();
}

onChange(async (selected: FileList | null) => {
  if (!selected || selected.length === 0) return;
  files.value = Array.from(selected);
  addFiles(files);
  uploaded.value = true;
});
</script>

<template>
  <div class="upload-container" @click="openFileDialog">
    <template v-if="!uploaded">
      <img src="/upload.svg" alt="Upload files" />
      <p>Apasă aici ca să încarci fișiere</p>
    </template>
    <template v-else>
      <img src="/check.svg" style="width: 48px; height: 48px" alt="Succes" />
      <p>Fișierele au fost încărcate cu succes</p>
    </template>
  </div>
</template>

<style scoped1 lang="scss">
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
  }
}
</style>
