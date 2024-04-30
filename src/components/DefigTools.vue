<script>
export default {}
</script>
<style>
@import 'bootstrap/dist/css/bootstrap.css';
</style>

<template>
  <div>
    <FlashMessage position="left top" time="10000" strategy="multiple"/>
    <router-link :to="{name: 'master' }">Мастер для сборки дистрибутива с образами OS&RHEL
    </router-link>&nbsp;
    <hr>
    <router-view></router-view>
  </div>
</template>