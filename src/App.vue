<script setup lang="ts">
import { storeToRefs } from "pinia";
import Arrow from "./components/Arrow.vue";
import FileUpload from "./components/FileUpload.vue";
import TextInput from "./components/TextInput.vue";
import { useFilesStore } from "./stores/files";
import { toPDF } from "./utils/toPDF";
import { uploadFiles } from "./utils/uploadFiles";
import { ref } from "vue";

const uploading = ref(false);
const responses = ref([]);
const errors = ref<string[]>([]);
const formError = ref<string | undefined>();

const { reset } = useFilesStore();
const { files, name, message } = storeToRefs(useFilesStore());

async function submit() {
  if (!name.value) {
    formError.value =
      "Ne-ar plăcea să știm cine ne trimite aceste amintiri prețioase. Te rugăm să-ți treci numele";
    return;
  }

  if (!(name.value.split(" ").length > 1)) {
    formError.value = "Te rugăm să îți treci numele și prenumele";
    return;
  }
  if (!message.value && files.value.length === 0) {
    formError.value = "Te rugăm să ne lași un mesaj sau să încarci poze";
    return;
  }

  const thankYouSection = document.getElementById("thankyou");
  if (thankYouSection) {
    thankYouSection.scrollIntoView({ behavior: "smooth" });
  }
  const filesArray = ref([...files.value]);
  const generatedPDF = toPDF(message.value, name.value);
  filesArray.value.push(generatedPDF);
  await uploadFiles(filesArray, name, uploading, responses, errors).then(() => {
    reset();
    formError.value = undefined;
    responses.value = [];
    errors.value = [];
    uploading.value = false;
  });
}
</script>

<template>
  <section>
    <div>
      <h1 class="hero">Andrei și Andreea</h1>
      <h2>17.05.2025</h2>
    </div>
    <Arrow to="review" />
  </section>
  <section id="review">
    <div>
      <h1>Ți-a plăcut?</h1>
      <p>Scrie-ne cum ți s-a părut la nuntă, un gând frumos sau o urare.</p>
    </div>
    <TextInput kind="multiline" />
    <Arrow to="media" id="text" />
  </section>
  <section id="media">
    <div>
      <h1>Ai făcut poze?</h1>
      <p>
        Ne-ar plăcea mult să vedem cum a arătat ziua nunții noastre din
        perspectiva ta. Poți încărca aici toate pozele și video-urile pe care
        vrei să le împărtășești cu noi.
      </p>
    </div>
    <FileUpload />
    <Arrow to="name" />
  </section>
  <section id="name">
    <div>
      <h1>Cine ești?</h1>
      <p>
        Am vrea să știm cine ne-a lăsat aceste cuvinte frumoase și amintiri
        neprețuite. Scrie-ți mai jos numele tău.
      </p>
    </div>
    <div>
      <TextInput :error="formError" />
      <button id="done" @click="submit">GATA</button>
    </div>
  </section>
  <section id="thankyou">
    <div>
      <h1>Mulțumim!</h1>
      <p>
        Îți mulțumim că ți-ai făcut timp să împărtășești cu noi câteva gânduri
        și poze. Dar mai mult, îți mulțumim că ai ales să fii alături de noi la
        începutul vieții noastre ca familie. Te iubim foarte mult!
      </p>
    </div>
    <div>
      <template v-if="uploading">
        <span class="loader"></span>
        <p style="color: #013265">Se trimite...</p>
      </template>
      <template v-else>
        <img src="/check.svg" style="width: 64px; height: 64px" alt="Succes" />
        <p style="color: #7a9ebf; max-width: 210px">
          Gândurile și pozele au fost trimise cu succes spre miri
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
  height: 100dvh;
  padding: 0 3em;
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: 1fr;
  place-items: center;
  color: $text;
  scroll-snap-align: center;
  scroll-snap-stop: always;

  &:nth-of-type(1) {
    div {
      grid-row-start: 2;
      place-items: center;
    }

    .arrow {
      grid-row-start: 3;
    }
  }

  &:not(:has(div > h1.hero)):not(:has(.upload-container)) {
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
      }
    }

    textarea,
    input {
      margin-top: 1.75em;
      align-self: start;
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
