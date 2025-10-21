<template>
  <div class="hello">
    <h2>{{ msg }}</h2>
    <p>
      Start building your Duestack application by editing the components in
      <code>src/components/</code>
    </p>
  </div>
</template>

<script setup>
defineProps({
  msg: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.hello {
  padding: 2rem;
  text-align: center;
}

h2 {
  color: var(--royal-blue);
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

p {
  color: #666;
  line-height: 1.8;
}
</style>
