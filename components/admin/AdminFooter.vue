<template>
  <div class="footer">
    <a href="#home" class="footer-item">
      <span class="icon">🏠</span>
      <span class="label">Home</span>
    </a>
    <a href="#orders" class="footer-item">
      <span class="icon">📦</span>
      <span class="label">Orders</span>
    </a>
    <a href="#products" class="footer-item">
      <span class="icon">🌱</span>
      <span class="label">Products</span>
    </a>
    <a href="#settings" class="footer-item">
      <span class="icon">⚙️</span>
      <span class="label">Settings</span>
    </a>
  </div>
</template>

<script setup>
</script>

<style scoped>
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #0f1f1f;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  border-top: 1px solid #2a3a3a;
  z-index: 10;
}

.footer-item {
  text-decoration: none;
  color: #fff;
  text-align: center;
  width: 25%;
  font-size: 12px;
}

.icon {
  display: block;
  font-size: 24px;
}

.label {
  display: block;
  font-size: 10px;
}

.footer-item:hover {
  color: #a3c9a3;
}
</style>