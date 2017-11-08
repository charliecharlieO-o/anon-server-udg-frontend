<template>
  <div id="rulesMain">
    <v-layout row style="margin-top:35px;">
      <v-flex xs12 style="text-align:center;">
        <img src="../assets/darules.png" />
        <div style="padding:10px;">
          <p class="paragraph">
            <b>ATENCION</b> el infringir en cualquiera de las siguientes acciones
            es causa de supsension total o parcial de tu cuenta.
          </p>
          <ul style="text-align:justify;margin-left:10%;margin-bottom:5%;margin-top:5%;">
            <li>
              NO publicaras, subiras, discutiras, pediras o haras link a nada que viole
              las leyes de los Estados Unidos.
            </li>
            <li>
              NO pornografia infantil o considerada ilegal en USA.
            </li>
            <li>
              NO se permite venta de drogas o narcoticos ilegales.
            </li>
            <li>
              NO se permiten amenazas a la integridad fisica de otra persona.
            </li>
            <li>
              NO hagas spam
            </li>
          </ul>
          <p>
            A excepcion de los casos ya mencionados, eres libre de publicar, hablar y discutir
            <b>lo que sea</b>.
          </p>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: 'rules'
}
</script>

<style scoped>
.paragraph {
  margin-top: 20px;
}
</style>
