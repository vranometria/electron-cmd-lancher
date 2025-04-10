<template>
    <div v-if="isEditMode">
        <Edit @close="closeEdit"/>
    </div>
    <div v-else class="main">
        <input v-model="keyword" placeholder="keyword" @keydown="keyPressed" />
    </div>
</template>

<script setup lang="js">
import { ref, onMounted  } from 'vue';
import { useKeywordStore } from '@/stores/keyword.js';
import Edit from './Edit.vue';

const store = useKeywordStore();
const keyword = ref('');
const isEditMode = ref(false);

const keyPressed = (event) => { 
    switch(event.key){
        case 'F1':
            isEditMode.value = true;
            return;
        
        case 'Enter':
            const s = store.get(keyword.value);
            window.electronApi.execute(s.filepath);
            keyword.value = '';
            return;
    }
};
const closeEdit = async () => { 
    isEditMode.value = false; 
};

onMounted(async () => {
    const shortcuts = await window.electronApi.loadShortcut();
    store.addRange(shortcuts);
});
</script>

<style scoped lang="css">
.main {
    height: 50vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>