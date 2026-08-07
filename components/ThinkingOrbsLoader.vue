<template>
  <div
    :class="[
      'thinking-orb-loader',
      `thinking-orb-loader--${size}`,
      overlay ? 'thinking-orb-loader--overlay' : 'thinking-orb-loader--inline',
      compact ? 'thinking-orb-loader--compact' : ''
    ]"
    role="status"
    :aria-label="label"
  >
    <div class="thinking-orb-shell">
      <span class="thinking-orb thinking-orb--a"></span>
      <span class="thinking-orb thinking-orb--b"></span>
      <span class="thinking-orb thinking-orb--c"></span>
      <span class="thinking-orb-ring"></span>
    </div>

    <div v-if="label || $slots.default" class="thinking-orb-copy">
      <span v-if="label" class="thinking-orb-label">{{ label }}</span>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  label?: string
  size?: 'sm' | 'md' | 'lg'
  overlay?: boolean
  compact?: boolean
}>(), {
  label: 'Cargando...',
  size: 'md',
  overlay: false,
  compact: false,
})
</script>

<style scoped>
.thinking-orb-loader {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #4b5563;
}

.thinking-orb-loader--overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  background: rgba(249, 250, 251, 0.92);
  backdrop-filter: blur(7px);
}

.thinking-orb-loader--inline {
  min-height: 8rem;
}

.thinking-orb-loader--compact {
  gap: 0.4rem;
}

.thinking-orb-loader--compact.thinking-orb-loader--inline {
  min-height: 0;
}

.thinking-orb-loader--compact .thinking-orb-shell {
  transform: scale(0.75);
}

.thinking-orb-shell {
  position: relative;
  width: 5.25rem;
  height: 5.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thinking-orb {
  position: absolute;
  display: block;
  border-radius: 9999px;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.2) 45%, rgba(45, 106, 79, 0.95) 100%);
  box-shadow: 0 0 1.2rem rgba(45, 106, 79, 0.35);
  animation: thinking-orbit 1.8s ease-in-out infinite;
}

.thinking-orb--a {
  width: 1.15rem;
  height: 1.15rem;
  top: 0.55rem;
  left: 0.95rem;
  animation-delay: 0s;
}

.thinking-orb--b {
  width: 0.95rem;
  height: 0.95rem;
  bottom: 0.7rem;
  left: 1.1rem;
  animation-delay: 0.25s;
}

.thinking-orb--c {
  width: 1rem;
  height: 1rem;
  top: 1rem;
  right: 0.9rem;
  animation-delay: 0.5s;
}

.thinking-orb-ring {
  width: 3.1rem;
  height: 3.1rem;
  border-radius: 9999px;
  border: 2px solid rgba(45, 106, 79, 0.18);
  border-top-color: rgba(45, 106, 79, 0.95);
  border-right-color: rgba(255, 182, 39, 0.85);
  animation: thinking-spin 1.15s linear infinite;
}

.thinking-orb-copy {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
}

.thinking-orb-label {
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #4b5563;
}

.thinking-orb-loader--sm .thinking-orb-shell {
  width: 3.25rem;
  height: 3.25rem;
}

.thinking-orb-loader--sm .thinking-orb-ring {
  width: 1.75rem;
  height: 1.75rem;
}

.thinking-orb-loader--lg .thinking-orb-shell {
  width: 6.75rem;
  height: 6.75rem;
}

.thinking-orb-loader--lg .thinking-orb-ring {
  width: 4.25rem;
  height: 4.25rem;
}

@keyframes thinking-orbit {
  0%,
  100% {
    transform: translate(0, 0) scale(0.75);
    opacity: 0.3;
  }
  25% {
    transform: translate(0.65rem, -0.7rem) scale(1);
    opacity: 0.95;
  }
  50% {
    transform: translate(0.9rem, 0.15rem) scale(0.85);
    opacity: 0.75;
  }
  75% {
    transform: translate(-0.25rem, 0.45rem) scale(1);
    opacity: 0.9;
  }
}

@keyframes thinking-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
