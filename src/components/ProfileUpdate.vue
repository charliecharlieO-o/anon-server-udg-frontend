<template>
  <transition name="modal">
    <div class="modal-mask" v-on:click="close" v-show="show">
      <div class="modal-container" @click.stop>
        <!-- Updating -->
        <div v-if="uploading" style="text-align:center;width:inherit;display:block;margin:auto;">
          <v-progress-circular indeterminate v-bind:size="100" class="cyan--text"></v-progress-circular>
          <h4>Actualizando...</h4>
        </div>
        <!-- Error -->
        <div v-if="!uploading && errorCode" style="text-align:center;width:inherit;display:block;margin:auto;">
          <h4>ERROR {{ errorCode }} - {{ error }}</h4>
        </div>
        <!-- Update Form -->
        <div v-if="!uploading && !errorCode">
          <div class="modal-body" style="margin-top:0px;margin-bottom:0px;">
            <v-text-field
              v-model="text"
              label="Descripcion/Bio"
              textarea
              counter
              max="300"
              rows="3"
              style="margin-top:0px;margin-bottom:0px;"
              maxlength="300"
            ></v-text-field>
          </div>
          <div container fluid style="margin-top:0px;margin-bottom:0px;">
            <v-layout row wrap align-center>
              <v-flex xs12 style="text-align:left;margin-bottom:5px;">
                <span style="font-size:130%;">Imagen de Perfil: </span>
                <input type="file" name="postFile" accept="audio/*|video/*|image/*"
                @change="filesChange($event.target.name, $event.target.files)" />
              </v-flex>
            </v-layout>
          </div>
          <div class="modal-footer text-right" style="margin-top:0px;padding-bottoom:0px;">
            <div container fluid>
              <v-layout row wrap>
                <v-flex xs6 style="text-align:left;">
                  <v-btn v-tooltip:top="{ html: 'Cancelar' }"
                  medium class="red white--text" style="margin-left:0px;" @click="close">
                    <v-icon medium dark>cancel</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex xs6 style="text-align:right;">
                  <v-btn v-tooltip:top="{ html: 'Actualizar' }"
                  medium class="primary white--text" style="margin-right:0px;" v-on:click="updateProfile">
                    <v-icon medium dark>autorenew</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: ['show', 'user'],
  data () {
    return {
      title: '',
      text: '',
      uploading: false,
      errorCode: '',
      error: '',
      form: null
    }
  },
  methods: {
    close () {
      this.$emit('close')
      this.text = ''
      this.uploading = false
      this.errorCode = ''
      this.error = ''
    },
    filesChange (fieldName, fileList) {
      // Create new form data
      const formData = new FormData()
      // Check if there is an actual file selected
      if (!fileList.length) return
      // Check if valid file type
      // Append file
      formData.append('mfile', fileList[0])
      this.form = formData
    },
    updateProfile () {}
  },
  mounted () {
    document.addEventListener('keydown', (e) => {
      if (this.show && e.keyCode === 27) {
        this.close()
      }
    })
  }
}
</script>

<style scoped>
* {
    box-sizing: border-box
}

.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    transition: opacity .3s ease;
}

.modal-container {
    max-width:45%;
    min-width:300px;
    margin: 40px auto 0;
    padding:0px 30px;
    padding-bottom:20px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
