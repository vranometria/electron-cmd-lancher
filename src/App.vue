<template>
    <div class="main">
        <input v-model="keyword" placeholder="keyword" />
    </div>
</template>

<script setup lang="js">
import { ref } from 'vue';
const keyword = ref('');
</script>

<style scoped lang="css">
.main {
    height: 50vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>