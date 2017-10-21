<template>
  <div id="profileView">
    <!-- Data -->
    <v-layout row wrap>
      <v-flex xs1></v-flex>
      <v-flex xs10>
        <!-- Profile Picture -->
        <div style="text-align:center;margin-top:35px;">
          <v-flex xs1 offset-xs6 style="text-align:center;">
            <v-btn  absolute dark fab small class="grey"><v-icon>edit</v-icon></v-btn>
          </v-flex>
          <v-list-tile-avatar>
            <img src="/static/thumbnail.jpg" style="height:125px;width:125px;" />
          </v-list-tile-avatar>
          <h4 style="margin-top:5px;margin-bottom:2px;">User Name</h4>
          <p class="grey6-text">
            La descripcion super duper chida de la
            personita de la cual visitas el perfil,
            maximo de N caracteres.
          </p>
        </div>
        <br />
        <!-- Social Networking -->
        <v-card>
          <v-card-title class="grey">
            <span class="headline white--text" style="font-size:25%;">Redes Sociales</span>
            <v-spacer></v-spacer>
            <v-btn icon class="white--text"><v-icon>edit</v-icon></v-btn>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-tile>
                Something
              </v-list-tile>
              <v-divider></v-divider>
              <v-list-tile>
                Something
              </v-list-tile>
            </v-list>
          </v-card-text>
        </v-card>
        <br />
        <!-- Account Settings -->
        <v-card>
          <v-card-title class="orange">
            <span class="headline white--text" style="font-size:25%;">Info de Cuenta</span>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-tile>
                Something
              </v-list-tile>
              <v-divider></v-divider>
              <v-list-tile>
                Something
              </v-list-tile>
            </v-list>
          </v-card-text>
        </v-card>
        <br />
        <!-- Account Settings -->
        <v-card>
          <v-card-title class="red">
            <span class="headline white--text" style="font-size:25%;">Settings</span>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-tile>
                Something
              </v-list-tile>
              <v-divider></v-divider>
              <v-list-tile>
                Something
              </v-list-tile>
            </v-list>
          </v-card-text>
        </v-card>
        <br /><br />
      </v-flex>
      <v-flex xs1></v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: 'profile',
  data () {
    return {
      profileId: null,
      profileData: null
    }
  },
  created () {
    this.profileId = this.$route.params.profileId
  },
  methods: {
    loadProfileInfo (profileId) {
      if (profileId === 'me') {
        // Request profile info from server
      } else {
        // Request profile info from server
      }
    }
  }
}
</script>
<style></style>
