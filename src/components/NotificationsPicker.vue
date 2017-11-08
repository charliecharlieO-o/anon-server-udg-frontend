<template>
  <div>
    <v-card>
      <v-toolbar class="teal white--text">
        <v-toolbar-title>
          Notificaciones [{{ unseenNotifications }}]
        </v-toolbar-title>
      </v-toolbar>
      <v-list v-if="notifications.length !== 0" two-line>
        <v-list-tile v-for="n in notifications" :key="n._id" v-bind:class="{ 'unseen-color': !n.seen }">
          <v-list-tile-content v-on:click="openNotification(n)">
            <!-- Friend Request -->
            <div v-if="n.meta.type === 'request'">
              <v-list-tile-title class="auto-breakline">Nueva solicitud de info</v-list-tile-title>
              <v-list-tile-sub-title class="auto-breakline">{{ `${n.description.substr(0, n.description.indexOf(' ') + 1)} te ha enviado una solicitud` }}</v-list-tile-sub-title>
            </div>
            <!-- Thread Reply -->
            <div v-else-if="n.meta.type === 'threadReply'">
              <v-list-tile-title class="auto-breakline">Han comentado tu post</v-list-tile-title>
              <v-list-tile-sub-title class="auto-breakline">{{ `${n.description.substr(0, n.description.indexOf(' ') + 1)} comento en tu post` }}</v-list-tile-sub-title>
            </div>
            <!-- Comment Reply -->
            <div v-else-if="n.meta.type === 'reply' || n.meta.type === 'subreply'">
              <v-list-tile-title class="auto-breakline">Nueva respuesta a tu comentario</v-list-tile-title>
              <v-list-tile-sub-title class="auto-breakline">{{ n.description }}</v-list-tile-sub-title>
            </div>
            <!-- Comment Reply Extra -->
            <div v-else-if="n.meta.type === 'replyunder'">
              <v-list-tile-title class="auto-breakline">Nuevo subcomentario</v-list-tile-title>
              <v-list-tile-sub-title class="auto-breakline">{{ `${n.description.substr(0, n.description.indexOf(' ') + 1)} comento en tu comentario`}}</v-list-tile-sub-title>
            </div>
            <!-- Friend Response -->
            <div v-else-if="n.meta.type === 'friendRes'">
              <v-list-tile-title class="auto-breakline">Tienes un nuevo contacto</v-list-tile-title>
              <v-list-tile-sub-title class="auto-breakline">{{ n.title }}</v-list-tile-sub-title>
            </div>
          </v-list-tile-content>
          <v-list-tile-action>
            <div>
              <v-btn class="hidden-md-and-up" error fab small dark v-on:click="deleteNotification(n._id)">
                <v-icon>delete</v-icon>
              </v-btn>
              <v-btn class="hidden-sm-and-down" small error dark v-on:click="deleteNotification(n._id)"><v-icon>delete</v-icon>eliminar</v-btn>
            </div>
          </v-list-tile-action>
          <v-divider></v-divider>
        </v-list-tile>
      </v-list>
      <v-list v-else>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>No hay notificaciones</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-card>
  </div>
</template>

<script type="text/javascript">
const audioPath = require('../assets/notifsound.mp3')
import {standardAuthPost, standardAuthDelete} from '../../utils/maskmob-api'
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
    },
    unseenNotifications () {
      const unotif = this.$store.state.notifications.filter(x => x.seen === false).length
      return (unotif > 100) ? '99+' : unotif
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
      const idx = this.$store.state.notifications.findIndex(x => x._id === notification._id)
      const sw = notification.meta.type
      if (sw === 'threadReply') {
        this.$router.push({ name: 'thread', params: { id: notification.meta.threadId, commentId: notification.meta.replyId, sb: 'hide' } })
        this.$store.state.notifications[idx].seen = true
        console.log(notification.meta.type)
      } else if (sw === 'request' || sw === 'friendRes') {
        // Redirect to user profile
        this.$router.push({ name: 'profile', params: { profileId: notification.meta.friendId } })
        this.$store.state.notifications[idx].seen = true
        this.hide()
      } else {
        this.$router.push({ name: 'thread',
          params: {
            id: notification.meta.threadId, commentId: notification.meta.replyId, sb: 'show'
          }
        })
        this.$store.state.notifications[idx].seen = true
        console.log(notification.meta.type)
      }
      // mark as seen
    },
    async deleteNotification (notificationId) {
      try {
        const idx = this.$store.state.notifications.findIndex(x => x._id === notificationId)
        if (idx > -1) {
          // Delete object from array
          this.$store.state.notifications.splice(idx, 1)
          // Delete notification from server
          await standardAuthDelete({}, this.$session.get('JWTOKEN'), `/user/notification/${notificationId}/remove`)
        }
      } catch (err) {
        console.log(err)
        this.$store.commit('snackbar/push', {
          text: 'error al eliminar'
        })
      }
    },
    async checkForNotifications () {
      try {
        const response = await standardAuthPost({ 'date': this.lastDate }, this.$session.get('JWTOKEN'), '/user/notifications/since')
        if (response.status === 200 && response.data.doc && response.data.doc.length > 0) {
          // If last updated notification is less than
          const newDate = (new Date(response.data.doc[0].date_alerted)).getTime()
          if (this.lastDate < newDate) {
            // Add new notifications
            this.lastDate = newDate
            for (let x in response.data.doc) {
              this.$store.state.notifications.unshift(response.data.doc[x])
            }
            // Notify user
            let audio = await new Audio(audioPath)
            audio.play()
            this.$store.commit('snackbar/push', {
              text: `${response.data.doc.length} nuevas notificaciones`
            })
          }
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

<style scoped type="css" required>
.auto-breakline {
  white-space: pre-wrap;
  word-wrap: break-word;
}
.unseen-color {
  background-color:#e6f2ff;
}
</style>
