<template>
  <div id="contactsMain">
    <!-- Tabs -->
    <v-tabs dark grow centered>
      <!-- Tabs control  -->
      <v-tabs-bar slot="activators" class="cyan">
        <v-tabs-slider class="orange"></v-tabs-slider>
        <v-tabs-item href="#contacts"><v-icon>group</v-icon></v-tabs-item>
        <v-tabs-item href="#requests">solicitudes</v-tabs-item>
        <v-tabs-item href="#sentreq">en espera</v-tabs-item>
        <v-tabs-item href="#edit">negadas</v-tabs-item>
      </v-tabs-bar>
      <!-- Contacts -->
      <v-tabs-content id="contacts">
        <div v-if="!contacts || contacts.length === 0" style="text-align:center">
          <br /><h2>no tienes contactos</h2>
        </div>
        <div v-if="errorContacts" style="text-align:center">
          <br /><h2>Error</h2>
        </div>
        <v-card v-if="!contacts ||contacts.length !== 0" flat>
          <span v-for="contact in contacts" :key="contact._id">
            <contact :contact="contact" :userId="$session.get('USER')._id" @connectionModified="reloadData"></contact>
            <v-divider></v-divider>
          </span>
        </v-card>
      </v-tabs-content>
      <!-- Requests Received -->
      <v-tabs-content id="requests">
        <div v-if="!requests || requests.length === 0" style="text-align:center">
          <br /><h2>no tienes solicitudes nuevas</h2>
        </div>
        <div v-if="errorRequests" style="text-align:center">
          <br /><h2>Error</h2>
        </div>
        <v-card v-if="!requests || requests.length !== 0" flat>
          <span v-for="request in requests" :key="request._id">
            <contact :contact="request" :userId="$session.get('USER')._id" @connectionModified="reloadData"></contact>
            <v-divider></v-divider>
          </span>
        </v-card>
      </v-tabs-content>
      <!-- Requests Sent -->
      <v-tabs-content id="sentreq">
        <div v-if="!requestsSent || requestsSent.length === 0" style="text-align:center">
          <br /><h2>no haz hecho nuevas solicitudes</h2>
        </div>
        <div v-if="errorRequestsSent" style="text-align:center">
          <br /><h2>Error</h2>
        </div>
        <v-card v-if="!requestsSent || requestsSent.length !== 0" flat>
          <span v-for="request in requestsSent" :key="request._id">
            <contact :contact="request" :userId="$session.get('USER')._id" @connectionModified="reloadData"></contact>
            <v-divider></v-divider>
          </span>
        </v-card>
      </v-tabs-content>
      <!-- Requests Responded -->
      <v-tabs-content id="edit">
        <div v-if="!foes || foes.length === 0" style="text-align:center">
          <br /><h2>no haz negado acceso a nadie</h2>
        </div>
        <div v-if="errorFoes" style="text-align:center">
          <br /><h2>Error</h2>
        </div>
        <v-card v-if="!foes || foes.length !== 0" flat>
          <span v-for="request in foes" :key="request._id">
            <contact :contact="request" :userId="$session.get('USER')._id" @connectionModified="reloadData"></contact>
            <v-divider></v-divider>
          </span>
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
  data () {
    return {
      contacts: null,
      requests: null,
      requestsSent: null,
      foes: null,
      errorContacts: null,
      errorRequests: null,
      errorRequestsSent: null,
      errorFoes: null,
      usernameQuery: ''
    }
  },
  created () {
    this.reloadData()
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
    async loadMyRequests () {
      try {
        const response = await standardAuthGet(this.$session.get('JWTOKEN'), '/user/my-requests')
        this.requests = response.data.doc
      } catch (e) {
        this.errorRequests = e
      }
    },
    async loadSentRequests () {
      try {
        const response = await standardAuthGet(this.$session.get('JWTOKEN'), '/user/sent-requests')
        this.requests = response.data.doc
      } catch (e) {
        this.errorRequestsSent = e
      }
    },
    async loadFoes () {
      try {
        const response = await standardAuthGet(this.$session.get('JWTOKEN'), '/user/foes')
        this.foes = response.data.doc
      } catch (e) {
        this.errorFoes = e
      }
    },
    async reloadData () {
      this.loadConnections()
      this.loadMyRequests()
      this.loadSentRequests()
      this.loadFoes()
    }
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
