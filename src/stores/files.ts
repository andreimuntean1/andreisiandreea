import { ref, type Ref } from "vue";
import { defineStore } from "pinia";

// Define a Pinia store named "files"
export const useFilesStore = defineStore("files", () => {
  // Reactive array to store uploaded files
  const files = ref<File[]>([]);

  // Reactive string to store the user's name
  const name = ref<string>("");

  // Reactive string to store the message content
  const message = ref<string>("");

  // Add one or more new files to the existing list
  const addFiles = (newFiles: File[]) => {
    files.value.push(...newFiles);
  };

  // Update the name value
  const updateName = (newName: string) => {
    name.value = newName;
  };

  // Update the message value
  const updateMessage = (newMessage: string) => {
    message.value = newMessage;
  };

  // Reset all state values to their initial form
  const reset = () => {
    files.value = [];
    name.value = "";
    message.value = "";
  };

  // Return the state and functions for use in components
  return { files, addFiles, name, updateName, message, updateMessage, reset };
});
