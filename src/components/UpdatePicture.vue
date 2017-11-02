<template>
  <transition name="modal">
    <div class="modal-mask" v-on:click="close" v-show="show">
      <div class="modal-container" @click.stop>
        <!-- Updating -->
        <div v-if="updating" style="text-align:center;width:inherit;display:block;margin:auto;">
          <v-progress-circular indeterminate v-bind:size="100" class="cyan--text"></v-progress-circular>
          <h4>Actualizando...</h4>
        </div>
        <!-- Error -->
        <div v-if="!updating && errorCode" style="text-align:center;width:inherit;display:block;margin:auto;">
          <h4>ERROR {{ errorCode }} - {{ error }}</h4>
        </div>
        <!-- Update Form -->
        <div v-if="!updating && !errorCode">
          <!-- PROFILE PIC VIEW -->
          <div class="profile-box">
            <v-list-tile-avatar>
              <img :src="picture" class="profile-picture" />
            </v-list-tile-avatar>
          </div>
          <!-- PROFILE PIC EDITED -->
          <div container fluid style="margin-top:0px;margin-bottom:0px;">
            <v-layout row wrap align-center>
              <v-flex xs12 style="text-align:center;margin-bottom:5px;">
                <input type="file" name="postFile" accept="image/*"
                @change="filesChange($event.target.name, $event.target.files)" />
              </v-flex>
            </v-layout>
          </div>
          <div class="modal-footer text-right" style="margin-top:5px;padding-bottoom:0px;">
            <div container fluid>
              <v-layout row wrap>
                <v-flex xs4 offset-xs2 style="text-align:left;">
                  <v-btn v-tooltip:top="{ html: 'Cancelar' }"
                  large class="red white--text" style="margin-left:0px;" @click="close">
                    <v-icon medium dark>cancel</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex xs4 style="text-align:right;">
                  <v-btn v-tooltip:top="{ html: 'Actualizar' }"
                  large class="primary white--text" style="margin-right:0px;" v-on:click="updateProfile">
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
import {standardAuthPutUpload} from '../../utils/maskmob-api'
export default {
  props: ['show', 'picture'],
  data () {
    return {
      updating: false,
      errorCode: '',
      error: '',
      form: null
    }
  },
  methods: {
    close () {
      if (this.updating) {
        return
      } else {
        this.$emit('close')
        this.updating = false
        this.errorCode = ''
        this.error = ''
        this.form = null
      }
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
    async updateProfile () {
      this.updating = true
      // Check if form has been created
      if (!this.form) {
        this.form = new FormData()
      }
      // Prepare data
      this.bio.trim()
      this.form.append('bio', this.bio)
      // Send shit
      try {
        const response = standardAuthPutUpload(this.$session.get('JWTOKEN'), '/user/update-profile', this.form)
        if (response.status === 200 && response.data.success === true) {
          this.updating = false
          this.$emit('updated')
          this.close()
        } else {
          this.errorCode = response.status
          this.error = 'error'
        }
      } catch (error) {
        this.error = 'error'
      }
      this.updating = false
    }
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
    max-width:35%;
    min-width:300px;
    margin: 40px auto 0;
    padding:0px 15px;
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

.profile-box {
  text-align:center;
  padding: 20px;
  margin-bottom: 10px;
}

.profile-picture {
  height:125px;
  width:125px;
  background-color:grey;
}
</style>
