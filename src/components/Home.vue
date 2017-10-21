<template>
  <div id="homeMain">
    <!-- Main Div -->
    <v-container fluid>
      <!-- Popular Stuff Div -->
      <div v-if="onDisplay === 'HOT'" id="popularStuff">
        <!-- Hot Header -->
        <v-layout row wrap>
          <v-flex xs6 class="text-xs-left">
            <h4 style="margin-bottom:2px;">Popular <v-icon medium>whatshot</v-icon></h4>
          </v-flex>
          <v-flex xs6 class="text-xs-right">
            <v-btn v-on:click="toggleDisplay" light style="margin-right:0px;"><v-icon>fast_forward</v-icon> Nuevo</v-btn>
          </v-flex>
        </v-layout>
        <v-divider style="margin-top:3px;margin-bottom:5px;"></v-divider>
        <!-- End header -->
        <!-- Loading Div -->
        <div v-if="loadingHot" style="text-align:center;margin-top:30px;">
          <v-progress-circular indeterminate v-bind:size="100" class="cyan--text"></v-progress-circular>
          <h4>Cargando...</h4>
        </div>
        <!-- Error Div -->
        <div v-if="errorHot && !loadingHot" style="text-align:center;margin-top:30px;">
          <h4>ERROR {{ errorHot }}</h4>
        </div>
        <!-- No Content Message -->
        <div v-if="hotThreads.length === 0 && !loadingHot" style="text-align:center;margin-top:30px;">
          <h4>NO HAY CONTENIDO</h4>
        </div>
        <!-- content -->
        <v-container fluid grid-list-md>
          <v-layout row wrap align-center column-lg child-flex-sm>
            <v-flex xs4-12 v-for="thread in hotThreads" :key="thread._id">
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
      <!-- New Stuff Div -->
      <div v-else id="newStuff">
        <!-- New Header -->
        <v-layout row wrap>
          <v-flex xs6 class="text-xs-left">
            <h4 style="margin-bottom:2px;">Nuevo <v-icon medium>new_releases</v-icon></h4>
          </v-flex>
          <v-flex xs6 class="text-xs-right">
            <v-btn v-on:click="toggleDisplay" light style="margin-right:0px;"><v-icon>fast_rewind</v-icon> Popular</v-btn>
          </v-flex>
        </v-layout>
        <v-divider style="margin-top:3px;margin-bottom:5px;"></v-divider>
        <!-- End header -->
        <!-- Loading Div -->
        <div v-if="loadingNew" style="text-align:center;margin-top:30px;">
          <v-progress-circular indeterminate v-bind:size="100" class="cyan--text"></v-progress-circular>
          <h4>Cargando...</h4>
        </div>
        <!-- Error Div -->
        <div v-if="errorNew && !loadingNew" style="text-align:center;margin-top:30px;">
          <h4>ERROR {{ errorNew }}</h4>
        </div>
        <!-- No Content Message -->
        <div v-if="newThreads.length === 0 && !loadingNew" style="text-align:center;margin-top:30px;">
          <h4>NO HAY CONTENIDO</h4>
        </div>
        <!-- content -->
        <v-container fluid grid-list-md>
          <v-layout row wrap align-center column-lg child-flex-sm>
            <v-flex xs4-12 v-for="thread in newThreads" :key="thread._id">
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
                          <v-icon left>question_answer</v-icon>{{ thread.reply_count }}
                        </v-chip>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
    </v-container>
    <!-- Disclaimer -->
    <v-layout row>
      <v-layout xs12 class="disclaimer">
        <h7 style="width:100%;padding:2px;">
          Solo se muestran los primeros 20
        </h7>
      </v-layout>
    </v-layout>
  </div>
</template>

<script>
  import {standardAuthGet, parseThreads} from '../../utils/maskmob-api'
  export default {
    name: 'home',
    data () {
      return {
        loadingHot: true,
        loadingNew: true,
        onDisplay: 'HOT',
        errorHot: '',
        errorNew: '',
        hotThreads: [],
        newThreads: []
      }
    },
    created () {
      // If logged in
      if (this.$session.get('JWTOKEN') != null) {
        this.loadHotThreads()
      } else {
        // Redirect to login
        this.$router.push('/login')
      }
    },
    methods: {
      toggleDisplay () {
        if (this.$data.onDisplay === 'HOT') {
          this.$data.loadingHot = true
          this.$data.onDisplay = 'NEW'
          this.loadNewThreads()
        } else {
          this.$data.loadingNew = true
          this.$data.onDisplay = 'HOT'
          this.loadHotThreads()
        }
      },
      loadHotThreads () {
        standardAuthGet(this.$session.get('JWTOKEN'), '/thread/hot-top').then((response) => {
          if (response.status === 200) {
            const threads = parseThreads(response.data.doc)
            this.$data.loadingHot = false
            this.$data.hotThreads = threads
          } else {
            this.errorHot = `${String(response.status)} ${response.data.error}`
            this.loadingHot = false
          }
        }).catch((err) => {
          console.log(err)
          this.loadingHot = false
        })
      },
      loadNewThreads () {
        standardAuthGet(this.$session.get('JWTOKEN'), '/thread/new-overall').then((response) => {
          if (response.status === 200) {
            const threads = parseThreads(response.data.doc)
            this.$data.loadingNew = false
            this.$data.newThreads = threads
          } else {
            this.errorNew = `${String(response.status)} ${response.data.error}`
            this.loadingNew = false
          }
        }).catch((err) => {
          console.log(err)
          this.loadingNew = false
        })
      }
    }
  }
</script>

<style scoped>
.disclaimer {
  text-align:center;
  margin-top:5px;
  width:100%;
  background-color:#e0e0e0;
  color:#616161;
  margin-left: 10px;
  margin-right: 10px;
}
</style>
