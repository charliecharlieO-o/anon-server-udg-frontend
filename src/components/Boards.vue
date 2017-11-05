<template>
  <div id="boardsMain">
    <!-- Loading div -->
    <v-container fluid style="padding:16px;">
      <!-- Header -->
      <v-layout row wrap>
        <v-flex xs12 style="text-align:left;">
          <h4>Grupos <v-icon medium>public</v-icon></h4>
        </v-flex>
      </v-layout>
      <v-divider style="margin-top:3px;margin-bottom:5px;"></v-divider>
      <!-- Loading Div -->
      <div v-if="loadingBoards && !loadingError" style="text-align:center;margin-top:30px;">
        <v-progress-circular indeterminate v-bind:size="100" class="cyan--text"></v-progress-circular>
        <h4>Cargando...</h4>
      </div>
      <!-- Error Div -->
      <div v-if="loadingError" style="text-align:center;margin-top:30px;">
        <h4>ERROR {{ errorCode }}</h4>
      </div>
      <!-- Groups Container -->
      <v-container fluid grid-list-md>
        <v-layout row wrap align-center child-flex-sm>
          <v-flex xs4-12 v-for="board in boards" :key="board._id">
            <v-card :id="board.slug" style="margin:5px;min-width:250px;max-width:300px;height:auto;">
              <router-link style="text-decoration:none;" :to="{ name: 'board', params: {slug:board.slug} }">
                <v-card-media :src="board.image.thumbnail" height="200px">
                  <v-container fill-height fluid style="background:rgba(0,0,0,0.6);">
                    <v-layout fill-height>
                      <v-flex xs12 style="color:white;" align-end flexbox>
                        <span class="headline">/{{ board.short_name }}/</span>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-media>
                <v-card-text style="margin-left:0px;padding:0px;">
                  <v-container fluid>
                    <v-layout row>
                      <v-flex xs12>
                        <p style="margin-top:0px;margin-bottom:10px;">
                          <b>{{ board.name }}</b>
                        </p>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
              </router-link>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-container>
  </div>
</template>

<script>
import {standardAuthGet, parseBoards} from '../../utils/maskmob-api'
export default {
  name: 'boards',
  data () {
    return {
      loadingError: false,
      loadingBoards: true,
      errorCode: null,
      boards: [],
      errorSearch: ''
    }
  },
  created () {
    this.loadBoards()
  },
  methods: {
    loadBoards () {
      this.$data.loadingError = false
      this.$data.errorCode = null
      standardAuthGet(this.$session.get('JWTOKEN'), '/board/list/short').then((response) => {
        if (response.status === 200) {
          const boards = parseBoards(response.data.doc)
          this.$data.loadingBoards = false
          this.$data.boards = boards
        } else {
          this.$data.errorCode = String(response.status)
          this.$data.loadingError = true
        }
      }).catch((err) => {
        this.$data.loadingError = true
        console.log(err)
      })
    }
  }
}
</script>

<style></style>
