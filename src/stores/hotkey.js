import { defineStore } from 'pinia'

export const useHotkeyStore = defineStore('hotkey', {
  state: () => ({
    hotkey: {key: "", alt: false, ctrl: false, shift: false},
    registeredFlag: false,
  }),
  getters: {
    isRegistered(state) {
      return state.registeredFlag;
    }
  },
  actions: {
    put(data){
        this.hotkey = data;
        this.registeredFlag = true;
    },
    get(){
        return this.hotkey;
    }
  },
})