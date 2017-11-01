<template>
  <div class="container-fluid">
    <div>
      <!-- Main container -->
      <div class="row" style="margin-bottom:25px;">
        <div class="col-md-12" style="text-align:center;">
          <h1 class="AppTitle">NetSlap</h1>
          <p class="Slogan">{{ slogans  }}</p>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12" style="text-align:center;">
          <input class="text-input" v-model="user" style="margin-top:10px;" type="text" placeholder="Usuario o Email"/>
          <input class="text-input" @keyup.enter="login" v-model="pwd" style="margin-top:10px;" type="password" placeholder="Password" />
        </div>
      </div>
      <div class="row" style="text-align:center;margin-top:20px;">
        <div class="col-md-12">
          <v-progress-circular v-if="loading" indeterminate v-bind:size="50" class="cyan--text"></v-progress-circular>
        </div>
      </div>
      <div class="row" v-if="!loading" style="text-align:center;margin-bottom:25px;">
        <div class="col-md-12">
          <button class="app-button" v-on:click="login">Login</button><div class="light-text">O</div>
        </div>
        <div class="col-md-12">
          <router-link to="signup"><button class="app-button">Registrarse</button></router-link>
        </div>
      </div>
      <div class="row" style="text-align:center;">
        <div class="col-md-12">
          <a href="">Olvide mi contrasena</a>
        </div>
      </div>
      <div class="row" style="text-align:center;margin-top:100px;">
        <div class="col-md-12">
          <p class="poetic-paragraph">
            NetSlap® es una plataforma de foros/boards hecha para la <br />comunidad de
            estudiantes de la Universidad de Guadalajara basada <br /> en los
            imageboards futaballaby o "chans"<i>, Bienvenidos a casa buitres.</i>
          </p>
        </div>
      </div>
    </div>

  </div>
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
      loading: false,
      slogans: slogans[Math.floor((Math.random() * 3))]
    }
  },
  methods: {
    login () {
      console.log('login button pressed')
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
          } else {
            alert('usuario o password incorrecto')
          }
        } else {
          alert('usuario o password incorrecto')
        }
        this.loading = false
      }).catch((err) => {
        if (err) {
          alert('Error al loggear, verifica el estado de tu conexion')
        }
        this.loading = false
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import '/static/mainapp.css';
@import '/static/bootstrap.min.css';
.box-div {
  padding-top: 5%;
  height: 100%;
  text-align: center;
}

.AppTitle {
  font-size: 370%;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: normal;
  font-style: bold;
  margin-bottom: 0px;
}

.Slogan {
  padding-top: 0px;
  margin-top: 1px;
  font-size: medium;
  font-style: italic;
  font-size: 150%;
}

.poetic-paragraph {
  font-size: 99%;
  font-family: "Courier New", Courier, monospace;
  color: #303030;
}
</style>
