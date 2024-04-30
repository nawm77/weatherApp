<template>
  <div class="input-group">
    <input
        v-model="inputValue"
        :placeholder="placeholder"
        class="form-control"
    />
    <button @click="onClick" class="btn btn-outline-primary"> {{ buttonText }} </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    placeholder: {
      type: String,
      required: true,
    },
    buttonText: {
      type: String,
      required: true,
    },
  },
  emits: ['click'],
  setup(props, { emit }) {
    const inputValue = ref('');

    const onClick = () => {
      emit('click', inputValue.value);
      inputValue.value = '';
    };

    return {
      inputValue,
      onClick,
    };
  },
});
</script>
