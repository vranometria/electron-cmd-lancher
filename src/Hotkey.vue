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
import { ref } from 'vue';
const emit = defineEmits(['close']);

const key = ref('');
const alt = ref(false);
const ctrl = ref(false);
const shift = ref(false);
const msg = ref("");

const keyPressed = (event) => {
    event.preventDefault();
    key.value = event.key;
};

const register = async () => {
    const data = {
        key: key.value,
        alt: alt.value,
        ctrl: ctrl.value,
        shift: shift.value
    };
    const res = await window.electronApi.registerHotkey(data);
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