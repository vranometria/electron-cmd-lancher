<template>
    <section class="container">
        <div>
            <input type="text" readonly v-model="key" @keydown="keyPressed" placeholder="Press a key" />
        </div>
        <div class="modifieres">
            <label>
                <input type="checkbox" v-model="alt" />alt
            </label>
            <label>
                <input type="checkbox" v-model="ctrl" />ctrl
            </label>
            <label>
                <input type="checkbox" v-model="shift" />shift
            </label>
        </div>
        <div class="buttons">
            <button @click="register">Register</button>
            <button @click="close">Close</button>
        </div>
        <div>
            {{ msg }}
        </div>
    </section>
</template>


<script lang="js" setup>
import { ref, watch } from 'vue';
import { useHotkeyStore } from '@/stores/hotkey.js';

const emit = defineEmits(['close']);
const store = useHotkeyStore();
const data = store.get();

const key = ref(data.key);
const alt = ref(data.alt);
const ctrl = ref(data.ctrl);
const shift = ref(data.shift);
const msg = ref("");

watch(data, (newValue, oldValue) => {
    key.value = data.key;
    alt.value = data.alt;
    ctrl.value = data.ctrl;
    shift.value = data.shift;
}, { deep: true });


const keyPressed = (event) => {
    event.preventDefault();
    key.value = event.key;
};

const register = async () => {
    const d = {
        key: key.value,
        alt: alt.value,
        ctrl: ctrl.value,
        shift: shift.value
    };
    const res = await window.electronApi.registerHotkey(d);
    store.put(d);
    msg.value = res ? "Hotkey registered successfully!" : "Failed to register hotkey!";
};

const close = () => {
    emit('close');
};

</script>


<style scoped lang="css">
.modifieres {
    display: flex;
    margin-top: 10px;
    margin-bottom: 10px;
}

.buttons {
    width: 100%;
    display: flex;
    justify-content: right;
}   

button {
    width: 70px;
    height: 40px;
    margin-left: 5px;
    background-color: white;
}
</style>