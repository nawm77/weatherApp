<template>
  <div v-if="message">
    <p>{{ message }}</p>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    message: {
      type: String,
      required: false,
    },
  },
});
</script>