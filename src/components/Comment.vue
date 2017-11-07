<template>
  <v-container fluid style="margin:0px;padding:0px;">
    <!-- Comment Modal -->
    <commentPostModal :show="showModal" @close="showModal = false" :thread="comment.thread" :reply="comment._id"
      :subreply="subreplyId" @posted="addComment"></commentPostModal>
    <!-- Commnent First Level -->
    <v-card flat>
      <v-container fluid class="comment-container">
        <v-layout row>
          <!-- User Defined Space -->
          <v-flex xs1-2 class="thumbnail-container">
            <img v-if="comment.poster.anon && comment.poster.poster_name === 'Dr.Jekyll'"
              src="../assets/hydeegg.jpg" class="profile-thumbnail">
            <img v-else-if="comment.poster.anon"
              src="../assets/incognito.jpg" class="profile-thumbnail">
            <router-link v-else-if="comment.poster.poster_thumbnail" :to="`/profile/${comment.poster.poster_id}`" style="textDecoration:none;">
              <img :src="comment.poster.poster_thumbnail" class="profile-thumbnail">
            </router-link>
            <router-link v-else :to="`/profile/${comment.poster.poster_id}`" style="textDecoration:none;">
              <img src="../assets/defuser.png" class="profile-thumbnail">
            </router-link>
          </v-flex>
          <!-- Comment Data -->
          <v-flex xs8 md10 lg10 xl10 class="comment-data-dontainer">
            <!-- Header Info -->
            <v-layout row class="user-header">
              <span v-if="comment.poster.anon && comment.poster.poster_name === 'Dr.Jekyll'"
                class="username-span-easteregg">Mr.Hyde</span>
              <span v-else-if="comment.poster.anon" class="username-span-anon">{{ comment.poster.poster_name }} [anon]</span>
              <router-link v-else :to="`/profile/${comment.poster.poster_id}`" style="textDecoration:none;">
                <span class="username-span">{{ comment.poster.poster_name }}</span>
              </router-link>
              <span class="replied-span hidden-sm-and-down">replied</span>
              <span class="white grey--text" style="margin-left:1%">{{ comment.momentTime }}</span>
            </v-layout>
            <!-- Comment text content -->
            <paragraph v-if="comment.text" :text="comment.text"></paragraph>
            <!-- Comment media content -->
            <media :media="comment.media" :text="comment.text"></media>
          </v-flex>
          <!-- Reply Button -->
          <v-flex xs1-2>
            <v-btn icon v-on:click="openReplyModal" v-tooltip:top="{ html: 'responder' }" style="margin-top:0px;">
              <v-icon>reply</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
      </v-container>
    </v-card>
    <!-- Reply Box Second Level -->
    <div class="reply-box">
      <v-layout v-for="reply in repliesOnDisplay" :key="comment._id" :id="`s${comment._id}`" row class="subreply-row">
        <!-- Spacer -->
        <v-flex xs1></v-flex>
        <!-- User Defined Space -->
        <v-flex xs1-2 style="text-align:left;">
          <img v-if="reply.poster.anon && reply.poster.poster_name === 'Dr.Jekyll'"
            src="../assets/hydeegg.jpg" class="profile-thumbnail">
          <img v-else-if="reply.poster.anon"
            src="../assets/incognito.jpg" class="profile-thumbnail">
          <router-link v-else-if="reply.poster.poster_thumbnail" :to="`/profile/${reply.poster.poster_id}`" style="textDecoration:none;">
            <img :src="reply.poster.poster_thumbnail" class="profile-thumbnail">
          </router-link>
          <router-link v-else :to="`/profile/${reply.poster.poster_id}`" style="textDecoration:none;">
            <img src="../assets/defuser.png" class="profile-thumbnail">
          </router-link>
        </v-flex>
        <!-- Comment Data -->
        <v-flex xs8 md10 lg10 xl10 class="comment-data-dontainer">
          <!-- Header Info -->
          <v-layout row class="user-header">
            <span v-if="reply.poster.anon && reply.poster.poster_name === 'Dr.Jekyll'"
              class="username-span-easteregg">Mr.Hyde</span>
            <span v-else-if="reply.poster.anon" class="username-span-anon">{{ reply.poster.poster_name }} [anon]</span>
            <router-link v-else :to="`/profile/${reply.poster.poster_id}`" style="textDecoration:none;">
              <span class="username-span">{{ reply.poster.poster_name }}</span>
            </router-link>
            <!-- ACTION -->
            <span class="replied-span hidden-sm-and-down">replied</span>
            <div name="respondedTo" v-if="reply.poster.poster_id !== comment.poster.poster_id">
              <span class="hidden-sm-and-down" >to</span>
              <span class="hidden-sm-and-up">→</span>
              <span>{{ reply.to.poster_name }}</span>
            </div>
            <!-- TIME -->
            <span class="white grey--text" style="margin-left:1%">{{ reply.momentTime }}</span>
          </v-layout>
          <!-- reply text content -->
          <paragraph v-if="reply.text" :text="reply.text"></paragraph>
          <!-- Comment media content -->
          <media :media="reply.media" :text="reply.text"></media>
        </v-flex>
        <!-- Reply Button -->
        <v-flex xs1-2>
          <div v-if="userObj._id !== reply.poster.poster_id && userObj.alias.anonId !== reply.poster.poster_id">
            <v-btn icon v-on:click="subreplyId = reply._id;openReplyModal()" v-tooltip:top="{ html: 'responder' }" style="margin-top:0px;">
              <v-icon>reply</v-icon>
            </v-btn>
          </div>
        </v-flex>
      </v-layout>

      <div v-if="comment.replies.length >= 2" name="seeMore">
        <v-divider></v-divider>
        <v-layout row style="padding:5px;">
          <v-flex v-if="!onWatch" xs12 style="text-align:left;">
            <span class="link-sim" v-on:click="checkForNewComments();listenToReplies()">+COMENTARIOS ({{ comment.replies.length - repliesOnDisplay.length }}) - auto</span>
          </v-flex>
          <v-flex v-else xs12 style="text-align:left;">
            <span class="link-sim" v-on:click="stopListening();stopWatching()">CERRAR (x)</span><i class="awaiting">en escucha...</i>
          </v-flex>
        </v-layout>
      </div>
      <div v-else>
        <v-divider></v-divider>
        <v-layout row style="padding:5px;">
          <v-flex v-if="comment.replies.length <= 2" xs12 style="text-align:left">
            <span class="link-sim" v-on:click="checkForNewComments(true)">REFRESCAR COMENTARIOS</span>
          </v-flex>
        </v-layout>
      </div>
      <div v-if="maxRepliesReached">
        <v-layout row style="padding:5px;">
          <v-flex xs12 style="text-align:left">
            <span class="link-error">MAX DE COMENTARIOS</span>
          </v-flex>
        </v-layout>
      </div>
    </div>
  </v-container>
