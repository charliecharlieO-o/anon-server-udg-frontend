<template>
  <div id="profileView">
    <!-- Error Div -->
    <div v-if="error" style="text-align:center;margin-top:30px;">
      <h4>{{ error }}</h4>
    </div>
    <!-- Data -->
    <v-layout v-if="!error" row wrap>
      <v-flex xs1></v-flex>
      <v-flex xs10>
        <!-- Profile Picture -->
        <div v-if="userObj" class="profile-box">
          <!-- Profile Picture Update Modal -->
          <updatePicture :show="showUpdatePic" @close="showUpdatePic = false" @updated="refreshUserProfile" :bio="userObj.bio"></updatePicture>
          <!-- Profile Bio Update Modal -->
          <updateBiog :show="showUpdateBio" @close="showUpdateBio = false" @updated="refreshUserProfile" :picture="userObj.profile_pic.thumbnail"></updateBiog>
          <!-- PICTURE -->
          <v-flex v-if="profileId === 'me'" xs1 offset-xs6 style="text-align:center;">
            <v-btn v-on:click="showUpdatePic = true"  absolute dark fab small class="grey"><v-icon>edit</v-icon></v-btn>
          </v-flex>
          <v-list-tile-avatar>
            <img :src="userObj.profile_pic.thumbnail" class="profile-picture" />
          </v-list-tile-avatar>
          <!-- USERNAME -->
          <h4 class="username">{{ userObj.username }}</h4>
          <!-- BIOGRAPHY -->
          <p>
            <span v-if="userObj.bio">
              {{ userObj.bio }}
            </span>
            <span v-else>
              <i>No hay descripcion</i>
            </span>
            <span class="link-style" v-if="profileId === 'me'" v-on:click="showUpdateBio = true">[editar]</span>
          </p>
        </div>
        <!-- Action Buttons -->
        <div v-if="profileId !== 'me'" class="text-xs-center">
          <br />
          <v-btn v-if="requestStatus === 'befriend'" v-on:click="sendRequest" round primary dark>
            agregar contacto
            <v-icon right>person_add</v-icon>
          </v-btn>
          <v-btn v-if="requestStatus === 'candelete' || requestStatus ==='remreq'" v-on:click="removeRelationship" round error dark>
            <span v-if="requestStatus === 'remreq'">eliminar peticion</span><span v-else>eliminar contacto</span>
            <v-icon right>remove_circle_outline</v-icon>
          </v-btn>
          <v-btn v-if="requestStatus === 'remreq'" v-on:click="acceptRelationship" round success dark>
            aceptar peticion
            <v-icon right>check</v-icon>
          </v-btn>
          <v-btn v-if="requestStatus === 'select'" v-on:click="respondRequest('friend')" round success dark>
            aceptar peticion
            <v-icon right>check</v-icon>
          </v-btn>
          <v-btn v-if="requestStatus === 'select'" v-on:click="respondRequest('foe')" round warning dark>
            negar peticion
            <v-icon right>not_interested</v-icon>
          </v-btn>
          <v-chip v-if="requestStatus === 'await'" class="secondary white--text">Peticion enviada...</v-chip>
        </div>
        <br />
        <!-- Social Networking -->
        <v-card>
          <v-card-title class="grey">
            <span class="headline white--text" style="font-size:25%;">Redes Sociales</span>
          </v-card-title>
          <v-list v-if="accessLevel !== 'limited' || profileId === 'me'">
            <updateNetwork :show="showNetworkEdt" :networkName="networkName" :networkLabel="networkLabel"
              @close="showNetworkEdt = false" @updated="refreshUserProfile"></updateNetwork>
            <v-list-tile v-on:click="editNetworkDialog('facebook', 'nombre de usuario')">
              <img src="../assets/icon-zuckd.svg" class="social-icon" />
              <span><b>perfil de facebook:</b> {{ socialNetworkInfo('facebook') }} <span v-if="profileId === 'me'">(click para editar)</span></span>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile v-on:click="editNetworkDialog('instagram', 'nombre de usuario')">
              <img src="../assets/icon-instagram.svg" class="social-icon" />
              <span><b>cuenta de instagram:</b> {{ socialNetworkInfo('instagram') }} <span v-if="profileId === 'me'">(click para editar)</span></span>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile v-on:click="editNetworkDialog('snapchat', 'snapchat handle')">
              <img src="../assets/icon-snapchat.svg" class="social-icon" />
              <span><b>snapchat handle:</b> {{ socialNetworkInfo('snapchat') }} <span v-if="profileId === 'me'">(click para editar)</span></span>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile v-on:click="editNetworkDialog('twitter', '@tu nombre')">
              <img src="../assets/icon-twitter.svg" class="social-icon" />
              <span><b>@ de twitter:</b> {{ socialNetworkInfo('twitter') }} <span v-if="profileId === 'me'">(click para editar)</span></span>
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
                  <v-chip v-if="userObj.banned.is_banned" class="red white--text">Cuenta Banneada</v-chip>
                  <v-chip v-else class="green white--text">Cuenta Activa</v-chip>
                </v-flex>
                <v-flex xs6>
                  <span class="label-desc">Ultimo login:</span>
                  <v-chip class="secondary white--text">{{ userObj.last_log }}</v-chip>
                </v-flex>
              </v-layout>
              <br />
              <!-- Anonimity Status -->
              <v-layout row-sm column child-flex-sm>
                <v-flex xs12>
                  <updateAnonimity :show="setupAnon" @close="setupAnon = false" @updated="refreshUserProfile"></updateAnonimity>
                  <span class="label-desc">Incognito:</span>
                  <span v-if="userObj.alias.handle" id="activeAnon">
                    <b style="color:purple;">{{ userObj.alias.handle }}</b>
                    <v-btn round error v-on:click="removeAnonimity">desactivar</v-btn>
                  </span>
                  <span v-else id="inactiveAnon">
                    <v-btn round primary v-on:click="setupAnon = true">activar</v-btn>
                  </span>
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
                  :label="`cambiar: ${userObj.email}`"
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
import updatePic from './UpdatePicture'
import updateBio from './UpdateBio'
import networkUpdate from './UpdateNetwork'
import anonUpdate from './AnonimitySetup'
import {standardAuthGet, standardAuthPost, standardAuthPut, standardAuthDelete} from '../../utils/maskmob-api'
export default {
  name: 'profile',
  data () {
    return {
      profileId: null,
      profileData: null,
      userObj: null,
      networksCount: 0,
      accessLevel: 'limited', // Can be limited or full for outside viewers
      requestObj: null,
      requestStatus: 'befriend', // Can be 'befriend', 'candelete', 'await', 'select', 'accept' or 'deny'
      anonimityState: false,
      showUpdatePic: false,
      showUpdateBio: false,
      showNetworkEdt: false,
      networkName: '',
      networkLabel: '',
      setupAnon: false,
      error: ''
    }
  },
  components: {
    updatePicture: updatePic,
    updateBiog: updateBio,
    updateNetwork: networkUpdate,
    updateAnonimity: anonUpdate
  },
  created () {
    this.profileId = this.$route.params.profileId
    this.loadProfileInfo()
  },
  beforeRouteUpdate (to, from, next) {
    if (to.params.profileId !== from.params.profileId) {
      this.profileId = to.params.profileId
      this.refreshUserProfile()
      this.loadProfileInfo()
    }
    next()
  },
  methods: {
    async loadProfileInfo () {
      const user = this.$session.get('USER')
      if (this.profileId === 'me' || (user && user._id === this.profileId)) {
        this.profileId = 'me'
        this.userObj = user
      } else {
        // Check contact related status
        try {
          const response = await standardAuthGet(this.$session.get('JWTOKEN'), `/user/is-friend/${this.profileId}`)
          // If there is no Request
          if (response.data && response.data.success === false) {
            this.requestStatus = 'befriend'
          } else {
            // Set to internal Object
            this.requestObj = response.data.doc
            // If I sent it
            if (this.requestObj.requested_by.id === user._id) {
              this.requestStatus = (this.requestObj.has_access) ? 'candelete' : 'await'
            } else {
              // can acept or decline
              this.requestStatus = (!this.requestObj.responded) ? 'select' : (this.requestObj.has_access) ? 'candelete' : 'remreq'
            }
          }
        } catch (e) {
          console.log(e)
        }
        // Request profile info from server
        try {
          const response = await standardAuthGet(this.$session.get('JWTOKEN'), `/user/${this.profileId}/profile`)
          if (response.data.success) {
            this.accessLevel = (response.data.limited) ? 'limited' : 'full'
            this.networksCount = (response.data.limited) ? response.data.networks : 0
            this.userObj = response.data.doc
          } else {
            this.error = 'NO EXISTE EL USUARIO'
          }
        } catch (e) {
          console.log(e)
        }
      }
    },
    async sendRequest () {
      try {
        const response = await standardAuthPost({ 'to_userid': this.profileId }, this.$session.get('JWTOKEN'),
          '/user/request')
        this.requestStatus = (response.data.success) ? 'await' : 'befriend'
      } catch (err) {
        console.log(err)
      }
    },
    async respondRequest (friendOrFoe) {
      try {
        const hasAccess = friendOrFoe === 'friend'
        const response = await standardAuthPut({ 'has_access': hasAccess }, this.$session.get('JWTOKEN'),
          `/user/request/${this.requestObj._id}/respond`)
        if (response.status === 200 && response.data.success) {
          this.loadProfileInfo()
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
          `/user/request/${this.requestObj._id}/remove`)
        if (response.status === 200 && response.data.success) {
          this.loadProfileInfo()
        } else {
          console.log('error')
        }
      } catch (err) {
        console.log(err)
      }
    },
    async acceptRelationship () {
      try {
        const response = await standardAuthPut({ 'has_access': true }, this.$session.get('JWTOKEN'),
          `/user/request/${this.requestObj._id}/edit`)
        if (response.status === 200 && response.data.success) {
          this.loadProfileInfo()
        } else {
          console.log('error')
        }
      } catch (err) {
        console.log(err)
      }
    },
    async refreshUserProfile () {
      try {
        const userId = (this.$session.get('USER'))._id
        const response = await standardAuthGet(this.$session.get('JWTOKEN'), `/user/${userId}/profile`)
        if (response.status === 200 && response.data.success) {
          this.$session.set('USER', response.data.doc)
          this.userObj = response.data.doc
        } else {
          this.error = 'refreshing error'
        }
      } catch (error) {
        this.error = 'refreshing error'
      }
    },
    async removeAnonimity () {
      try {
        const response = await standardAuthPut({}, this.$session.get('JWTOKEN'), '/user/alias')
        if (response.status === 200 && response.data.success) {
          this.userObj.alias = null
          this.refreshUserProfile()
        } else {
          console.log(`error ${response.data}`)
        }
      } catch (err) {
        console.log(err)
      }
    },
    socialNetworkInfo (name) {
      if (!this.userObj || !this.userObj.contact_info) {
        return undefined
      } else {
        const networkIdx = this.userObj.contact_info.findIndex(x => x.network_name === name)
        if (networkIdx < 0) {
          return undefined
        } else {
          return this.userObj.contact_info[networkIdx].network_contact
        }
      }
    },
    editNetworkDialog (networkName, networkLabel) {
      if (this.$session.get('USER')._id !== this.profileId) {
        return // Should copy string to clipboard
      }
      this.showNetworkEdt = true
      this.networkName = networkName
      this.networkLabel = networkLabel
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
.profile-box {
  text-align:center;
  margin-top:35px;
}

.link-style {
  color: #0645AD;
  cursor: pointer;
}
</style>
