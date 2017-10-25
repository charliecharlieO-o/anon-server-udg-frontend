<template>
  <v-card flat id="contactComponent">
    <v-container fluid class="contact-container">
      <v-layout row-sm column child-flex-sm>
        <v-flex xs3>
          <router-link :to="`/profile/${contact.requested_by.id}`" style="text-decoration:none;">
            <v-list-tile-avatar class="avatar-box">
              <img :src="contact.requested_by.thumbnail_pic" class="profile-picture" />
              <h5 class="username">{{ contact.requested_by.username }}</h5>
            </v-list-tile-avatar>
          </router-link>
        </v-flex>
        <v-flex xs9 class="button-box">
          <div v-if="isfriend">
            <v-btn round error dark>eliminar<v-icon right>remove_circle_outline</v-icon></v-btn>
            <v-btn round warning dark>bloquear<v-icon right>not_interested</v-icon></v-btn>
          </div>
          <div v-else>
            <v-btn round success dark v-on:click="respondRequest(contact._id, true)" >aceptar<v-icon right>check</v-icon></v-btn>
            <v-btn round error dark v-on:click="respondRequest(contact._id, false)">negar<v-icon right>not_interested</v-icon></v-btn>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
    <v-snackbar
      timeout="1500"
      :success="success"
      :error="error"
      vertical="true"
      v-model="snackbar"
    ></v-snackbar>
  </v-card>
</template>

<script>
import {getBaseUrl, standardAuthPut} from '../../utils/maskmob-api'
export default {
  props: ['isfriend', 'contact'],
  created () {
    if (this.$props['contact'].requested_by.profile_pic) {
      let str = this.$props['contact'].requested_by.profile_pic
      str = str.substr(str.lastIndexOf('/') + 1)
      // thread.poster.thumbnail = `/media/${str}` on production
      this.$props['contact'].requested_by.profile_pic = `${getBaseUrl()}/media/${str}` // for testing
    }
  },
  data () {
    return {
      success: true,
      error: false
    }
  },
  methods: {
    // Methods will be listed here
    async respondRequest (requestId, accepted) {
      try {
        alert(accepted)
        const response = await standardAuthPut({ 'has_access': accepted }, this.$session.get('JWTOKEN'), `/user/request/${requestId}/respond`)
        if (response && response.data.success) {
          // Show success
          // Delete record from array
        } else {
          // Show error
        }
      } catch (e) {
        // Show error
      }
    },
    async blockUser () {},
    async unblockUser () {},
    async deleteRel () {}
  }
}
</script>

<style scoped>
.avatar-box {
  margin: 0px;
  padding: 0px;
}
.profile-picture {
  margin: 0px;
  padding: 0px;
  min-height: 50px;
  min-width: 50px;
  background-color:grey;
}
.contact-container {
  padding: 10px;
}
.username {
  margin: 10px;
}
.button-box {
  text-align:right;
}
</style>
