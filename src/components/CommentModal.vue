<template>
  <transition name="modal">
    <div class="modal-mask" v-on:click="close" v-show="show">
      <div class="modal-container" @click.stop>
        <div v-if="uploading" style="text-align:center;width:inherit;display:block;margin:auto;">
          <v-progress-circular indeterminate v-bind:size="100" class="cyan--text"></v-progress-circular>
          <h4>Enviando...</h4>
        </div>
        <div v-if="!uploading && errorCode" style="text-align:center;width:inherit;display:block;margin:auto;">
          <h4>ERROR {{ errorCode }} - {{ error }}</h4>
        </div>
        <div v-if="!uploading && !errorCode">
          <div class="modal-body" style="margin-top:0px;margin-bottom:0px;">
            <v-text-field
              v-model="text"
              label="Texto"
              textarea
              counter
              max="1000"
              rows="5"
              style="margin-top:0px;margin-bottom:0px;"
              maxlength="1000"
            ></v-text-field>
          </div>
          <div container fluid style="margin-top:0px;margin-bottom:0px;">
            <v-layout row wrap align-center>
              <v-flex xs12 style="text-align:left;margin-bottom:5px;">
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
                  <v-btn v-tooltip:top="{ html: 'Enviar' }"
                  medium class="primary white--text" style="margin-right:0px;" v-on:click="submitReply">
                    <v-icon medium dark>send</v-icon>
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
import {standardAuthUpload} from '../../utils/maskmob-api'
export default {
  template: '#commentPostModal',
  props: ['show', 'thread', 'reply'],
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
    submitReply () {
      this.uploading = true
      // Check if form has been created
      if (!this.form) {
        this.form = new FormData()
      }
      // Prepare data
      this.text.trim()
      this.form.append('text', this.text)
      const replyURL = (this.reply) ? `/thread/${this.$props['thread']}/replies/${this.$props['reply']}/reply` : `/thread/${this.$props['thread']}/reply`
      standardAuthUpload(this.$session.get('JWTOKEN'), replyURL, this.form).then((response) => {
        if (response.status === 200 && response.data.success) {
          // Show comment
          console.log(response)
        } else {
          // Show error
        }
        this.uploading = false
        this.close()
      }).catch((err) => {
        console.log(err)
        this.uploading = false
        this.close()
      })
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

.modal-header h3 {
    margin-top: 0;
    color: #42b983;
}

.modal-body {
    margin: 20px 0;
}

.text-right {
    text-align: right;
}

.form-label {
    display: block;
    margin-bottom: 1em;
}

.form-label > .form-control {
    margin-top: 0.5em;
}

.form-control {
    display: block;
    width: 100%;
    padding: 0.5em 1em;
    line-height: 1.5;
    border: 1px solid #ddd;
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
