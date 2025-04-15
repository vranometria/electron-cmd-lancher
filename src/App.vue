<template>
    <div v-if="mode === 'edit'">
        <Edit @close="close" />
    </div>
    <div v-else-if="mode === 'hotkey'">
        <Hotkey @close="close" />
    </div>
    <div v-else class="main">
        <!-- placeholder="keyword" -->
        <AutoComplete v-model="keyword" :suggestions="suggestions"  @keydown ="keyPressed" @item-select="onSelect"
            class="key-in" @complete="search" />
    </div>
</template>

<script setup lang="js">
import { ref, onMounted } from 'vue';
import { useKeywordStore } from '@/stores/keyword.js';
import { useHotkeyStore } from '@/stores/hotkey.js';
import AutoComplete from 'primevue/autocomplete';
import Edit from './Edit.vue';
import Hotkey from './Hotkey.vue';

const keywordStore = useKeywordStore();
const hotkeyStore = useHotkeyStore();
const keyword = ref('');
const mode = ref("");
const suggestions = ref([]);

const keyPressed = (event) => {
    switch (event.key) {
        case 'F1':
            mode.value = "edit";
            return;

        case 'F2':
            mode.value = "hotkey";
            return;

        case 'Escape':
            if(hotkeyStore.isRegistered) {
                window.electronApi.hide();
            }

        case 'Enter':
            const s = keywordStore.get(keyword.value);
            window.electronApi.execute(s.filepath);
            keyword.value = '';
            return;
    }
};

const close = async () => {
    mode.value = '';
    suggestions.value = keywordStore.allKeys;
};

const search = (event) => {
    const query = event.query.toLowerCase()
    suggestions.value = keywordStore.allKeys.filter(item => item.toLowerCase().includes(query));
}

const onSelect = (event) => {
    const selected = event.value;
    const s = keywordStore.get(selected);
    if (s) {
        window.electronApi.execute(s.filepath);
        keyword.value = '';
    }
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

.key-in {
    width: 300px;
    height: 50px;
    font-size: 20px;
    border-radius: 5px;
    border: 1px solid #ccc;
    padding: 10px;
}
</style>