import { defineStore } from 'pinia';

interface ConfigState {
  simpleDashboard: boolean;
}

export const useConfigStore = defineStore('config', {
  state: (): ConfigState => ({
    simpleDashboard: false, // Por defecto, el modo normal
  }),
});