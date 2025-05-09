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
a:active,
a:focus {
  outline: none;
}
</style>
