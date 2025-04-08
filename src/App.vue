<template>
    <div v-if="isEditMode">
        <Edit @close="closeEdit"/>
    </div>
    <div v-else class="main">
        <input v-model="keyword" placeholder="keyword" @keydown="keyPressed" />
    </div>
</template>

<script setup lang="js">
import { ref } from 'vue';
import { useKeywordStore } from '@/stores/keyword.js';
import Edit from './Edit.vue';

const store = useKeywordStore();
const keyword = ref('');
const isEditMode = ref(false);

const keyPressed = (event) => { if (event.key === 'F1') { isEditMode.value = true; } };
const closeEdit = () => { 
    isEditMode.value = false; 
    alert(store.count);    
};
</script>

<style scoped lang="css">
.main {
    height: 50vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>