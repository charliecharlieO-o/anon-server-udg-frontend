<template>
  <v-container id="boardView" fluid style="margin:0px;padding:0px;">

    <threadPostModal :show="showModal" @close="showModal = false" :board="boardSlug"></threadPostModal>

    <h1 v-if="errorCode" style="margin-top:50px;width:100%;text-align:center;">ERROR {{ errorCode }}</h1>

    <div v-else-if="board">
      <!-- Board Header -->
      <v-layout row wrap>
        <v-flex xs12>
          <v-parallax :src="board.image.location" style="height:175px;">
            <v-layout column align-center justify-center >
              <h3 class="white--text" style="text-align:center;background:rgba(0,0,0,0.6);padding:2px;">
                {{ board.name }}
              </h3>
            </v-layout>
          </v-parallax>
        </v-flex>
      </v-layout>

      <!-- Board's threads -->
      <v-tabs id="tabContainer" dark grow centered v-model="activeTab">
        <!-- Tabs control  -->
        <v-tabs-bar slot="activators" class="cyan">
          <v-tabs-slider class="orange"></v-tabs-slider>
          <v-tabs-item href="#popular">Popular</v-tabs-item>
          <v-tabs-item href="#new">Nuevo</v-tabs-item>
          <v-tabs-item href="#search">Buscar</v-tabs-item>
          <v-tabs-item href="#rules">Reglas</v-tabs-item>
        </v-tabs-bar>

        <!-- Popular -->
        <v-tabs-content id="popular">
          <!-- Loading Div -->
          <div v-if="loadingHot" style="text-align:center;margin-top:30px;width:100%;">
            <v-progress-circular indeterminate v-bind:size="100" class="cyan--text"></v-progress-circular>
            <h4>Cargando...</h4>
          </div>
          <!-- Error Div -->
          <div v-if="errorHot" style="text-align:center;margin-top:30px;">
            <h4>ERROR {{ errorHot }}</h4>
          </div>
          <!-- No Content Message -->
          <div v-if="hotOnDisplay.length === 0" style="text-align:center;margin-top:30px;">
            <h4>NO HAY CONTENIDO</h4>
          </div>
          <!-- HOT thread container -->
          <div style="margin-left:4%;margin-right:3%">
            <v-container fluid grid-list-md>
              <v-layout row wrap align-center child-flex-sm>
                <v-flex xs4-12 v-for="thread in hotOnDisplay" :key="thread._id">
                  <router-link style="text-decoration:none;" :to="{ name: 'thread', params: {id:thread._id} }">
                    <v-card :id="thread._id"
                    style="margin:5px;min-width:250px;max-width:300px;height:auto;">
                      <!-- Media -->
                      <v-card-media v-if="thread.media && thread.media.thumbnail" :src="thread.media.thumbnail" height="200px">
                        <v-container fill-height fluid style="padding:10px;">
                          <v-layout fill-height>
                            <v-flex xs12 align-end flexbox>
                              <v-spacer></v-spacer>
                              <span class="white--text" style="background:rgba(0,0,0,0.6);padding:5px;">
                                <b>{{ thread.media.mimetype }}</b>
                              </span>
                            </v-flex>
                          </v-layout>
                        </v-container>
                      </v-card-media>
                      <v-card-text style="margin-left:0px;padding:0px;">
                        <v-container fluid>
                          <v-layout row>
                            <v-flex xs12>
                              <h5 style="margin-top:0px;margin-bottom:5px;"><b>{{ thread.title }}</b></h5>
                            </v-flex>
                          </v-layout>
                          <v-layout row>
                            <v-flex xs12>
                              <p style="margin-top:0px;margin-bottom:10px;font-size:85%;">
                                {{ thread.text }}
                              </p>
                            </v-flex>
                          </v-layout>
                          <v-divider style="margin-top:0px;margin-bottom:10px;"></v-divider>
                          <v-layout row>
                            <v-flex xs7>
                              <span class="grey--text" style="font-size:85%;"> >> {{ thread.poster.name }}</span>
                            </v-flex>
                            <v-flex xs5 class="text-xs-right">
                              <span class="grey--text" style="margin-right:12px;font-size:85%;">{{ thread.created_at }}</span>
                            </v-flex>
                          </v-layout>
                          <v-divider style="margin-top:5px;margin-bottom:5px;"></v-divider>
                          <v-layout row>
                            <v-flex xs12 class="text-xs-right">
                              <v-chip outline class="blue blue--text">
                                <v-icon style="margin-right:5px;">question_answer</v-icon>{{ thread.reply_count }}
                              </v-chip>
                            </v-flex>
                          </v-layout>
                        </v-container>
                      </v-card-text>
                    </v-card>
                  </router-link>
                </v-flex>
              </v-layout>
            </v-container>
          </div>
        </v-tabs-content>

        <!-- New -->
        <v-tabs-content id="new">
          <!-- Loading Div -->
          <div v-if="loadingNew" style="text-align:center;margin-top:30px;width:100%;">
            <v-progress-circular indeterminate v-bind:size="100" class="cyan--text"></v-progress-circular>
            <h4>Cargando...</h4>
          </div>
          <!-- Error Div -->
          <div v-if="errorNew" style="text-align:center;margin-top:30px;">
            <h4>ERROR {{ errorNew }}</h4>
          </div>
          <!-- No Content Message -->
          <div v-if="newOnDisplay.length === 0" style="text-align:center;margin-top:30px;">
            <h4>NO HAY CONTENIDO</h4>
          </div>
          <!-- NEW threads container -->
          <div style="margin-left:4%;margin-right:3%">
            <v-container fluid grid-list-md>
              <v-layout row wrap align-center column-lg child-flex-sm>
                <v-flex xs4-12 v-for="thread in newOnDisplay" :key="thread._id">
                  <router-link style="text-decoration:none;" :to="{ name: 'thread', params: {id:thread._id} }">
                    <v-card :id="thread._id"
                    style="margin:5px;min-width:250px;max-width:300px;height:auto;">
                      <!-- Media -->
                      <v-card-media v-if="thread.media && thread.media.thumbnail" :src="thread.media.thumbnail" height="200px">
                        <v-container fill-height fluid style="padding:10px;">
                          <v-layout fill-height>
                            <v-flex xs12 align-end flexbox>
                              <v-spacer></v-spacer>
                              <span class="white--text" style="background:rgba(0,0,0,0.6);padding:5px;">
                                <b>{{ thread.media.mimetype }}</b>
                              </span>
                            </v-flex>
                          </v-layout>
                        </v-container>
                      </v-card-media>
                      <v-card-text style="margin-left:0px;padding:0px;">
                        <v-container fluid>
                          <v-layout row>
                            <v-flex xs12>
                              <h5 style="margin-top:0px;margin-bottom:5px;"><b>{{ thread.title }}</b></h5>
                            </v-flex>
                          </v-layout>
                          <v-layout row>
                            <v-flex xs12>
                              <p style="margin-top:0px;margin-bottom:10px;font-size:85%;">
                                {{ thread.text }}
                              </p>
                            </v-flex>
                          </v-layout>
                          <v-divider style="margin-top:0px;margin-bottom:10px;"></v-divider>
                          <v-layout row>
                            <v-flex xs7>
                              <span class="grey--text" style="font-size:85%;"> >> {{ thread.poster.name }}</span>
                            </v-flex>
                            <v-flex xs5 class="text-xs-right">
                              <span class="grey--text" style="margin-right:12px;font-size:85%;">{{ thread.created_at }}</span>
                            </v-flex>
                          </v-layout>
                          <v-divider style="margin-top:5px;margin-bottom:5px;"></v-divider>
                          <v-layout row>
                            <v-flex xs12 class="text-xs-right">
                              <v-chip outline class="blue blue--text">
                                <v-icon style="margin-right:5px;">question_answer</v-icon>{{ thread.reply_count }}
                              </v-chip>
                            </v-flex>
                          </v-layout>
                        </v-container>
                      </v-card-text>
                    </v-card>
                  </router-link>
                </v-flex>
              </v-layout>
            </v-container>
          </div>
        </v-tabs-content>

        <!-- Search -->
        <v-tabs-content id="search">
          <!-- Search Bar -->
          <v-layout row>
            <v-flex xs12 style="padding-left:20%;padding-right:20%;margin-bottom:10px;margin-top:5px;">
              <v-toolbar class="white" dense>
                <v-text-field v-model="searchQuery" placeholder="Titulo de Post" @keyup.enter="searchThread"
                hide-details single-line></v-text-field>
                <v-btn v-on:click="searchThread" icon>
                  <v-icon>search</v-icon>
                </v-btn>
              </v-toolbar>
            </v-flex>
          </v-layout>
          <!-- Loading Div -->
          <div v-if="searching" style="text-align:center;margin-top:30px;width:100%;">
            <v-progress-circular indeterminate v-bind:size="100" class="cyan--text"></v-progress-circular>
            <h4>Buscando...</h4>
          </div>
          <!-- Error Div -->
          <div v-if="errorSearch && !searching" style="text-align:center;margin-top:30px;">
            <h4>ERROR {{ errorSearch }}</h4>
          </div>
          <!-- Search Results -->
          <div style="margin-left:4%;margin-right:3%">
            <v-container fluid grid-list-md>
              <v-layout row wrap align-center column-lg child-flex-sm>
                <v-flex xs4-12 v-for="thread in searchedThreads" :key="thread._id">
                  <router-link style="text-decoration:none;" :to="{ name: 'thread', params: {id:thread._id} }">
                    <v-card :id="thread._id"
                    style="margin:5px;min-width:250px;max-width:300px;height:auto;">
                      <!-- Media -->
                      <v-card-media v-if="thread.media && thread.media.thumbnail" :src="thread.media.thumbnail" height="200px">
                        <v-container fill-height fluid style="padding:10px;">
                          <v-layout fill-height>
                            <v-flex xs12 align-end flexbox>
                              <v-spacer></v-spacer>
                              <span class="white--text" style="background:rgba(0,0,0,0.6);padding:5px;">
                                <b>{{ thread.media.mimetype }}</b>
                              </span>
                            </v-flex>
                          </v-layout>
                        </v-container>
                      </v-card-media>
                      <v-card-text style="margin-left:0px;padding:0px;">
                        <v-container fluid>
                          <v-layout row>
                            <v-flex xs12>
                              <h5 style="margin-top:0px;margin-bottom:5px;"><b>{{ thread.title }}</b></h5>
                            </v-flex>
                          </v-layout>
                          <v-layout row>
                            <v-flex xs12>
                              <p style="margin-top:0px;margin-bottom:10px;font-size:85%;">
                                {{ thread.text }}
                              </p>
                            </v-flex>
                          </v-layout>
                          <v-divider style="margin-top:0px;margin-bottom:10px;"></v-divider>
                          <v-layout row>
                            <v-flex xs7>
                              <span class="grey--text" style="font-size:85%;"> >> {{ thread.poster.name }}</span>
                            </v-flex>
                            <v-flex xs5 class="text-xs-right">
                              <span class="grey--text" style="margin-right:12px;font-size:85%;">{{ thread.created_at }}</span>
                            </v-flex>
                          </v-layout>
                          <v-divider style="margin-top:5px;margin-bottom:5px;"></v-divider>
                          <v-layout row>
                            <v-flex xs12 class="text-xs-right">
                              <v-chip outline class="blue blue--text">
                                <v-icon style="margin-right:5px;">question_answer</v-icon>{{ thread.reply_count }}
                              </v-chip>
                            </v-flex>
                          </v-layout>
                        </v-container>
                      </v-card-text>
                    </v-card>
                  </router-link>
                </v-flex>
              </v-layout>
            </v-container>
          </div>
        </v-tabs-content>

        <!-- Rules -->
        <v-tabs-content id="rules">
          <v-layout row wrap>
            <v-flex xs12 style="margin-top:30px;text-align:center;padding-left:20%;padding-right:20%">
              <h5>{{ board.description }}</h5>
            </v-flex>
          </v-layout>
        </v-tabs-content>
      </v-tabs>
      <!-- Post Thread Button -->
      <v-btn
      v-on:click="showModal = true"
      style="textDecoration:none;border:0;outline:none;"
      v-tooltip:top="{ html: 'Postear' }"
      class="orange"
      dark
      fixed
      bottom
      right
      fab
      >
      <v-icon>edit</v-icon>
    </v-btn>
    </div>
  </v-container>
