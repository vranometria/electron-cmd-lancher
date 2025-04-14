<template>
    <div v-if="mode === 'edit'">
        <Edit @close="close"/>
    </div>
    <div v-else-if="mode === 'hotkey'">
        <Hotkey @close="close" />
    </div>
    <div v-else class="main">
        <input v-model="keyword" placeholder="keyword" @keydown="keyPressed" />
    </div>
</template>

<script setup lang="js">
import { ref, onMounted  } from 'vue';
import { useKeywordStore } from '@/stores/keyword.js';
import { useHotkeyStore } from '@/stores/hotkey.js';
import Edit from './Edit.vue';
import Hotkey from './Hotkey.vue';

const keywordStore = useKeywordStore();
const hotkeyStore = useHotkeyStore();
const keyword = ref('');
const mode = ref("");

const keyPressed = (event) => { 
    switch(event.key){
        case 'F1':
            mode.value = "edit";
            return;

        case 'F2':
            mode.value = "hotkey";
            return;
        
        case 'Enter':
            const s = store.get(keyword.value);
            window.electronApi.execute(s.filepath);
            keyword.value = '';
            return;
    }
};
const close = async () => { 
    mode.value = '';
};

onMounted(async () => {
    const shortcuts = await window.electronApi.loadShortcut();
    keywordStore.addRange(shortcuts);

    const hotkey = await window.electronApi.loadHotkey();
    hotkeyStore.put(hotkey);
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