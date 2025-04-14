import { defineStore } from 'pinia'

export const useHotkeyStore = defineStore('hotkey', {
  state: () => ({hotkey: {key: "", alt: false, ctrl: false, shift: false}}),
  actions: {
    put(data){
        this.hotkey = data;
    },
    get(){
        return this.hotkey;
    }
  },
})