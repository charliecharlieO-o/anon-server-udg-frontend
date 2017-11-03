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
              src="/static/hydeegg.jpg" class="profile-thumbnail">
            <img v-else-if="comment.poster.anon"
              src="/static/incognito.jpg" class="profile-thumbnail">
            <router-link v-else :to="`/profile/${comment.poster.poster_id}`" style="textDecoration:none;">
              <img :src="comment.poster.poster_thumbnail" class="profile-thumbnail">
            </router-link>
          </v-flex>
          <!-- Comment Data -->
          <v-flex xs10 class="comment-data-dontainer">
            <!-- Header Info -->
            <v-layout row class="user-header">
              <span v-if="comment.poster.anon && comment.poster.poster_name === 'Dr.Jekyll'"
                class="username-span-easteregg">Mr.Hyde</span>
              <span v-else-if="comment.poster.anon" class="username-span-anon">{{ comment.poster.poster_name }} [anon]</span>
              <router-link v-else :to="`/profile/${comment.poster.poster_id}`" style="textDecoration:none;">
                <span class="username-span">{{ comment.poster.poster_name }}</span>
              </router-link>
              <span class="replied-span">replied</span>
              <span class="white grey--text" style="margin-left:5px">{{ comment.created_at }}</span>
            </v-layout>
            <!-- Comment text content -->
            <p :id="`p${comment._id}`" class="text-xs-left default-p">{{ comment.text }}</p>
            <!-- Comment thumbnail content -->
          </v-flex>
          <!-- Reply Button -->
          <v-flex xs1-2>
            <v-btn icon v-on:click="showModal = true" v-tooltip:top="{ html: 'responder' }" style="margin-top:0px;">
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
            src="/static/hydeegg.jpg" class="profile-thumbnail">
          <img v-else-if="reply.poster.anon"
            src="/static/incognito.jpg" class="profile-thumbnail">
          <img v-else :src="reply.poster.poster_thumbnail" class="profile-thumbnail">
        </v-flex>
        <!-- Comment Data -->
        <v-flex xs11>
          <!-- Header Info -->
          <v-layout row class="user-header">
            <!-- USERNAME -->
            <span v-if="reply.poster.anon && reply.poster.poster_name === 'Dr.Jekyll'"
              class="username-span-easteregg">Mr.Hyde</span>
            <span v-else-if="reply.poster.anon" class="username-span-anon">{{ reply.poster.poster_name }} [anon]</span>
            <span v-else class="username-span">{{ reply.poster.poster_name }}</span>
            <!-- ACTION -->
            <span class="replied-span">replied</span>
            <span v-if="comment.poster.poster_id !== reply.poster.poster_id">to {{ reply.to.poster_name }}</span>
            <!-- TIME -->
            <span class="white grey--text" style="margin-left:5px">{{ reply.created_at }}</span>
          </v-layout>
          <!-- Comment text content -->
          <v-layout row>
            <p :id="`p${reply._id}`" class="text-xs-left default-p">{{ reply.text }}</p>
          </v-layout>
          <!-- Comment thumbnail content -->
        </v-flex>
        <!-- Reply Button -->
        <v-flex xs1-2>
          <div v-if="userObj._id !== reply.poster.poster_id && userObj.alias.anonId !== reply.poster.poster_id">
            <v-btn icon v-on:click="subreplyId = reply._id;showModal = true" v-tooltip:top="{ html: 'responder' }" style="margin-top:0px;">
              <v-icon>reply</v-icon>
            </v-btn>
          </div>
        </v-flex>
      </v-layout>

      <div v-if="comment.replies.length > 2" name="seeMore">
        <v-divider></v-divider>
        <v-layout row style="padding:5px;">
          <v-flex v-if="!onWatch" xs12 style="text-align:left;">
            <span class="link-sim" v-on:click="loadMissingComments">+ COMENTARIOS ({{ comment.replies.length - repliesOnDisplay.length }})</span>
          </v-flex>
          <v-flex v-else xs12 style="text-align:left;">
            <span class="link-sim" v-on:click="stopWatching">CERRAR (x)</span><i class="awaiting">esperando comentarios...</i>
          </v-flex>
        </v-layout>
      </div>
    </div>
  </v-container>
</template>

<script>
import {parseComment} from '../../utils/maskmob-api'
import commentPostModal from './CommentModal'
import * as moment from 'moment'
export default {
  props: ['commentObj'],
  components: {
    commentPostModal: commentPostModal
  },
  data () {
    return {
      comment: null,
      repliesOnDisplay: [],
      toReply: null,
      showModal: false,
      userObj: null,
      onWatch: false,
      subreplyId: null
    }
  },
  created () {
    this.userObj = this.$session.get('USER')
    this.loadCommentContent()
  },
  methods: {
    loadCommentContent () {
      // Parse comment
      this.comment = parseComment(this.$props['commentObj'])
      // Load first 2 subreplies
      this.repliesOnDisplay = this.comment.replies.slice(0, 1)
      for (let x in this.repliesOnDisplay) {
        this.repliesOnDisplay[x] = parseComment(this.repliesOnDisplay[x])
      }
    },
    loadMissingComments () {
      const idx = this.repliesOnDisplay.length
      const end = this.comment.replies.length
      let missingReplies = this.comment.replies.slice(idx, end)
      for (let x in missingReplies) {
        missingReplies[x] = parseComment(missingReplies[x])
      }
      this.repliesOnDisplay.push.apply(this.repliesOnDisplay, missingReplies)
      this.onWatch = true
    },
    addComment (comment) {
      // Open comments if not openned
      this.loadMissingComments()
      // Add comment to newComments array
      comment.created_at = moment().toISOString()
      this.repliesOnDisplay.push(parseComment(comment))
      // Delete  subreplyId in case it was an answer
      this.subreplyId = null
      // Scroll to comment asynchronously
      // this.$nextTick(() => document.getElementById(`s${comment._id}`).scrollIntoView())
    },
    stopWatching () {
      this.onWatch = false
      this.repliesOnDisplay.length = 2
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

.awaiting {
  margin:2px;
  margin-left:0px;
}
</style>
