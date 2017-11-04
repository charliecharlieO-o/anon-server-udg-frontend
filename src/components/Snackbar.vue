<template>
  <v-snackbar
    v-model="show">
    <span v-if="message">
      {{ message.text }}
    </span>
    <v-btn
      flat
      class="blue--text"
      v-if="message && message.router"
      v-on:click="$router.push(message.router)"> Go </v-btn>
    <a
      v-if="message && message.url"
      :href="message.url">
      hello
    </a>
  </v-snackbar>
</template>

<script type="text/javascript">
import timeout from 'timeout-then'

const SHOW_TIME = 3000
const WAIT_TIME = 500

export default {
  data () {
    return {
      show: false
    }
  },
  computed: {
    message () {
      const message = this.$store.state.snackbar.currentMessage
      return message
    }
  },
  watch: {
    // Watch message computed attribute
    async message (message) {
      if (!message) {
        return
      }

      const self = this
      this.show = true
      await timeout(SHOW_TIME)
      self.show = false
      await timeout(WAIT_TIME)
      this.$store.commit('snackbar/next')
    }
  }
}
</script>

<style type="text/css">
</style>