<template>
  <div class="container-fluid">
    <v-container fuid>
      <v-layout row wrap justify-center>
        <!-- Loading thing -->
        <!-- SignUp stuff -->
        <v-flex xs12 xl6 lg6 md6>
          <v-card>
            <v-card-title>
              <h4>
                Registro
              </h4>
            </v-card-title>
            <v-card-text>
              <span v-if="usernameError" style="color:red">{{usernameError}}</span>
              <v-text-field
                label="Usuario"
                @keyup.enter="submitAccountDetails"
                v-model="username"
                :rules="[checkUserName]"
                required />
              <span v-if="emailError" style="color:red">{{emailError}}</span>
              <v-text-field
                label="Correo"
                v-model="email"
                type="email"
                :rules="[checkEmail]"
                @keyup.enter="submitAccountDetails"
                required />
              <v-text-field
                label="Contraseña"
                v-model="pwd1"
                type="password"
                required
                @keyup.enter="submitAccountDetails"
                :rules="[ruleSamePassword]"/>
              <v-text-field
                label="Confirmar Contraseña"
                v-model="pwd2"
                type="password"
                required
                @keyup.enter="submitAccountDetails"
                :rules="[ruleSamePassword]"/>
              <span v-if="nipError" style="color:red">{{nipError}}</span>
              <v-text-field
                label="Codigo UdeG"
                v-model="nip"
                @keyup.enter="submitAccountDetails"
                required />
              <v-text-field
                label="Password"
                v-model="udgpwd"
                type="password"
                @keyup.enter="submitAccountDetails"
                required />
              <div style="text-align: right">
                <v-btn primary v-on:click="submitAccountDetails">
                  Crear cuenta
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import {validateUserName, validateEmail} from '../../utils/validation'
import {standardLogin, standardUnauthPost} from '../../utils/maskmob-api'

export default {
  name: 'signup',
  // Reroute to app main as user is already logged in
  created () {
    if (this.$session.exists()) {
      this.$router.push({ 'name': 'login' })
    }
  },
  data () {
    return {
      username: '',
      pwd1: '',
      pwd2: '',
      email: '',
      nip: '',
      udgpwd: '',
      creatingAccount: false,
      usernameError: '',
      emailError: '',
      nipError: ''
    }
  },
  methods: {
    ruleSamePassword (val) {
      return this.pwd1 === this.pwd2 || 'Las contraseñas no coinciden'
    },
    checkUserName (val) {
      let result = validateUserName(val)
      switch (result.err) {
        case 'empty':
          return 'El nombre de usuario no debe estar vacio'
        case 'length':
          return 'Debe de contener mas de 2 caracteres'
        case 'badchars':
          return 'No debe de contener los caracteres: \' " < > &'
        default:
          return true
      }
    },
    checkPwd (val) {
      if (!this.pwd1 || !this.pwd2) {
        this.pwdMatchError = 'Es necesario que escribas el password dos veces'
        return false
      } else if (this.pwd1 !== val) {
        this.pwdMatchError = 'El password no es el mismo'
        return false
      } else {
        this.pwdMatchError = ''
        return true
      }
    },
    checkEmail (val) {
      if (!validateEmail(this.email)) {
        return 'Email Invalido'
      } else {
        return true
      }
    },
    async login () {
      try {
        const response = await standardLogin(this.username, this.pwd1)
        if (response.status === 200 && 'token' in response.data) {
          if (response.data.success) {
            // Destroy session if it already exists
            if (this.$session.exists()) {
              this.$session.destroy()
            }
            // Start new session with new token
            this.$session.start()
            this.$session.set('JWTOKEN', response.data.token)
            this.$session.set('USER', response.data.user)
            this.$store.commit('setJWT', response.data.token)
            this.$router.push({ name: 'home' })
          }
        }
      } catch (err) {
        if (err) {
          console.error(err)
          this.$store.commit('snackbar/push', {
            text: 'Error, verifica tu conexion'
          })
        }
      }
    },
    async submitAccountDetails (e) {
      // Reset errores
      this.usernameError = ''
      this.emailError = ''
      this.nipError = ''

      let namePass = this.checkUserName(this.username)
      let pwdPass = this.checkPwd(this.pwd2)
      let emlPass = this.checkEmail(this.email)

      if (namePass && pwdPass && emlPass) {
        // Prepare JSON
        const userAccount = {
          'username': this.username.trim(),
          'password': this.pwd1,
          'email': this.email.trim(),
          'nip': this.nip,
          'udgpwd': this.udgpwd
        }

        this.creatingAccount = true
        // Try AJAX account post
        const response = await standardUnauthPost(userAccount, '/user/register')
        // Process response
        if (response.status !== 200 || !response.data) {
          alert('Error al registrarse, revisa tu conexion.')
          return
        }

        const obj = response.data
        if (obj.success === false) {
          // If it's validation Error
          if (obj.valerr) {
            alert('error de validacion')
          } else if (obj.dberr) {
            obj.dberr = String(obj.dberr.trim())
            // Process mongoose post save errors
            if (obj.dberr === 'username already exists') {
              this.usernameError = 'El nombre de usuario ya existe'
            }
            if (obj.dberr === 'nipCode already exists') {
              this.nipError = 'El NIP ya ha sido usado'
            }
            if (obj.dberr === 'email already exists') {
              this.emailError = 'El email ya ha sido usado'
            }
            this.$store.commit('snackbar/push', {
              text: 'Hay errores en algunos campos'
            })
          } else {
            if (obj.err === 101) {
              this.$store.commit('snackbar/push', {
                text: 'Tu NIP o Password UdeG son incorrectos, eres estudiante?'
              })
            }
          }
          return
        }
        // Success
        this.login()
        this.stage = 2
        this.creatingAccount = false
      } else {
        alert('Hay errores en algunos campos')
      }
    }
  }
}
</script>

<style scoped>
</style>