</template>

<script>
import {standardAuthGet, parseThreads, standardAuthPost} from '../../utils/maskmob-api'
import threadPostModal from './ThreadPostModal'
const threadsToLoad = 5 // Controls how many threads are loaded per scroll
export default {
  name: 'board',
  data () {
    return {
      boardSlug: '',
      errorCode: null,
      boardImage: null,
      board: null,
      activeTab: null,
      searchQuery: '',
      // State variables
      loadingHot: false,
      loadingNew: false,
      searching: false,
      errorHot: '',
      errorNew: '',
      errorSearch: '',
      showModal: false,
      // Threads in display
      hotOnDisplay: [],
      newOnDisplay: [],
      searchedThreads: [],
      // Pre loaded threads ready for displaying
      hotThreads: [],
      newThreads: []
    }
  },
  components: {
    threadPostModal: threadPostModal
  },
  created () {
    window.addEventListener('scroll', this.handleScroll)
    this.boardSlug = this.$route.params.slug
    // Load Info
    this.getBoardInfo(this.boardSlug)
    // Load Threads
    this.getPopularThreads(this.boardSlug)
    this.getNewThreads(this.boardSlug)
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    getBoardInfo (slug) {
      this.errorCode = null
      standardAuthGet(this.$session.get('JWTOKEN'), `/board/${slug}`).then((response) => {
        if (response.status === 200) {
          this.board = response.data.doc
        } else {
          this.errorCode = response.status
        }
      }).catch((err) => {
        console.log(err)
        this.$store.commit('snackbar/push', {
          text: 'No se pudo cargar el muro'
        })
      })
    },
    getPopularThreads (slug) {
      standardAuthGet(this.$session.get('JWTOKEN'), `/thread/list/hot/${slug}`).then((response) => {
        if (response.status === 200 && response.data.success) {
          const threads = parseThreads(response.data.doc)
          this.hotThreads = threads
          this.hotOnDisplay = threads.slice(0, threadsToLoad)
        } else {
          this.errorHot = `${String(response.status)} ${response.data.error}`
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    getNewThreads (slug) {
      standardAuthGet(this.$session.get('JWTOKEN'), `/thread/list/new/${slug}`).then((response) => {
        if (response.status === 200 && response.data.success) {
          const threads = parseThreads(response.data.doc)
          this.newThreads = threads
          this.newOnDisplay = threads.slice(0, threadsToLoad)
        } else {
          this.errorNew = `${String(response.status)} ${response.data.error}`
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    searchThread () {
      this.errorSearch = null
      standardAuthPost({
        'query': this.searchQuery,
        'board_id': this.board._id }, this.$session.get('JWTOKEN'), '/thread/search').then((response) => {
          if (response.status === 200 && response.data.success) {
            if (response.data.doc instanceof Array && response.data.doc.length > 0) {
              const threads = parseThreads(response.data.doc)
              this.searchedThreads = threads
            } else {
              this.errorSearch = '0 RESULTADOS'
            }
          } else {
            this.errorSearch = `${String(response.status)} ${response.data.error}`
          }
        }).catch((err) => {
          this.errorSearch = err
        })
    },
    addThreadsToEnd () {
      switch (this.activeTab) {
        case 'popular':
          if (this.hotOnDisplay.length < this.hotThreads.length) {
            // Add remaining threads
            for (let i = this.hotOnDisplay.length, idx = i + threadsToLoad; i <= idx; i++) {
              if (idx > this.hotThreads.length) {
                break
              } else {
                this.hotOnDisplay.push(this.hotThreads[i])
              }
            }
          }
          break
        case 'new':
          if (this.newOnDisplay.length < this.newThreads.length) {
            // Add remaining threads
            for (let i = this.newOnDisplay.length, idx = i + threadsToLoad; i <= idx; i++) {
              if (idx > this.newThreads.length) {
                break
              } else {
                this.newOnDisplay.push(this.newThreads[i])
              }
            }
          }
          break
      }
    },
    handleScroll (event) {
      // Add threads when scrolling down
      if ((window.innerHeight + window.pageYOffset) >= (document.body.scrollHeight * 0.90)) {
        const lastPos = window.scrollY
        this.addThreadsToEnd()
        window.scrollTo(0, lastPos)
      }
    }
  }
}
</script>

<style scoped></style>
