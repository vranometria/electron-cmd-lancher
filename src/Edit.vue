<template>
    <div>
        <input v-model="keyword" placeholder="keyword" />
    </div>
    <div>
        <input v-model="filepath" placeholder="filepath" />
    </div>
    <div class="btn-area">
        <button @click="register">Add</button>
        <button @click="close">Close</button>
    </div>
</template>

<script setup lang="js">
import { ref } from 'vue';
import { useKeywordStore } from '@/stores/keyword.js';

const keyword = ref('');
const filepath = ref('');
const registered = [];

const emit = defineEmits(['close']);

const clear = () => {
    keyword.value = '';
    filepath.value = '';
};

const register = () => {
    const data = {
        keyword: keyword.value,
        filepath: filepath.value,
    };
    registered.push(data);
    clear();
};

const close = () => {
    if(registered.length > 0) {
        const store = useKeywordStore();
        store.addRange(registered);
    }
    emit('close');
};
</script>

<style scoped lang="css">
.btn-area {
    width: 100%;
    display: flex;
    justify-content: right;
}

input {
    width: 100%;
}

button {
    margin-top: 3px;
    width: 45px;
    height: 40px;
    border-style: solid 1px black;
    margin-left: 3px;
    background-color: white;
}
</style>