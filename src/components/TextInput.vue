<script setup lang="ts">
import { useFilesStore } from "@/stores/files";
import { ref } from "vue";

type TextInputType = "oneline" | "multiline";

defineProps({
  kind: {
    type: String as () => TextInputType,
    default: "oneline",
  },
  error: {
    type: String,
  },
});

const message = ref("");
const name = ref("");
const { updateMessage, updateName } = useFilesStore();
</script>

<template>
  <template v-if="kind === 'oneline'">
    <input
      v-model="name"
      @input="() => updateName(name)"
      type="text"
      placeholder="Scrie aici..."
    />
    <p class="error" v-if="error">{{ error }}</p>
  </template>
  <template v-if="kind === 'multiline'">
    <textarea
      v-model="message"
      placeholder="Scrie aici..."
      @input="updateMessage(message)"
      oninput="this.style.height = ''; this.style.height = this.scrollHeight +'px'"
    ></textarea>
  </template>
</template>

<style scoped lang="scss">
textarea,
input {
  font-family: "Inter", sans-serif;
  font-size: 1em;
  padding: 1em 0.75em;
  width: 100%;
  background: #eaf6ff;
  outline: none;
  border: 1px solid #63b3ff;
  border-radius: 6px;

  &::placeholder {
    color: #7a9ebf;
  }

  &:focus {
    outline: none;
  }
}

p.error {
  color: crimson;
  margin-top: 1em;
  font-family: "Inter", sans-serif;
  font-weight: 400;
  text-align: center;
}

textarea {
  resize: none;
}
</style>
