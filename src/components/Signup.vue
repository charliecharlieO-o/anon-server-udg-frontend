<template>
  <div class="container-fluid">

    <!-- Caja de datos basicos de perfil Paso 1 -->
    <div class="row" v-if="stage===1">
      <!-- Header -->
      <div class="container-label">
        <div class="white-label-big">Paso 1 de 2: Crea tu Cuenta</div>
      </div>
      <div class="padded-container">

        <!-- Header de datos basicos -->
        <div class="row">
          <div class="col-md-12">
            <h3>Datos Basicos</h3><hr />
            <p class="light-text" style="font-size:125%;">
              Podras cambiar tu imagen de perfil, descripcion y redes sociales en
              la seccion de 'perfil' una vez que la cuenta sea verificada y creada.
            </p>
          </div>
        </div>
        <!-- Datos de usuario -->
        <div class="row" style="margin-top:20px;">
          <div class="col-md-3"></div>
          <div class="col-md-3" style="text-align:center;">
            <label class="light-text">Nombre de Usuario:  </label>
          </div>
          <div class="col-md-3" style="text-align:left;">
            <input v-model="username" class="form-control"/>
            <p v-if="!usernameError" class="light-text">No lo podras cambiar en el futuro</p>
            <p class="light-text" style="color:#F00">{{ usernameError }}</p>
          </div>
          <div class="col-md-3"></div>
        </div>
        <div class="row">
          <div class="col-md-3"></div>
          <div class="col-md-3" style="text-align:center;">
            <label class="light-text">Password:</label>
          </div>
          <div class="col-md-3" style="text-align:left;">
            <input v-model="pwd1" class="form-control" type="password" />
            <p v-if="!pwdMatchError" class="light-text">Entre mas largo y complejo, mejor.</p>
            <br v-else />
            <input v-model="pwd2" class="form-control" type="password" />
            <p v-if="!pwdMatchError" class="light-text">Por favor repitelo.</p>
            <p class="light-text" style="color:#F00">{{ pwdMatchError }}</p>
          </div>
          <div class="col-md-3"></div>
        </div>
        <div class="row">
          <div class="col-md-3"></div>
          <div class="col-md-3" style="text-align:center;">
            <label class="light-text">email:</label>
          </div>
          <div class="col-md-3" style="text-align:left;">
            <input class="form-control" v-model="email"/>
            <p v-if="!emailError" class="light-text">En el muy raro caso de que olvides tu contrasena ;)</p>
            <p class="light-text" style="color:#F00">{{ emailError }}</p>
          </div>
          <div class="col-md-3"></div>
        </div>
        <!-- Header de cuenta udg -->
        <div class="row">
          <div class="col-md-12">
            <h3>Comprueba que perteneces a la UdeG</h3><hr />
            <p class="light-text" style="font-size:125%;">
              Por ahora este sitio es exclusivo para estudiantes de la Universidad de Guadalajara,
              ingresa tu nip y contrasena de SIIAU para verificar.
              <b>NetSlap no almacenara tus credenciales de estudiante ni tus datos
              privados</b>
            </p>
          </div>
        </div>
        <!-- Seccion de UdeG -->
        <div class="row" style="margin-top:50px;margin-bottom:50px;">
          <div class="col-md-4"></div>
          <div class="col-md-2" style="margin-top:5px;">
            <input v-model="nip" class="form-control" placeholder="NIP" />
            <p class="light-text" style="color:#F00">{{ nipError }}</p>
          </div>
          <div class="col-md-2" style="margin-top:5px;">
            <input v-model="udgpwd" class="form-control" placeholder="PASSWORD" type="password" />
            <p class="light-text" style="color:#F00" >{{ udgPwdError }}</p>
          </div>
          <div class="col-md-4"></div>
        </div>

        <!-- Siguiente paso -->
        <div class="row">
          <div class="col-md-12" style="text-align:right;padding-right:2%;">
            <button v-on:click="submitAccountDetails" class="app-button-def">Crear Cuenta ►</button>
          </div>
        </div>
      </div>
    </div>

    <div class="row" v-if="creatingAccount">
      <div class="col-md-5"></div>
      <div class="col-md-2" style="text-align:center;">
        <img src="../assets/dubring.svg" /><br />
        <h4>Estamos Creando tu Cuenta</h4>
      </div>
      <div class="col-md-5"></div>
    </div>

    <!-- Caja de datos extra Paso 2 -->
      <div class="row" v-if="stage===2">
      <!-- Header -->
      <div class="container-label">
        <div class="white-label-big">Paso 2 de 2: Anonimidad</div>
      </div>
      <div class="padded-container">

        <!-- Alias -->
        <div class="row">
          <div class="col-md-12">
            <h3>Elige un Alias (opcional)</h3><hr />
            <p class="light-text" style="font-size:125%;">
              Un <i>alias</i> es un nombre de perfil temporal que puedes cambiar cada <b>24 horas</b>.
              Todo post o comentario que hagas (<b>si tienes un alias</b>) se hara bajo ese nombre, no
              bajo tu perfil original. Lo puedes eliminar en cualquier momento para postear de manera
              publica otra vez.
            </p>
          </div>
          <div class="row">
            <div class="col-md-6">
              <h5>Ventajas:</h5>
              <ul style="text-align:left;">
                <li>
                  Nadie sabra quien eres efectivamente protegiendo
                  tu privacidad el 99.99% de los casos.
                </li>
              </ul>
            </div>
            <div class="col-md-6">
              <h5>Desventajas:</h5>
              <ul style="text-align:left;">
                <li>
                  Otros usuarios no podran agregarte como contacto.
                </li>
                <li>
                  Tu imagen de perfil, networks y descripcion no son visibles.
                </li>
                <li>
                  Aun puedes ser expulsado del sitio si posteas contenido ilegal.
                </li>
              </ul>
            </div>
          </div>
          <div class="row">
            <div class="col-md-4"></div>
            <div class="col-md-4" style="text-align:center;">
              <label class="light-text">Elige el tuyo: </label>
              <input class="form-control" v-model="alias" />
            </div>
            <div class="col-md-4"></div>
          </div>
        </div>

        <!-- Siguiente paso -->
        <div class="row">
          <div class="col-md-12" style="text-align:right;padding-right:2%;">
            <button class="app-button-def" v-on:click="changeAccountAlias">Entrar o Saltar ►</button>
          </div>
        </div>

      </div>
    </div>

    <div class="row" v-if="settingAlias">
      <div class="col-md-5"></div>
      <div class="col-md-2" style="text-align:center;">
        <img src="../assets/dubring.svg" /><br />
        <h4>Estamos Creando tu Alias</h4>
      </div>
      <div class="col-md-5"></div>
    </div>

    <!-- Caja de bienvenida -->
    <div class="row" v-if="stage===3">
      <div class="col-md-3"></div>
      <div class="col-md-6" style="text-align:center;">
        <h2>Bienvenido al sitio mas exclusivo de Jalisco</h2>
        <img style="width:100%;height:auto;margin-bottom:50px;" src="../assets/welcome.gif" />
      </div>
      <div class="col-md-3"></div>
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
    login () {
      standardLogin(this.username, this.pwd1).then((response) => {
        if (response.status === 200 && 'token' in response.data) {
          if (response.data.success) {
            // Destroy session if it already exists
            if (this.$session.exists()) {
              this.$session.destroy()
            }
            // Start new session with new token
            this.$session.start()
            this.$session.set('JWTOKEN', response.data.token)
          }
        }
      }).catch((err) => {
        if (err) {
          alert('Error al loggear, verifica el estado de tu conexion')
        }
      })
    },
    submitAccountDetails (e) {
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
        standardUnauthPost(userAccount, '/user/register').then((response) => {
          // Process response
          if (response.status === 200 && response.data) {
            const obj = response.data
            if (obj.success === true) {
              // if it's successfull login user
              this.login()
              this.stage = 2
            } else {
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
            }
          } else {
            alert('Error al registrarse, revisa tu conexion.')
          }
        }).catch((err) => {
          if (err) {
            alert(`Error al registrarse, revisa tu conexion. ${err.code}`)
          }
        })
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
@import '/static/mainapp.css';
@import '/static/bootstrap.min.css';
.signup {
  padding-top: 5%;
  height: 100%;
}

.container-label {
  background-color: #00acc1;
  border: 0px;
}

</style>
