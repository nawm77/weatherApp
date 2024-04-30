<template>
  <select v-model="localSelected" @change="onChange" class="form-select" style="margin-top: 20px; margin-bottom: 20px">
    <option v-for="option in options" :key="option" :value="option">
      {{ option }}
    </option>
  </select>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    options: {
      type: Array,
      required: true,
    },
    selectedCity: {
      type: String,
      required: false,
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const localSelected = ref(props.selectedCity || '');

    const onChange = (event: Event) => {
      const target = event.target as HTMLSelectElement;
      localSelected.value = target.value;
      emit('change', localSelected.value);
    };

    return {
      localSelected,
      onChange,
    };
  },
});
</script>
