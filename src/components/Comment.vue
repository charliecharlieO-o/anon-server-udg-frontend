<template>
  <v-container fluid id="commentComponent" style="margin:0px;padding:0px;">
    <!-- Comment Modal -->
    <commentPostModal :show="showModal" @close="showModal = false" :thread="comment.thread" :reply="comment._id"></commentPostModal>
    <!-- Commnent -->
    <v-card flat>
      <v-container fluid style="padding:0px;margin:0px;padding-top:10px;">
        <v-layout row>
          <!-- User Defined Space -->
          <v-flex xs1-2 style="text-align:left;margin-right:0px;padding-right:0px;">
            <img v-if="comment.poster.anon && comment.poster.poster_name === 'Dr.Jekyll'"
              src="/static/hydeegg.jpg" class="profile-thumbnail">
            <img v-else-if="comment.poster.anon"
              src="/static/incognito.jpg" class="profile-thumbnail">
            <router-link v-else :to="`/profile/${comment.poster.poster_id}`" style="textDecoration:none;">
              <img :src="comment.poster.poster_thumbnail" class="profile-thumbnail">
            </router-link>
          </v-flex>
          <!-- Comment Data -->
          <v-flex xs10 style="margin-left:0px;padding-left:0px;">
            <!-- Header Info -->
            <v-layout row style="margin-bottom:3px;">
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
    <!-- Reply Box -->
    <div class="reply-box">
      <v-layout v-for="comment in repliesOnDisplay" :key="comment._id" :id="comment._id" row style="padding-top:10px;">
        <v-flex xs1></v-flex><!-- Spacer -->
        <!-- User Defined Space -->
        <v-flex xs1-2 style="text-align:left;">
          <img v-if="comment.poster.anon && comment.poster.poster_name === 'Dr.Jekyll'"
            src="/static/hydeegg.jpg" class="profile-thumbnail">
          <img v-else-if="comment.poster.anon"
            src="/static/incognito.jpg" class="profile-thumbnail">
          <img v-else :src="comment.poster.poster_thumbnail" class="profile-thumbnail">
        </v-flex>
        <!-- Comment Data -->
        <v-flex xs11>
          <!-- Header Info -->
          <v-layout row style="margin-bottom:3px;">
            <span v-if="comment.poster.anon && comment.poster.poster_name === 'Dr.Jekyll'"
              class="username-span-easteregg">Mr.Hyde</span>
            <span v-else-if="comment.poster.anon" class="username-span-anon">{{ comment.poster.poster_name }} [anon]</span>
            <span v-else class="username-span">{{ comment.poster.poster_name }}</span>
            <span class="replied-span">replied</span>
            <span class="white grey--text" style="margin-left:5px">{{ comment.created_at }}</span>
          </v-layout>
          <!-- Comment text content -->
          <v-layout row>
            <p :id="`p${comment._id}`" class="text-xs-left default-p">{{ comment.text }}</p>
          </v-layout>
          <!-- Comment thumbnail content -->
        </v-flex>
        <!-- Reply Button -->
        <v-flex xs1-2>
          <v-btn icon v-tooltip:top="{ html: 'responder' }" style="margin-top:0px;">
            <v-icon>reply</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>

      <div v-if="comment.replies.length > 2" name="seeMore">
        <v-divider></v-divider>
        <v-layout row style="padding:5px;">
          <v-flex xs12 style="text-align:left;">
            <a style="margin:2%;">VER MAS (5)</a>
          </v-flex>
        </v-layout>
      </div>
    </div>
  </v-container>
</template>

<script>
import {parseComment} from '../../utils/maskmob-api'
import commentPostModal from './CommentModal'
export default {
  template: '#commentComponent',
  props: ['commentObj'],
  components: {
    commentPostModal: commentPostModal
  },
  data () {
    return {
      comment: null,
      repliesOnDisplay: [],
      toReply: null,
      showModal: false
    }
  },
  created () {
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
    loadSubReplies () {}
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
</style>
