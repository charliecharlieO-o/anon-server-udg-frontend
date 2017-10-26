<template>
  <div id="app">
    <v-app toolbar>
        <v-navigation-drawer v-if="loggedIn" persistent light :mini-variant.sync="mini" v-model="drawer" overflow>
          <v-toolbar flat class="transparent">
            <v-list class="pa-0">
              <router-link to="/profile/me" style="textDecoration:none;">
                <v-list-tile avatar tag="div">
                  <v-list-tile-avatar>
                    <img :src="(this.$session.get('USER')).profile_pic.thumbnail" class="profile-picture" />
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ (this.$session.get('USER')).username }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </router-link>
            </v-list>
          </v-toolbar>
          <v-list class="pt-0" dense>
            <v-divider></v-divider>
            <!-- Dashboard tile -->
            <router-link to="/" style="textDecoration:none;">
              <v-list-tile>
                <v-list-tile-action>
                  <v-icon>explore</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>Explora</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </router-link>
            <!-- END Dashboard tile -->
            <!-- Boards tile -->
            <router-link to="/boards" style="textDecoration:none;">
              <v-list-tile>
                <v-list-tile-action>
                  <v-icon>question_answer</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>Boards</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </router-link>
            <!-- END Boards tile -->
            <!-- Networking tile -->
            <router-link to="/networking" style="textDecoration:none;">
              <v-list-tile>
                <v-list-tile-action>
                  <v-icon>group</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>Networking</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-content>
                  <v-chip label outline class="grey grey--text">0</v-chip>
                </v-list-tile-content>
              </v-list-tile>
            </router-link>
            <!-- END Networking tile -->
            <!-- Notifications tile -->
            <v-list-tile v-on:click="showNotifications = !showNotifications">
              <v-list-tile-action>
                <v-icon>notifications</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Notificaciones</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-content>
                <v-chip label outline class="grey grey--text">0</v-chip>
              </v-list-tile-content>
              <v-dialog v-model="showNotifications">
                <notifications-picker />
              </v-dialog>
            </v-list-tile>
            <!-- END notificatilns tile -->
            <v-divider></v-divider>
            <!-- FAQ tile -->
            <router-link to="/faq" style="textDecoration:none;">
              <v-list-tile>
                <v-list-tile-action>
                  <v-icon>help</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>FAQ</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </router-link>
            <!-- END FAQ tile -->
            <!-- FAQ tile -->
            <router-link to="/rules" style="textDecoration:none;">
              <v-list-tile>
                <v-list-tile-action>
                  <v-icon>gavel</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>Reglas</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </router-link>
            <!-- END FAQ tile -->
            <!-- Credits tile -->
            <router-link to="/credits" style="textDecoration:none;">
              <v-list-tile>
                <v-list-tile-action>
                  <v-icon>local_bar</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>Kudos</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </router-link>
            <!-- END Credits tile -->
            <v-divider></v-divider>
            <!-- Logout tile -->
            <v-list-tile v-on:click="logOut" >
              <v-list-tile-action>
                <v-icon class="red--text red--darken-2">exit_to_app</v-icon>
              </v-list-tile-action>
              <v-list-tile-content class="red--text">
                <v-list-tile-title>SALIR</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <!-- END Logout tile -->
          </v-list>
        </v-navigation-drawer>
        <v-toolbar v-if="loggedIn" fixed class="cyan darken-1" dark>
          <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
          <v-toolbar-title>NetSlap</v-toolbar-title>
        </v-toolbar>
        <main>
          <v-container fluid style="padding:0px;">
            <router-view></router-view>
          </v-container>
        </main>
      </v-app>
  </div>
</template>

<script>
import {getDevUrl} from '../utils/maskmob-api'
import NotificationsPicker from '@/components/NotificationsPicker'

export default {
  name: 'app',
  created () {
    // Register log in handler
    this.$eventHub.$on('logged-in', this.isLoggedIn)
    // If user isn't logged in, take to login
    if (!this.isLoggedIn()) {
      // window.location.href = `${getBaseUrl()}/login`
      window.location.href = `${getDevUrl()}/#/login`
    }
  },
  beforeDestroy () {
    this.$eventHub.$off('logged-in') // Unregister log in handler
  },
  data () {
    return {
      drawer: true,
      mini: false,
      right: null,
      loggedIn: false,
      profile: null,
      showNotifications: false
    }
  },
  methods: {
    isLoggedIn () {
      this.$data.loggedIn = this.$session.exists()
      return this.$data.loggedIn
    },
    logOut () {
      // Destroy session if it already exists
      if (this.$session.exists()) {
        this.$session.destroy()
      }
      // window.location.href = `${getBaseUrl()}/`
      window.location.href = `${getDevUrl()}/#/login`
      location.reload()
    }
  },
  components: {
    NotificationsPicker
  }
}
</script>

<style scoped>
@import '/static/materialicons.css';
@import '/static/vuetify.min.css';
.profile-picture {
  background-color:grey;
}
</style>
