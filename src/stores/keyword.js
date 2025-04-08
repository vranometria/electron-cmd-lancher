import { defineStore } from 'pinia'

export const useKeywordStore = defineStore('keyword', {
  state: () => ({keywords: {}}),
  getters: {
    count: (state) => {
      return Object.keys(state.keywords).length;
    },
  },
  actions: {
    add(shortcut){
        this.keywords[shortcut.keyword] = shortcut;
    },
    addRange(shortcuts){
        shortcuts.forEach(shortcut => {
            this.keywords[shortcut.keyword] = shortcut;
        });
    },
    get(keyword){
        return this.keywords[keyword];
    }
  },
})