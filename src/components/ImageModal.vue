<template>
  <transition name="modal">
    <div class="modal-mask" v-on:click="close" v-show="show">
      <div v-if="source" @click.stop>
        <img v-on:click="close" class="modal-container absolute-center" :src="source" style="width:auto; height:auto;"/>
        <div class="hidden-sm-and-down modal-container" style="text-align:right;">
          <v-btn class="" fab dark error v-on:click="close">
            <v-icon dark>close</v-icon>
          </v-btn>
        </div>
      </div>
      <h2 v-else class="white--text center-div">404 - ERR</h2>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'imageModal',
  template: '#imageModal',
  props: ['show', 'source'],
  data () {
    return {
    }
  },
  methods: {
    close () {
      this.$emit('close')
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
    max-width:75%;
    min-width:300px;
    margin: 40px auto 0;
    border-radius: 2px;
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
    max-height: 98%;
}

.absolute-center {
  margin: auto;
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
}

.center-div {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
