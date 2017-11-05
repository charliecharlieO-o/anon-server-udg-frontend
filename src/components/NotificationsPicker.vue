<template>
  <div>
    <v-card>
      <v-toolbar class="teal white--text">
        <v-toolbar-title>
          Notifications [{{ notifications.length }}]
        </v-toolbar-title>
      </v-toolbar>
      <v-list two-line>
        <v-list-tile v-for="n in notifications" :key="n._id" v-on:click="openNotification(n)">
          <v-list-tile-content>
            <v-list-tile-title>{{ n.title }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ n.description }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-card>
  </div>
</template>

<script type="text/javascript">
import {standardAuthPost} from '../../utils/maskmob-api'
export default {
  props: ['hide'],
  data () {
    return {
      timerInterval: null,
      lastDate: 0
    }
  },
  computed: {
    notifications () {
      return this.$store.state.notifications
    }
  },
  watch: {
    notifications (val) {
      console.log('notifications changed: ', val)
    }
  },
  beforeDestroy () {
    clearInterval(this.timerInterval)
  },
  async created () {
    try {
      await this.$store.dispatch('getNotifications')
      this.lastDate = (new Date()).getTime()
      this.listenToNotifications()
    } catch (err) {
      console.error(err)
    }
  },
  methods: {
    openNotification (notification) {
      this.hide()
      this.$router.push({ name: 'home' })
    },
    async checkForNotifications () {
      try {
        const response = await standardAuthPost({ 'date': this.lastDate }, this.$session.get('JWTOKEN'), '/user/notifications/since')
        if (response.status === 200 && response.data.doc && response.data.doc.length > 0) {
          // Add new notifications
          this.lastDate = (new Date(response.data.doc[response.data.doc.length - 1].date_alerted)).getTime()
          this.$store.state.notifications.push.apply(this.$store.state.notifications, response.data.doc)
          // Notify user
          const audio = new Audio('../assets/notifsound.mp3')
          audio.play()
          this.$store.commit('snackbar/push', {
            text: `${response.data.doc.length} nuevas notificaciones`
          })
        }
      } catch (err) {
        console.log(err)
        this.$store.commit('snackbar/push', {
          text: 'Revisa tu conexion a internet'
        })
      }
    },
    listenToNotifications () {
      this.timerInterval = setInterval(() => {
        this.checkForNotifications()
      }, 45000)
    }
  }
}
</script>

<style type="css" required>

</style>
