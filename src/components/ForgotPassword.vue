<template>
  <v-container fluid>
    <v-layout row wrap justify-center>
      <v-flex xs12 xl4 lg4 md4>
        <v-card>
          <v-card-text>
            <v-text-field
              label="email"
              v-model="email"
              type="password"/>
            <div class="submit-container">
              <v-btn primary large> Enviar Codigo </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      email: ''
    }
  }
}
</script>

<style scoped></style>
