import { defineStore } from 'pinia';

interface ConfigState {
  simpleDashboard: boolean;
}

export const useConfigStore = defineStore('config', {
  state: (): ConfigState => ({
    simpleDashboard: true, // Por defecto, el modo normal
  }),
});