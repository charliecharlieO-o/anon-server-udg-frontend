<template>
  <div name="media">
    <!-- If image media thread -->
    <v-flex v-if="media && media.mimetype.match(/image/g)" xs12>
      <!-- Media Modal -->
      <imageModal :show="showMediaModal" @close="showMediaModal = false" :source="media.location"></imageModal>
      <!-- Media Thumbnail -->
      <v-card-media :src="media.thumbnail" height="200px" class="media-thumbnail" v-on:click="showMediaModal = true">
        <v-container fluid>
          <v-layout fill-height>
            <v-flex xs12 align-end flexbox>
              <v-spacer></v-spacer>
              <span class="white--text mimetype">
                <b>{{ media.mimetype }}</b>
              </span>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-media>
    </v-flex>
    <!-- If video media thread -->
    <v-flex v-else-if="media && media.mimetype.match(/video/g)" xs12>
      <div>
        <video class="video-comp" controls>
          <source :src="media.location" :type="media.mimetype" />
        </video>
      </div>
    </v-flex>
  </div>
</template>

<script>
import imageModal from './ImageModal'
export default {
  props: ['media', 'text'],
  components: {
    imageModal: imageModal
  },
  data () {
    return {
      showMediaModal: false
    }
  }
}
</script>

<style scoped>
.media-thumbnail {
  float: left;
  width: inherit;
  max-width:300px;
  display: block;
  width: 100%;
  display: block;
  cursor: pointer;
  margin-bottom: 5px;
}
.mimetype {
  background: rgba(0,0,0,0.6);
  padding: 5px;
}
.video-comp {
  float:left;
  width:inherit;
  max-width:300px;
  display:block;
  margin-bottom:5px;
}
</style>
