<template>
  <v-container fluid>

    <v-layout row>
      <v-flex xs12 text-xs-center>
        <h2> NetSlap</h2>
        <p>{{ slogans  }}</p>
      </v-flex>
    </v-layout>

    <v-layout row wrap justify-center>
      <v-flex xs12 xl4 lg4 md4>
        <v-card>
          <v-card-text>
            <v-text-field label="Usuario" v-model="user" @keyup.enter="login"/>
            <v-text-field
              label="Password"
              v-model="pwd"
              type="password"
              @keyup.enter="login"/>
            <div class="submit-container">
              <v-btn primary large v-on:click="login"> Iniciar </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs12 text-xs-center>
        <router-link :to="{ name: 'signup' }">
          <v-btn flat primary large> Registrate </v-btn>
        </router-link>
      </v-flex>
    </v-layout>

    <!--
    <v-layout row>
      <v-flex xs12 text-xs-center>
        <router-link to="#">
          Olvidaste tu contraseña?
        </router-link>
      </v-flex>
    </v-layout><br />
  -->
  
    <v-layout row justify-center>
      <v-flex xs12 xl4 lg4 md4 text-xs-center>
          <h6>(Exclusivo alumnos UdeG)</h6>
          NetSlap® es una plataforma de foros/muros hecha para la comunidad de
          estudiantes de la Universidad de Guadalajara basada en los
          imageboards futaballaby o "chans", <i>Bienvenidos a casa buitres.</i>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import {standardLogin, getDevUrl} from '../../utils/maskmob-api'

const slogans = [
  'Sin libertad de pensamiento, la libertad de expresion no sirve de nada',
  'La libertad, cuando echa raíces, es una planta de rápido crecimiento',
  'La originalidad no es otra cosa que imitación con criterio',
  'La creatividad viene de un conflicto de ideas'
]

export default {
  name: 'login',
  created () {
    // If user is logged in, take to main app
    if (this.$session.exists()) {
      // window.location.href = `${getBaseUrl()}/`
      window.location.href = `${getDevUrl()}/#/`
    }
  },
  data () {
    return {
      user: '',
      pwd: '',
      username: 'hello',
      loading: false,
      slogans: slogans[Math.floor((Math.random() * 3))]
    }
  },
  methods: {
    login () {
      this.loading = true
      standardLogin(this.$data.user, this.$data.pwd).then((response) => {
        if (response.status === 200 && 'token' in response.data) {
          if (response.data.success) {
            // Destroy session if it already exists
            if (this.$session.exists()) {
              this.$session.destroy()
            }
            // Start new session with new token
            this.$session.start()
            this.$store.commit('setJWT', response.data.token)
            this.$session.set('JWTOKEN', response.data.token)
            this.$session.set('USER', response.data.user)
            // Take to main application
            // window.location.href = `${getBaseUrl()}/`
            this.$eventHub.$emit('logged-in')
            this.$router.push({ name: 'home' })
            this.$store.commit('snackbar/push', {
              text: 'Bienvenido a NetSlap®'
            })
          } else {
            this.$store.commit('snackbar/push', {
              text: 'Usuario o contraseña incorrecto'
            })
          }
        } else {
          this.$store.commit('snackbar/push', {
            text: 'Usuario o contraseña incorrecto'
          })
        }
        this.loading = false
      }).catch((err) => {
        if (err) {
          this.$store.commit('snackbar/push', {
            text: 'Error, verifica tu conexion'
          })
        }
        this.loading = false
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.submit-container {
  text-align: center;
}

.default-max-width {
  max-width: 400px;
}

</style>
