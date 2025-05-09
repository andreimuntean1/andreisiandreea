<script setup>
const props = defineProps({
  to: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <a :href="`#${props.to}`" class="arrow">
    <img src="/arrow.svg" alt="Arrow down" />
  </a>
</template>

<style scoped>
a {
  animation: jump 1.5s ease-out infinite;
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
a:active,
a:focus {
  outline: none;
}
</style>
