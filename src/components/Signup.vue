<template>
  <div class="container-fluid">
    <v-container>
      <v-layout row>
        <v-flex xs3>
        </v-flex>
        <v-flex xs6>
          <v-card>
            <v-card-title>
              <h4>
                Registro
              </h4>
            </v-card-title>
            <v-card-text>
              <v-text-field
                label="Usuario"
                v-model="username"/>
              <v-text-field
                label="Correo"
                v-model="email"
                type="email"/>
              <v-text-field
                label="Contraseña"
                v-model="pwd1"
                type="password"/>
              <v-text-field
                label="Confirmar Contraseña"
                v-model="pwd2"
                type="password"/>
              <v-text-field
                label="Codigo UdeG"
                v-model="nip" />
              <v-text-field
                label="Password"
                v-model="udgpwd"
                type="password" />
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
    <div class="row" v-if="creatingAccount">
      <div class="col-md-5"></div>
      <div class="col-md-2" style="text-align:center;">
        <img src="../assets/dubring.svg" /><br />
        <h4>Estamos Creando tu Cuenta</h4>
      </div>
      <div class="col-md-5"></div>
    </div>
  </div>
</template>

<script>
import {validateUserName, validateEmail} from '../../utils/validation'
import {standardLogin, standardUnauthPost, standardAuthPut} from '../../utils/maskmob-api'

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
      stage: 1,
      username: '',
      usernameError: '',
      pwd1: '',
      pwd2: '',
      pwdMatchError: '',
      email: '',
      emailError: '',
      nip: '',
      udgpwd: '',
      nipError: '',
      udgPwdError: '',
      creatingAccount: false,
      alias: '',
      settingAlias: false
    }
  },
  methods: {
    checkUserName (val) {
      let result = validateUserName(val)
      switch (result.err) {
        case 'empty':
          this.usernameError = 'El nombre de usuario no debe estar vacio'
          return false
        case 'length':
          this.usernameError = 'Debe de contener mas de 2 caracteres'
          return false
        case 'badchars':
          this.usernameError = 'No debe de contener los caracteres: \' " < > &'
          return false
        default:
          this.usernameError = null
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
        this.emailError = 'Email Invalido'
        return false
      } else {
        this.emailError = ''
        return true
      }
    },
    checkUdeGCreds (nip, pwd) {
      if (nip !== '' && pwd !== '') {
        this.nipError = ''
        this.udgPwdError = ''
        return true
      } else {
        if (nip === '') {
          this.nipError = 'Este campo es necesario'
        }
        if (pwd === '') {
          this.udgPwdError = 'Este campo es necesario'
        }
        return false
      }
    },
    displayValidationErrors (errors) {
      for (let key in errors) {
        if (key === 'username') {
          this.usernameError = 'Nombre de usuario invalido'
        }
        if (key === 'email') {
          this.emailError = 'Email invalido'
        }
        if (key === 'password') {
          this.pwdMatchError = 'Necesitas incluir un password'
        }
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
          alert('Error al loggear, verifica el estado de tu conexion')
        }
      }
    },
    async submitAccountDetails (e) {
      let namePass = this.checkUserName(this.username)
      let pwdPass = this.checkPwd(this.pwd2)
      let emlPass = this.checkEmail(this.email)
      let udgCred = this.checkUdeGCreds(this.nip, this.udgpwd)

      if (namePass && pwdPass && emlPass && udgCred) {
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
            alert('Hay errores en algunos campos')
          } else {
            if (obj.err === 101) {
              alert('Tu NIP o Password UdeG son incorrectos, eres estudiante?')
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
    },
    changeAccountAlias (e) {
      this.settingAlias = true
      // Welp change logged in user's alias
      standardAuthPut({'alias': this.alias}, this.$session.get('JWTOKEN'), '/user/alias').then((response) => {
        console.log(response)
        if (response.status === 200 && response.data) {
          // Notify through event hub
          this.$eventHub.$emit('logged-in')
          // warm welcome
          this.stage = 3
        } else {
          alert('Error: verifica que el campo sea valido')
        }
        this.settingAlias = false
      }).catch((err) => {
        alert(err)
        this.settingAlias = false
      })
    }
  },
  watch: {
    username (val, oldVal) {
      this.checkUserName(val)
    },
    pwd2 (val, oldVal) {
      this.checkPwd(val)
    },
    email (val, oldVal) {
      this.checkEmail(val)
    },
    nip (val, oldVal) {
      this.checkUdeGCreds(this.nip, this.udgpwd)
    },
    udgpwd (val, oldVal) {
      this.checkUdeGCreds(this.nip, this.udgpwd)
    }
  }
}
</script>

<style scoped>
</style>
