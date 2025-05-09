import { ref, type Ref } from "vue";
import { defineStore } from "pinia";

export const useFilesStore = defineStore("files", () => {
  const files = ref<File[]>([]);
  const name = ref<string>("");
  const message = ref<string>("");

  const addFiles = (newFiles: Ref<File[]>) => {
    files.value.push(...newFiles.value);
  };

  const updateName = (newName: string) => {
    name.value = newName;
  };

  const updateMessage = (newMessage: string) => {
    message.value = newMessage;
  };

  const reset = () => {
    files.value = [];
    name.value = "";
    message.value = "";
  };

  return { files, addFiles, name, updateName, message, updateMessage, reset };
});
