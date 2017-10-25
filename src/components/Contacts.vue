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
        <!-- Blocked Unblocked Switch -->
        <v-container class="no-bottom no-sides">
          <v-layout row>
            <v-flex xs2 offset-xs10>
              <v-switch class="switch-wrapper no-top no-bottom" label="Bloqueados"></v-switch>
            </v-flex>
          </v-layout>
        </v-container>
        <div v-if="!contacts || contacts.length === 0" style="text-align:center">
          <h2>no tienes contactos</h2>
        </div>
        <div v-if="errorContacts">
          <h2>Error</h2>
        </div>
        <v-card v-if="!contacts ||contacts.length !== 0" flat>
          <span v-for="contact in contacts" :key="contact._id">
            <contact :isfriend="true" :contact="contact"></contact>
            <v-divider></v-divider>
          </span>
        </v-card>
      </v-tabs-content>
      <!-- Requests -->
      <v-tabs-content id="requests">
        <div v-if="!requests || requests.length === 0" style="text-align:center">
          <br /><h2>no tienes peticiones Nuevas</h2>
        </div>
        <div v-if="errorRequests">
          <br /><h2>Error</h2>
        </div>
        <v-card v-if="!requests || requests.length !== 0" flat>
          <span v-for="request in requests" :key="request._id">
            <contact :isfriend="false" :contact="request"></contact>
            <v-divider></v-divider>
          </span>
        </v-card>
      </v-tabs-content>
      <!-- Search -->
      <v-tabs-content id="search">
        <!-- Search Bar -->
        <v-layout row>
          <v-flex xs12 style="padding-left:20%;padding-right:20%;margin-bottom:10px;margin-top:5px;">
            <v-toolbar class="white" dense>
              <v-text-field v-model="usernameQuery" placeholder="nombre de usuario" @keyup.enter="searchUser"
              hide-details single-line></v-text-field>
              <v-btn v-on:click="searchUserByName" icon>
                <v-icon>search</v-icon>
              </v-btn>
            </v-toolbar>
          </v-flex>
        </v-layout>
      </v-tabs-content>
    </v-tabs>
  </div>
</template>

<script>
import {standardAuthGet} from '../../utils/maskmob-api'
import contactComponent from './Contact'
export default {
  name: 'contacts',
  data () {
    return {
      contacts: null,
      requests: null,
      errorContacts: null,
      errorRequests: null,
      usernameQuery: ''
    }
  },
  created () {
    this.loadConnections()
    this.loadMyRequests(true)
  },
  components: {
    contact: contactComponent
  },
  methods: {
    async loadConnections () {
      try {
        const response = await standardAuthGet(this.$session.get('JWTOKEN'), '/user/friends')
        this.contacts = response.data.doc
      } catch (e) {
        this.errorContacts = e
      }
    },
    async loadMyRequests (received) {
      const url = (received === true) ? '/user/my-requests' : '/user/sent-requests'
      try {
        const response = await standardAuthGet(this.$session.get('JWTOKEN'), url)
        this.requests = response.data.doc
      } catch (e) {
        this.errorRequests = e
      }
    },
    loadBlockedContacts () {},
    loadSentRequests () {},
    loadDeniedRequests () {},
    searchUserByName () {}
  }
}
</script>

<style>
.no-top {
  margin-top:0px;
  padding-top:0px;
}
.no-bottom {
  margin-bottom: 0px;
  padding-bottom: 0px;
}
.no-sides {
  margin-right: 0px;
  margin-left: 0px;
  padding-right: 0px;
  padding-left: 0px;
}
</style>