</template>

<script>
import {parseComment, standardAuthGet} from '../../utils/maskmob-api'
import commentPostModal from './CommentModal'
import mediaComp from './Media'
import paragraph from './Paragraph'
// import * as moment from 'moment'
export default {
  props: ['commentObj'],
  components: {
    commentPostModal: commentPostModal,
    media: mediaComp,
    paragraph: paragraph
  },
  data () {
    return {
      comment: null,
      repliesOnDisplay: [],
      toReply: null,
      showModal: false,
      userObj: null,
      onWatch: false,
      subreplyId: null,
      // Timing data
      timerInterval: null
    }
  },
  computed: {
    maxRepliesReached () {
      return this.comment.replies.length >= 60
    }
  },
  created () {
    this.userObj = this.$session.get('USER')
    this.loadCommentContent()
  },
  beforeDestroy () {
    clearInterval(this.timerInterval)
  },
  methods: {
    loadCommentContent () {
      // Parse comment
      this.comment = parseComment(this.$props['commentObj'])
      // Parse comments
      for (let x in this.comment.replies) {
        this.comment.replies[x] = parseComment(this.comment.replies[x])
      }
      // Load first 2 subreplies
      this.repliesOnDisplay = this.comment.replies.slice(0, 2)
    },
    loadMissingComments () {
      const idx = this.repliesOnDisplay.length
      let missingReplies = this.comment.replies.slice(idx)
      this.repliesOnDisplay.push.apply(this.repliesOnDisplay, missingReplies)
      this.onWatch = true
    },
    openReplyModal () {
      if (this.comment.replies.length >= 65) {
        this.$store.commit('snackbar/push', {
          text: 'max de subcomentarios superado'
        })
      } else {
        this.showModal = true
      }
    },
    async addComment (comment) {
      // Open comments if not openned
      this.loadMissingComments()
      // Load new comments (includes user's new comment)
      await this.checkForNewComments()
    },
    stopWatching () {
      this.onWatch = false
      this.repliesOnDisplay.length = 2
    },
    stopListening () {
      clearInterval(this.timerInterval)
    },
    async checkForNewComments (verbose) {
      try {
        // Get last time the comment was updated
        const timeres = await standardAuthGet(this.$session.get('JWTOKEN'), `/thread/replies/${this.comment._id}/get-last-update`)
        if (timeres.status !== 200) {
          return
        }
        const dt1 = new Date(timeres.data.doc)
        const dt2 = new Date(this.comment.updated_at)
        // If comment hasnt been updated exit
        if (dt1.getTime() > dt2.getTime()) {
          this.comment.updated_at = timeres.data.doc
          this.loadMissingComments()
        } else if (verbose) {
          this.$store.commit('snackbar/push', {
            text: 'No hay mas comentarios'
          })
          return
        }
        const response = await standardAuthGet(this.$session.get('JWTOKEN'), `/thread/replies/${this.comment._id}/`)
        if (response.status === 200 && response.data.success) {
          const comment = response.data.doc
          const localLength = this.comment.replies.length
          if (comment.replies && comment.replies.length > 0 && comment.replies.length > localLength) {
            let newReplies = comment.replies.slice(localLength)
            // Parse comments
            for (let x in newReplies) {
              newReplies[x] = parseComment(newReplies[x])
            }
            this.comment.replies.push.apply(this.comment.replies, newReplies)
          }
          this.loadMissingComments()
        } else {
          this.$store.commit('snackbar/push', {
            text: 'No existe el contenido'
          })
        }
      } catch (err) {
        console.log(err)
        this.$store.commit('snackbar/push', {
          text: 'Revisa tu conexion'
        })
      }
    },
    listenToReplies () {
      this.timerInterval = setInterval(() => {
        this.checkForNewComments()
      }, 18000)
    }
  }
}
</script>

<style>
.profile-thumbnail {
  max-width:35px;
  margin:10px;
  margin-right:5px;
  padding-top:4px;
  margin-top:0px;
  max-height:50px;
}
.username-span-easteregg {
  color:DarkRed;
  margin-right:5px;
}
.username-span-anon {
  color:purple;
  margin-right:5px;
}
.username-span {
  color:DarkBlue;
  margin-right:5px;
}
.replied-span {
  margin-right:5px;
  margin-left:5px;
}
.default-p {
  line-height: 110%;
  font-size:115%;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.reply-box {
  background-color:#FFFFFF;
  margin-bottom:5px;
}
.comment-container {
  padding:0px;
  margin:0px;
  padding-top:10px;
}
.thumbnail-container {
  text-align:left;
  margin-right:0px;
  padding-right:0px;
}
.comment-data-dontainer {
  margin-left:0px;
  padding-left:0px;
}
.user-header {
  margin-bottom:3px;
}
.subreply-row {
  padding-top:10px;
}

.link-sim {
  color: #0645AD;
  margin:2%;
  cursor: pointer;
}

.link-error {
  color: red;
  margin:2%;
}

.awaiting {
  margin:2px;
  margin-left:0px;
}
</style>
