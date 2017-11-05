<template>
  <div name="media">
    <!-- If image media thread -->
    <v-flex v-if="media && media.mimetype.match(/image/g)" xs12>
      <!-- Media Modal -->
      <imageModal :show="showMediaModal" @close="showMediaModal = false" :source="media.location"></imageModal>
      <!-- Media Thumbnail -->
      <v-card-media v-if="text" :src="media.thumbnail" height="200px" class="media-thumbnail" v-on:click="showMediaModal = true">
        <v-container fluid style="padding:10px;">
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
      <v-card-media v-else :src="media.location" height="200px" class="media-thumbnail-big" v-on:click="showMediaModal = true">
        <v-container fluid style="padding:10px;">
          <v-layout fill-height>
            <v-flex xs12 align-end flexbox>
              <v-spacer></v-spacer>
              <span class="white--text mimetype">
                <b>click -> expandir</b>
              </span>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-media>
    </v-flex>
    <!-- If video media thread -->
    <v-flex v-else-if="media && media.mimetype.match(/video/g)" xs12>
      <div>
        <video v-if="!text" style="margin:auto;width:50%;display:block;" controls>
          <source :src="media.location" :type="media.mimetype" />
        </video>
        <video v-else style="float:left;width:inherit;max-width:300px;display:block;margin:5px;" controls>
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
  max-width: 300px;
  display: block;
  margin-left:0px;
  margin-bottom: 5px;
  width: 100%;
  display: block;
  margin-right: 5px;
  cursor: pointer;
}
.media-thumbnail-big {
  margin:auto;
  width:50%;
  display:block;
  cursor: pointer;
}
.mimetype {
  background: rgba(0,0,0,0.6);
  padding: 5px;
}
</style>
