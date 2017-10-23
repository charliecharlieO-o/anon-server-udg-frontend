<template>
  <div id="contactsMain">
    <!-- Tabs -->
    <v-tabs dark grow centered>
      <!-- Tabs control  -->
      <v-tabs-bar slot="activators" class="cyan">
        <v-tabs-slider class="orange"></v-tabs-slider>
        <v-tabs-item href="#contacts">contactos</v-tabs-item>
        <v-tabs-item href="#requests">peticiones</v-tabs-item>
        <v-tabs-item href="#search">buscar</v-tabs-item>
      </v-tabs-bar>
      <!-- Contacts -->
      <v-tabs-content id="contacts">
        <v-card flat>
          <contact isfriend="true"></contact>
          <v-divider></v-divider>
          <contact isfriend="true"></contact>
          <v-divider></v-divider>
          <contact isfriend="true"></contact>
        </v-card>
      </v-tabs-content>
      <!-- Requests -->
      <v-tabs-content id="requests">
        <v-card flat>
          <contact></contact>
          <v-divider></v-divider>
          <contact></contact>
          <v-divider></v-divider>
          <contact></contact>
        </v-card>
      </v-tabs-content>
      <!-- Search -->
      <v-tabs-content id="search">
        <!-- Search bar -->
        <v-card flat>
          <v-card-text>Search Results</v-card-text>
        </v-card>
      </v-tabs-content>
    </v-tabs>
  </div>
</template>

<script>
import {standardAuthGet} from '../../utils/maskmob-api'
import contactComponent from './Contact'
export default {
  name: 'contacts',
  created () {
    this.loadConnections()
  },
  components: {
    contact: contactComponent
  },
  methods: {
    async loadConnections () {
      const response = await standardAuthGet(this.$session.get('JWTOKEN'), '/user/friends')
      try {
        console.log(response.data.doc)
      } catch (e) {
        console.log(e)
      }
    },
    loadMyRequests (received) {
      const url = (received === true) ? '/user/my-requests' : '/user/sent-requests'
      standardAuthGet(this.$session.get('JWTOKEN'), url).then((response) => {
        console.log(response.data.doc)
      }).catch((err) => {
        alert(err)
      })
    },
    loadSentRequests () {},
    loadDeniedRequests () {},
    searchUserByName () {}
  }
}
</script>

<style></style>
