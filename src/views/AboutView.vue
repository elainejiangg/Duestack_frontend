<template>
  <div class="about">
    <div class="mascot-container">
      <img
        src="/src/assets/mascot.png"
        alt="Pickles the Mascot"
        class="about-mascot"
      />
    </div>
    <h1 class="cinzel-title">About DueStack</h1>
    <p class="subtitle">Where deadlines go to get their act together</p>

    <div class="quirky-content">
      <div class="fun-fact">
        <h2 class="cinzel-title">🐦 Meet Pickles</h2>
        <p>
          This little bird has seen it all. The all-nighters, the coffee-fueled
          panic, the "just one more episode" moments. He's got zero thoughts
          (literally, see the "0" on his head?) but somehow manages to keep
          everything organized. If Pickles can do it, so can you!
        </p>
      </div>

      <div class="fun-fact">
        <h2 class="cinzel-title">🤔 Why DueStack?</h2>
        <p>
          Because "I'll remember it" is not a valid deadline management
          strategy. We've all been there - that moment when you realize your
          assignment was due yesterday and you're still in your pajamas.
          DueStack is here to save you from yourself.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Component logic here
</script>

<style scoped>
.about {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  text-align: right;
}

.mascot-container {
  margin-bottom: 1rem;
  display: flex;
  justify-content: flex-end;
}

.about-mascot {
  width: 200px;
  height: 167px;
  transition: transform 0.3s ease;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.about-mascot:hover {
  transform: scale(1.1) rotate(5deg);
}

h1 {
  color: var(--royal-blue);
  font-size: 2.5rem;
  margin-bottom: 0.25rem;
  font-weight: 700;
}

.mascot-title {
  font-size: 3.5rem;
  margin-bottom: 0.5rem;
}

h2 {
  color: var(--royal-blue);
  font-size: 2rem;
  margin-bottom: 0.25rem;
  font-weight: 700;
}

.subtitle {
  font-size: 1.2rem;
  color: var(--royal-blue);
  opacity: 0.7;
  margin-bottom: 3rem;
  font-style: italic;
}

.quirky-content {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.fun-fact {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-left: 4px solid var(--yellow);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.fun-fact:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.fun-fact h2 {
  color: var(--royal-blue);
  font-size: 1.4rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.fun-fact p {
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 0.5rem;
}

.fun-fact ul {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.fun-fact li {
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 0.5rem;
}

.fun-fact li:last-child {
  margin-bottom: 0;
}
</style>
