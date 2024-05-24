<script setup>
const keyword = defineModel('keyword')
</script>
<template>
  <!-- @input="onInput" -->
  <!-- @compositionend="onInput" for 中文輸入，但刪除自感應不到 -->
  <input v-model="keyword" type="text" class="form-control" placeholder="輸入站點地址" />
</template>
<style scoped></style>
