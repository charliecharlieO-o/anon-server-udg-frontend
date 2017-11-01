<template>
  <div>
    <v-card>
      <v-toolbar class="teal white--text">
        <v-toolbar-title>
          Notifications {{ notifications.length }}
        </v-toolbar-title>
      </v-toolbar>
      <v-list two-line>
        <v-list-tile v-for="n in notifications" v-on:click="openNotification(n)">
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
export default {
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
  async created () {
    try {
      await this.$store.dispatch('getNotifications')
    } catch (err) {
      console.error(err)
    }
  },
  methods: {
    openNotification (notification) {
      this.$router.push({ name: 'home' })
    }
  }
}
</script>

<style type="css" required>
	
</style>