<template>
  <div id="profileView">
    <!-- Data -->
    <v-layout row wrap>
      <v-flex xs1></v-flex>
      <v-flex xs10>
        <!-- Profile Picture -->
        <div style="text-align:center;margin-top:35px;">
          <v-flex v-if="profileId === 'me'" xs1 offset-xs6 style="text-align:center;">
            <v-btn  absolute dark fab small class="grey"><v-icon>edit</v-icon></v-btn>
          </v-flex>
          <v-list-tile-avatar>
            <img :src="userObj.profile_pic.thumbnail" class="profile-picture" />
          </v-list-tile-avatar>
          <h4 class="username">{{ userObj.username }}</h4>
          <p v-if="userObj.bio" class="grey6-text">
            {{ userObj.bio }}
          </p>
          <p v-else class="grey6-text">
            <i>No hay descripcion</i>
          </p>
        </div>
        <div v-if="profileId !== 'me'" class="text-xs-center">
          <br />
          <v-btn v-if="accessLevel === 'limited'" round primary dark>agregar contacto<v-icon right>person_add</v-icon></v-btn>
          <v-btn v-else round error dark>eliminar contacto<v-icon right>remove_circle_outline</v-icon></v-btn>
        </div>
        <br />
        <!-- Social Networking -->
        <v-card>
          <v-card-title class="grey">
            <span class="headline white--text" style="font-size:25%;">Redes Sociales</span>
            <v-chip v-if="accessLevel === 'limited'" outline class="white white--text">{{ networksCount }}</v-chip>
          </v-card-title>
          <v-list v-if="accessLevel !== 'limited' || profileId === 'me'">
            <v-list-tile>
              <img src="../assets/icon-zuckd.svg" class="social-icon" />Facebook Handle
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile>
              <img src="../assets/icon-instagram.svg" class="social-icon" />Instagram Handle
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile>
              <img src="../assets/icon-snapchat.svg" class="social-icon" />Snapchat Handle
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile>
              <img src="../assets/icon-twitter.svg" class="social-icon" />Twitter Handle
            </v-list-tile>
          </v-list>
        </v-card>
        <br />
        <!-- Account Settings -->
        <v-card v-if="profileId === 'me'">
          <v-card-title class="orange">
            <span class="headline white--text" style="font-size:25%;">Cuenta</span>
          </v-card-title>
          <v-card-text>
            <v-container fluid>
              <!-- Account Status -->
              <v-layout row-sm column child-flex-sm>
                <v-flex xs6>
                  <span class="label-desc">Estatus:</span>
                  <v-chip class="red white--text">Banneado</v-chip>
                  <v-chip class="green white--text">Activo</v-chip>
                </v-flex>
                <v-flex xs6>
                  <span class="label-desc">Ultimo login:</span>
                  <v-chip class="secondary white--text">2017-10-22T03:45:04.226Z</v-chip>
                </v-flex>
              </v-layout>
              <br />
              <!-- Anonimity Status -->
              <v-layout row-sm column child-flex-sm>
                <v-flex xs12>
                  <span class="label-desc">Anonimidad:</span>
                  <v-switch class="switch-wrapper" label="Estado: Activo" ></v-switch>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
        <br />
        <!-- Account Settings -->
        <v-card v-if="profileId === 'me'">
          <v-card-title class="red">
            <span class="headline white--text" style="font-size:25%;">Seguridad</span>
          </v-card-title>
          <v-card-text>
            <v-container fluid>
              <!-- EMAIL -->
              <v-layout row-sm column child-flex-sm>
                <v-flex xs10-12>
                  <v-text-field
                  name="input-1"
                  label="email@email.com"
                  id="testing"
                  ></v-text-field>
                </v-flex>
                <v-flex xs2>
                  <v-btn right round primary dark class="button-wrapper">actualizar</v-btn>
                </v-flex>
              </v-layout>
              <!-- PASSWORD -->
              <v-layout row-sm column child-flex-sm>
                <v-flex xs10-12>
                  <v-text-field
                  name="input-1"
                  label="************"
                  id="testing"
                  ></v-text-field>
                </v-flex>
                <v-flex xs2>
                  <v-btn right round primary dark class="button-wrapper">actualizar</v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
        <br /><br />
      </v-flex>
      <v-flex xs1></v-flex>
    </v-layout>
  </div>
</template>

<script>
import {standardAuthGet} from '../../utils/maskmob-api'
export default {
  name: 'profile',
  data () {
    return {
      profileId: null,
      profileData: null,
      userObj: null,
      networksCount: 0,
      accessLevel: 'limited', // Can be limited or full for outside viewers
      anonimityState: false
    }
  },
  created () {
    this.profileId = this.$route.params.profileId
    this.loadProfileInfo()
  },
  beforeRouteUpdate (to, from, next) {
    if (to.params.profileId !== from.params.profileId) {
      this.profileId = to.params.profileId
      this.loadProfileInfo()
    }
    next()
  },
  methods: {
    async loadProfileInfo () {
      if (this.profileId === 'me') {
        this.accessLevel = 'full'
        // Get profile info from object in session if not load from server
        if (this.$session.get('USER')) {
          this.userObj = this.$session.get('USER')
        } else {
          // Load user from server
        }
      } else {
        // Request profile info from server
        try {
          const response = await standardAuthGet(this.$session.get('JWTOKEN'), `/user/${this.profileId}/profile`)
          if (response.data.success) {
            this.accessLevel = (response.data.limited) ? 'limited' : 'full'
            this.networksCount = (response.data.limited) ? response.data.networks : 0
            this.userObj = response.data.doc
          } else {
            console.log('error')
          }
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
}
</script>

<style scoped>
.profile-picture {
  height:125px;
  width:125px;
  background-color:grey;
}
.username {
  margin-top:5px;
  margin-bottom:2px;
}
.label-desc {
  font-weight: bold;
  margin-right:2px;
}
.social-icon {
  min-height:30px;
  min-width:30px;
  margin:2px;
  margin-right:5px;
}
.switch-wrapper {
  margin-top:0px;
  padding-top:0px;
}
.button-wrapper {
  margin-top:15px;
}
</style>
