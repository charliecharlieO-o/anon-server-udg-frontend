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

export default {
  data () {
    return {
      show: false
    }
  },
  computed: {
    message () {
      const message = this.$store.state.snackbar.currentMessage
      console.log('message', message) // Delete this comment whe you end
      return message
    }
  },
  watch: {
    // Watch message computed attribute
    async message (message) {
      console.log('Snackbar components/ message watcher triggered', message)
      if (!message) {
        return
      }

      const self = this
      this.show = true
      await timeout(3000)
      self.hide()
      console.log('Snackbar component/ hide message called')
    }
  },
  methods: {
    hide () {
      this.show = false
      this.$store.commit('snackbar/next')
    }
  }
}
</script>

<style type="text/css">
</style>