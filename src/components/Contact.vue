<template>
  <v-card flat id="contactComponent">
    <v-container fluid class="contact-container">
      <v-layout row-sm column child-flex-sm>
        <v-flex xs3>
          <v-list-tile-avatar class="avatar-box">
            <img src="/static/thumbnail.jpg" class="profile-picture" />
            <h5 class="username">Username</h5>
          </v-list-tile-avatar>
        </v-flex>
        <v-flex xs9 class="button-box">
          <div v-if="isfriend">
            <v-btn round error dark>eliminar<v-icon right>remove_circle_outline</v-icon></v-btn>
            <v-btn round warning dark>bloquear<v-icon right>not_interested</v-icon></v-btn>
          </div>
          <div v-else>
            <v-btn round success dark>aceptar<v-icon right>check</v-icon></v-btn>
            <v-btn round error dark>negar<v-icon right>not_interested</v-icon></v-btn>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: 'contactComponent',
  template: '#contentComponent',
  props: ['contact', 'isfriend'],
  data () {
    return {
      contactObj: null,
      isfriend: true
    }
  },
  created () {
    this.isfriend = this.$props['isfirend'] === 'true'
  },
  methods: {
    // Methods will be listed here
  }
}
</script>

<style scoped>
.avatar-box {
  margin: 0px;
  padding: 0px;
}
.profile-picture {
  margin: 0px;
  padding: 0px;
  min-height: 50px;
  min-width: 50px;
  background-color:grey;
}
.contact-container {
  padding: 10px;
}
.username {
  margin: 10px;
}
.button-box {
  text-align:right;
}
</style>
