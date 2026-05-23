<template>
  <div id="greetings">
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      message: "Hello, World! This is Kinoti",
    };
  },
};
</script>

<style scoped>
#greetings {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 1.5rem;
}
</style>
