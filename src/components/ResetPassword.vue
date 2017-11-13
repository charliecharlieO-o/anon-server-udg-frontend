<template>
  <v-container fluid>

    <v-layout row>
      <v-flex xs12 text-xs-center>
        <h3> Proceso de Recuperación </h3>
        <p>
          Escribe el <b>email</b> con el cual te registraste y te enviaremos un mensaje<br />
          con el codigo que deberas introducir para recuperar tu contraseña.
        </p>
      </v-flex>
    </v-layout>

    <div v-if="loadingMsg" class="default-loading">
      <v-progress-circular indeterminate v-bind:size="100" class="cyan--text"></v-progress-circular>
      <h4>{{ loadingMsg }}</h4>
    </div>

    <v-layout row wrap justify-center>
      <v-flex class="submit-container" xs12 xl4 lg4 md4>
        <v-card>
          <v-card-text>
            <v-btn v-if="!status" class="default-button" primary v-on:click="status = 'requestingToken'">generar token</v-btn>
            <v-btn v-if="!status" class="default-button" success v-on:click="status = 'checkingToken'">ya tengo un token</v-btn>
            <v-text-field
              v-if="status === 'requestingToken'"
              v-model="email"
              label="email"
              required
              :rules="[checkEmail]"
            ></v-text-field>
            <v-text-field
              v-if="status === 'checkingToken'"
              v-model="token"
              label="TOKEN"
              required
            ></v-text-field>
            <v-text-field
              v-if="status === 'checkingToken'"
              v-model="pwd"
              label="Password"
              type="password"
              required
              :rules="[ruleSamePassword]"/>
            <v-text-field
              v-if="status === 'checkingToken'"
              v-model="pwd1"
              label="Password"
              type="password"
              required
              :rules="[ruleSamePassword]"/>
            <v-btn v-if="status === 'requestingToken'" primary v-on:click="requestToken">enviar</v-btn>
            <v-btn v-if="status === 'checkingToken'" primary v-on:click="changePwd">confirmar</v-btn>
            <v-btn v-if="awaiting && count < 5" primary v-on:click="requestToken">reenviar</v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import {standardUnauthPost} from '../../utils/maskmob-api'
export default {
  data () {
    return {
      loadingMsg: '',
      email: '',
      status: '', // requestingToken, checkingToken
      pwd: '',
      pwd1: '',
      token: '',
      awaiting: false,
      count: 0
    }
  },
  methods: {
    ruleSamePassword (val) {
      return this.pwd === this.pwd1 || 'Las contraseñas no coinciden'
    },
    async requestToken () {
      try {
        if (this.count >= 5) {
          this.$store.commit('snackbar/push', {
            text: 'Revisa tu email'
          })
        }
        this.loadingMsg = 'Generando Token'
        const response = await standardUnauthPost({ 'email': this.email }, '/recovery/forgot-pwd')
        if (response.status === 200 && response.data.success) {
          this.count++
          this.status = 'checkingToken'
          this.awaiting = true
        } else if (response.status === 500) {
          // failed key
          this.$store.commit('snackbar/push', {
            text: 'Error al generar la llave'
          })
        } else if (response.status === 404) {
          // user not found
          this.$store.commit('snackbar/push', {
            text: 'El email o usuario no existe'
          })
        } else {
          // error
          this.$store.commit('snackbar/push', {
            text: 'Error'
          })
        }
        this.loadingMsg = ''
      } catch (err) {
        this.loadingMsg = ''
        console.log(err)
        this.$store.commit('snackbar/push', {
          text: 'Error, verifica tu conexion'
        })
      }
    },
    async changePwd () {
      try {
        this.loadingMsg = 'Actualizando y llevando a login'
        const response = await standardUnauthPost({ 'token': this.token, 'password': this.pwd }, '/recovery/reset-pwd')
        if (response.status === 200 && response.data.success) {
          this.$router.push({ name: 'login' })
        } else if (response.status === 404) {
          // key not found or expired
          this.$store.commit('snackbar/push', {
            text: 'La llave no existe o expiro'
          })
        } else {
          this.$store.commit('snackbar/push', {
            text: 'Error de servidor'
          })
        }
        this.loadingMsg = ''
      } catch (err) {
        this.loadingMsg = ''
        console.error(err)
        this.$store.commit('snackbar/push', {
          text: 'Error, verifica tu conexión'
        })
      }
    }
  }
}
</script>

<style>
.submit-container {
  text-align: center;
}
.default-button {
  width: 80%;
}
.default-loading {
  text-align:center;
  margin-top:30px;
  width:100%;
}
</style>
