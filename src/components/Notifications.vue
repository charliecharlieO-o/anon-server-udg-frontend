<template>
  <div id="notificationsMain">
    <!-- Loading div -->
    <v-layout v-if="loading" row style="height:100vh;">
      <v-flex xs12 style="text-align:center;margin-top:100px;">
        <v-progress-circular indeterminate v-bind:size="100" class="blue--text">
        </v-progress-circular>
        <h5>Cargando...</h5>
      </v-flex>
    </v-layout>
    <v-container v-else fluid style="padding:16px;">
      <!-- Today Header -->
      <v-layout row wrap>
        <v-flex xs12 class="text-xs-left">
          <h4 style="margin-bottom:2px;">Ultimas 24hrs <v-icon medium>watch_later</v-icon></h4>
        </v-flex>
      </v-layout>
      <!-- Today's Notifications -->
      <v-layout row wrap>
        <v-flex xs12>
          <v-card>
            <v-list two-line>
              <v-list-tile>
                <v-container>
                  <v-layout row>
                    <v-flex xs12>
                      <h6>New Thread Reply</h6>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs12>
                      <p>AlmaKaren replied to yout thread</p>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-list-tile>
              <v-divider></v-divider>
              <v-list-tile>
                Something
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
      <br />
      <br />
      <!-- Older Header -->
      <v-layout row wrap>
        <v-flex xs12 class="text-xs-left">
          <h4 style="margin-bottom:2px;">Anteriores <v-icon medium>today</v-icon></h4>
        </v-flex>
      </v-layout>
      <!-- Older Notifications -->
      <v-layout row wrap>
        <v-flex xs12>
          <v-card>
            <v-list two-line>
              <v-list-tile>
                Something
              </v-list-tile>
              <v-divider></v-divider>
              <v-list-tile>
                Something
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'notifications'
}
</script>

<style></style>
