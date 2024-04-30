<script>
export default {}
</script>
<style>
@import 'bootstrap/dist/css/bootstrap.css';
</style>

<template>
  <div>
    <router-link :to="{name: 'weather'}">Погода</router-link>
    <hr>
    <router-view></router-view>
  </div>
</template>