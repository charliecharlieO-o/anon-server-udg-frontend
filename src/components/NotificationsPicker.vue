<template>
  <div>
    <v-card class="">
      <v-toolbar class="teal white--text">
        <v-toolbar-title>
          Notifications

        </v-toolbar-title>
      </v-toolbar>
      <v-list two-line>
        <v-list-tile>
          <v-list-tile-content>
            <p v-for="n in notifications">{{ n.title }}</p>
            <v-list-tile-title>New Networking Request</v-list-tile-title>
            <v-list-tile-sub-title>vicdiaz  sent you a request</v-list-tile-sub-title>
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
  async created () {
    try {
      await this.$store.dispatch('getNotifications')
    } catch (err) {
      console.error(err)
    }
  }
}
</script>

<style type="css" required>
	
</style>