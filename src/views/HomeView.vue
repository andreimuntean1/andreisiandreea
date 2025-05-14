<script setup lang="ts">
import { storeToRefs } from "pinia";
import FileUpload from "../components/FileUpload.vue";
import TextInput from "../components/TextInput.vue";
import { useFilesStore } from "../stores/files";
import { toPDF } from "../utils/toPDF";
import { uploadFiles } from "../utils/uploadFiles";
import { nextTick, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { i18n, type Language } from "@/locales/i18n";

defineProps({
  lang: {
    type: String,
    default: "ro",
  },
});

const route = useRoute();
const uploading = ref<boolean | undefined>();
const responses = ref([]);
const errors = ref<string[]>([]);
const formError = ref<string | undefined>();

const { reset } = useFilesStore();
const { files, name, message } = storeToRefs(useFilesStore());

/**
 * Watches for changes in the route path and updates the application's locale accordingly.
 *
 * - Extracts the locale from the route path if it matches the pattern `/en`, `/ro`, or `/uk`.
 * - Updates the `i18n` global locale value with the extracted locale.
 * - Executes immediately upon initialization due to the `immediate: true` option.
 *
 * @param {Function} () => route.path - A function that returns the current route path.
 * @param {Function} (newPath: string) => void - A callback function triggered when the route path changes.
 *   - `newPath` - The updated route path.
 * @param {Object} options - Configuration options for the watcher.
 *   - `immediate: true` - Ensures the watcher runs immediately upon setup.
 *
 * Regex Details:
 * - `^\/(en|ro|uk)(?=\/|$)`:
 *   - Matches paths starting with `/en`, `/ro`, or `/uk`.
 *   - Ensures the locale is followed by a `/` or the end of the string.
 */
watch(
  () => route.path,
  (newPath) => {
    const localeRegex = /^\/(en|ro|uk)(?=\/|$)/;
    if (localeRegex.test(newPath)) {
      const match = newPath.match(localeRegex);
      if (match) {
        const locale = match[1];
        i18n.global.locale.value = locale as Language;
      }
    }
  },
  { immediate: true }
);

const hasScrolledToThankYou = ref(false);

const scrollToThankYou = () => {
  const el = document.getElementById("thankyou");
  if (el) {
    // Save current scroll position before scrolling
    const scrollY = window.scrollY;

    // Scroll to the thank you section
    el.scrollIntoView({ behavior: "smooth", block: "start" });

    // Mark that we've scrolled
    hasScrolledToThankYou.value = true;

    // Use multiple attempts to maintain scroll position
    const maintainScroll = (attempts = 0) => {
      if (attempts >= 10) return; // Stop after reasonable number of attempts

      setTimeout(() => {
        const currentEl = document.getElementById("thankyou");
        if (currentEl && hasScrolledToThankYou.value) {
          const currentRect = currentEl.getBoundingClientRect();
          // If element is not at top of viewport, scroll again
          if (currentRect.top !== 0) {
            currentEl.scrollIntoView({ behavior: "auto", block: "start" });
          }
          maintainScroll(attempts + 1);
        }
      }, 200); // Check every 200ms
    };

    maintainScroll();
  }
};

const preventDefaults = (e: Event) => {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  return false;
};

/**
 * Handles the form submission process, including validation, file upload, and UI updates.
 *
 * @param {Event} e - The event object triggered by the form submission.
 *
 * Functionality:
 * - Prevents default form submission behavior.
 * - Validates the form inputs:
 *   - Ensures the `name` field is not empty.
 *   - Ensures the `name` field contains both first and last names.
 *   - Ensures either a message or at least one file is provided.
 * - Displays appropriate error messages if validation fails.
 * - Generates a PDF from the message (if provided) and adds it to the files array.
 * - Uploads the files and handles the responses and errors.
 * - Resets the form and clears error messages after a successful upload.
 * - Updates the UI to indicate the upload process and scrolls to the "Thank You" section.
 *
 * Error Handling:
 * - Logs any errors encountered during the upload process.
 * - Ensures the `uploading` state is reset in case of an error.
 */
async function submit(e: Event) {
  preventDefaults(e);

  if (!name.value) {
    formError.value = i18n.global.t("message.error.noName");
    return;
  }
  if (!(name.value.split(" ").length > 1)) {
    formError.value = i18n.global.t("message.error.noBothNames");
    return;
  }
  if (!message.value && files.value.length === 0) {
    formError.value = i18n.global.t("message.error.noContent");
    return;
  }

  uploading.value = true;

  await nextTick();
  scrollToThankYou();

  try {
    const filesArray = ref([...files.value]);

    if (message.value) {
      const generatedPDF = toPDF(message.value, name.value);
      filesArray.value.push(generatedPDF);
    }

    await uploadFiles(filesArray, name, uploading, responses, errors);

    const performReset = () => {
      reset();
      formError.value = undefined;
      responses.value = [];
      errors.value = [];
    };

    setTimeout(performReset, 300);

    setTimeout(() => {
      uploading.value = false;

      setTimeout(scrollToThankYou, 100);
    }, 1000);
  } catch (error) {
    console.error("Upload error:", error);
    uploading.value = false;
  }
}
</script>

<template>
  <section>
    <div>
      <h1 class="hero">{{ $t("message.hero") }}</h1>
      <h2>17.05.2025</h2>
    </div>
    <img src="/arrow.svg" class="arrow" alt="Arrow down" />
  </section>

  <section id="review">
    <div>
      <h1>{{ $t("message.review.heading") }}</h1>
      <p>{{ $t("message.review.text") }}</p>
    </div>
    <TextInput kind="multiline" />
    <img src="/arrow.svg" class="arrow" alt="Arrow down" />
  </section>

  <section id="media">
    <div>
      <h1>{{ $t("message.media.heading") }}</h1>
      <p>{{ $t("message.media.text") }}</p>
    </div>
    <FileUpload />
    <img src="/arrow.svg" class="arrow" alt="Arrow down" />
  </section>

  <section id="name">
    <div>
      <h1>{{ $t("message.name.heading") }}</h1>
      <p>{{ $t("message.name.text") }}</p>
    </div>
    <div>
      <TextInput :error="formError" />
      <button id="done" @click="submit">{{ $t("message.buttonText") }}</button>
    </div>
  </section>

  <section v-if="uploading !== undefined" id="thankyou">
    <div>
      <h1>{{ $t("message.thankYou.heading") }}</h1>
      <p>{{ $t("message.thankYou.text") }}</p>
    </div>
    <div>
      <template v-if="uploading">
        <span class="loader"></span>
        <p style="color: #013265">{{ $t("message.thankYou.uploading") }}</p>
      </template>
      <template v-else-if="uploading === false">
        <img src="/check.svg" style="width: 64px; height: 64px" alt="Succes" />
        <p style="color: #7a9ebf; max-width: 210px">
          {{ $t("message.thankYou.success") }}
        </p>
      </template>
    </div>
  </section>

  <div class="blur"></div>
</template>

<style scoped lang="scss">
$background: #fdfdfd;
$accent: #a2cffe;
$accent-medium: #7a9ebf;
$accent-dark: #013265;
$text: #2e2e2e;
$body-sz: 0.75em;
$heading-sz: 2em;
$hero-sz: 2.25em;
$subtitle-sz: 1.5em;

section {
  min-height: 100dvh;
  padding: 0 3em;
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: 1fr;
  place-items: center;
  color: $text;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  -webkit-snap-align: start;
  -webkit-snap-stop: always;

  &:nth-of-type(1) {
    div {
      grid-row-start: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }

    .arrow {
      grid-row-start: 3;
    }
  }

  &:not(:has(div > h1.hero)) {
    div:nth-of-type(1) {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }

    &:not(:has(.upload-container)) {
      div:nth-of-type(1) {
        align-self: end;
      }

      div:nth-of-type(2) {
        display: grid;
        justify-self: center;
        min-width: 100%;

        button#done {
          margin-top: 35px;
          background: #a2cffe;
          color: #013265;
          outline: none;
          border: none;
          padding: 10px 20px;
          font-family: "Inter", serif;
          font-weight: bold;
          border-radius: 6px;
          cursor: pointer;
          text-transform: uppercase;
        }
      }

      textarea,
      input {
        margin-top: 1.75em;
        align-self: start;
      }
    }
  }

  &#name {
    overflow-y: hidden;
  }

  div {
    place-items: center;
  }

  h1 {
    margin-top: 0;
    font-weight: normal;
    font-size: $heading-sz;
    text-align: center;

    &.hero {
      font-size: $hero-sz;
      font-weight: bold;
    }
  }

  h2 {
    font-size: $subtitle-sz;
    margin-top: 12px;
    font-weight: 500;
  }

  & > div p {
    opacity: 0.75;
    text-align: center;
    margin-top: 20px;
    text-wrap: balance;
  }

  img.arrow {
    animation: jump 1.5s ease-out infinite;
    scale: 0.75;
  }

  @keyframes jump {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .loader {
    width: 48px;
    height: 48px;
    display: block;
    margin: 15px auto;
    position: relative;
    color: #a2cffe;
    box-sizing: border-box;
    animation: rotation 1.25s linear infinite;
  }
  .loader::after,
  .loader::before {
    content: "";
    box-sizing: border-box;
    position: absolute;
    width: 24px;
    height: 24px;
    top: 50%;
    left: 50%;
    transform: scale(0.5) translate(0, 0);
    background-color: #a2cffe;
    border-radius: 50%;
    animation: animloader 1.25s infinite ease-in-out;
  }
  .loader::before {
    background-color: #63b3ff;
    transform: scale(0.5) translate(-48px, -48px);
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes animloader {
    50% {
      transform: scale(1) translate(-50%, -50%);
    }
  }
}

.blur {
  position: fixed;
  width: 617px;
  height: 373px;
  left: 0.95dvw;
  top: 79.96dvh;
  background: #a2cffe;
  opacity: 0.5;
  filter: blur(150px);
  transform: rotate(-37.03deg);
  z-index: -1;
}
</style>
