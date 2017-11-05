<template>
  <div name="paragraph">
    <span v-if="text.length <= 320">
      <p class="text-xs-left default-p">{{ text }}</p>
    </span>
    <span v-else>
      <p v-if="!showFull" class="text-xs-left">
        {{`${text.slice(0, 285)}...`}}<span class="link-sim" v-on:click="showFull = !showFull">mostrar mas</span>
      </p>
      <p v-else class="text-xs-left">
        {{text}}<span class="link-sim" v-on:click="showFull = !showFull">ocultar</span>
      </p>
    </span>
  </div>
</template>

<script>
export default {
  props: ['text'],
  data () {
    return {
      showFull: false
    }
  }
}
</script>

<style scoped>
.default-p {
  line-height: 110%;
  font-size:115%;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.link-sim {
  color: #0645AD;
  margin:2%;
  cursor: pointer;
}
</style>
