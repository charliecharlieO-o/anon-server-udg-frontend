<template>
  <v-card flat id="contactComponent">
    <v-container fluid class="contact-container">
      <v-layout row-sm column child-flex-sm>

        <!-- User header -->
        <v-flex v-if="$session.get('USER')._id !== contact.requested_by.id" xs9>
          <router-link :to="`/profile/${contact.requested_by.id}`" style="text-decoration:none;">
            <v-list-tile-avatar class="avatar-box">
              <img :src="contact.requested_by.thumbnail_pic" class="profile-picture" />
              <h5 class="username">{{ contact.requested_by.username }}</h5>
              <span v-if="contact.requested_by.id === userId" class="action-text">you requested access</span>
              <span v-else class="action-text">requested access</span>
              <span class="action-text">{{ parseDate(contact.createdAt) }}</span>
            </v-list-tile-avatar>
          </router-link>
        </v-flex>
        <v-flex v-else xs9>
          <router-link :to="`/profile/${contact.to.id}`" style="text-decoration:none;">
            <v-list-tile-avatar class="avatar-box">
              <img :src="contact.to.thumbnail_pic" class="profile-picture" />
              <h5 class="username">{{ contact.to.username }}</h5>
              <span v-if="contact.has_access && contact.requested_by.id === userId" class="action-text">gave you access</span>
              <span v-else-if="!contact.has_access && contact.requested_by.id === userId" class="action-text">you requested access</span>
              <span class="action-text">{{ parseDate(contact.createdAt) }}</span>
            </v-list-tile-avatar>
          </router-link>
        </v-flex>

        <!-- Action Buttons -->
        <v-flex v-if="contact.has_access" xs4 class="button-box">
          <v-btn round error dark v-on:click="removeRelationship">eliminar<v-icon right>not_interested</v-icon></v-btn>
        </v-flex>
        <v-flex v-else-if="!contact.has_access && contact.responded" xs4 class="button-box">
          <v-btn round success dark v-on:click="redeemRelationship">aceptar<v-icon right>check</v-icon></v-btn>
          <v-btn round error dark v-on:click="removeRelationship">eliminar<v-icon right>not_interested</v-icon></v-btn>
        </v-flex>
        <v-flex v-else-if="!contact.has_access && contact.requested_by.id !== userId" xs4 class="button-box">
          <v-btn round success dark v-on:click="respondRequest('friend')">aceptar<v-icon right>check</v-icon></v-btn>
          <v-btn round error dark v-on:click="respondRequest('foe')">negar<v-icon right>not_interested</v-icon></v-btn>
        </v-flex>
        <v-flex v-else xs4 class="button-box">
          <v-chip class="secondary white--text">Peticion enviada...</v-chip>
        </v-flex>

      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import {standardAuthPut, standardAuthDelete} from '../../utils/maskmob-api'
import * as moment from 'moment'
export default {
  props: ['contact', 'userId', 'inSearch'],
  data () {
    return {
    }
  },
  methods: {
    parseDate (isodate) {
      return moment(isodate).fromNow()
    },
    async respondRequest (friendOrFoe) {
      try {
        const hasAccess = friendOrFoe === 'friend'
        const response = await standardAuthPut({ 'has_access': hasAccess }, this.$session.get('JWTOKEN'),
          `/user/request/${this.contact._id}/respond`)
        if (response.status === 200 && response.data.success) {
          this.$emit('connectionModified')
        } else {
          console.log('error')
        }
      } catch (err) {
        console.log(err)
      }
    },
    async redeemRelationship () {
      try {
        const response = await standardAuthPut({ 'has_access': true }, this.$session.get('JWTOKEN'),
          `/user/request/${this.contact._id}/edit`)
        if (response.status === 200 && response.data.success) {
          this.$emit('connectionModified')
        } else {
          console.log('error')
        }
      } catch (err) {
        console.log(err)
      }
    },
    async removeRelationship () {
      try {
        const response = await standardAuthDelete({}, this.$session.get('JWTOKEN'),
          `/user/request/${this.contact._id}/remove`)
        if (response.status === 200 && response.data.success) {
          this.$emit('connectionModified')
        } else {
          console.log('error')
        }
      } catch (err) {
        console.log(err)
      }
    }
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

.action-text {
  color: black;
  margin-left:3px;
  margin-right:3px;
}
</style>
