<template>
  <div id="infoMain">
    <v-container fluid style="padding:16px;">
      <h4>Preguntas Frecuentes</h4>
      <v-expansion-panel>
        <!-- Part of UdeG? -->
        <v-expansion-panel-content>
          <div slot="header">NetSlap <b>forma parte de la UdeG?</b></div>
          <v-card>
            <v-card-text class="grey lighten-3">
              <b>NO</b>, este sitio no forma parte ni esta relacionado a la Universidad de Guadalajara.
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <!-- Informacion y Privacidad -->
        <v-expansion-panel-content>
          <div slot="header">NetSlap <b>almacena mi informacion?</b></div>
          <v-card>
            <v-card-text class="grey lighten-3">
              NetSlap <b>NO</b> almacena tu informacion ni hace uso de cookies de terceros por el momento
              aunque esto podria cambiar en un futuro para financiar el sitio si el crecimiento del mismo se hace
              insostenible.
              <br /><br />
              NetSlap <b>SI</b> almacenara los vinculos a tus redes sociales si los proporcionas y cualquier
              dato que compartas publicamente al sitio. <b>NO</b> nos hacemos responsables de lo que publiques
              o desees compartir.
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <!-- SSL -->
        <v-expansion-panel-content>
          <div slot="header">NetSlap aparece como no seguro <b>candado rojo</b></div>
          <v-card>
            <v-card-text class="grey lighten-3">
              NetSlap encripta <b>TODA</b> la informacion de la comunicacion entre tu maquina y las nuestras con
              SSL. Independientemente del icono.
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <!-- SIIAU -->
        <v-expansion-panel-content>
          <div slot="header">NetSlap <b>almacena mi NIP o datos de SIIAU?</b></b></div>
          <v-card>
            <v-card-text class="grey lighten-3">
              <b>NO</b>. NetSlap verifica tus datos con la base de datos de la universidad
              para aceptar o rechazar tu solicitud de ingreso, sin embargo, los datos personales y tu
              password son deshechados por el sistema y tu NIP es <i><u>hasheada</u></i> para evitar que
              otros usuarios la utilizen.
              <br /><br />
              El proceso de hashing es irreversible y se ve de la siguiente manera:<br />
              <ul>
                <li>
                  NIP: <u>1234567</u>
                </li>
                <li>
                  HASH: <u>7110eda4d09e062aa5e4a390</u> (Esto se almacena)
                </li>
              </ul>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <!-- Banning -->
        <v-expansion-panel-content>
          <div slot="header">Que pasa si soy <b>'BANEADO'?</b></div>
          <v-card>
            <v-card-text class="grey lighten-3">
              Existen <i>dos tipos</i> de banning, uno es temporal y el otro es <b>permanente</b>, si tu cuenta
              ha sido suspendida temporalmente el sistema te notificara la fecha de desbloqueo de tu cuenta
              despues de la cual podras usar el sitio de manera normal.
              <br /><br />
              <b><u>NO REINCIDAS EN LA CONDUCTA O SERAS PERMANENTEMENTE SUSPENDIDO</u></b>
              <br /><br />
              Una vez que tu cuenta ha sido permanentemente supsendida, no hay vuelta atras; no podras apelar
              o recuperar tu cuenta de ninguna manera.
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <!-- Anonimity -->
        <v-expansion-panel-content>
          <div slot="header">Puedo ser <b>realmente anonimo?</b></div>
          <v-card>
            <v-card-text class="grey lighten-3">
              <b>
                Si...y no</b>, NetSlap tiene medidas para mantener tu informacion fuera del alcanze de personas
                a las cuales no has brindado acceso (incluso admins); el subsistema de posting anonimo, o
                <i>modo incognito</i>, por ejemplo deslinda la informacion de tu cuenta principal de los posts
                y comentarios que realizes, apareciendo asi un perfil en blanco para tanto admins como usuarios.
                <br /><br />
                Sin embargo si tu haces mal uso del sistema en algo que involucre la ley, nos reservamos el derecho
                a cooperar.
                <br />
                <i>La mejor manera de proteger tu identidad <b>es no dandola!</b></i>
              </section>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <!-- File Support -->
        <v-expansion-panel-content>
          <div slot="header">Que <b>tipos de archivo</b> soporta NetSlap?</div>
          <v-card>
            <v-card-text class="grey lighten-3">
              NetSlap te permite postear:
              <ul>
                <li>JPEG</li>
                <li>PNG</li>
                <li>GIF</li>
                <li>WEBM</li>
                <li>MP4</li>
                <li>MP3</li>
                <li>PDF</li>
              </ul>
              <br />
              <b><u><i>NO PUEDES SUBIR ARCHIVOS DE MAS DE 8 MEGABYTES</i></u></b>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <!-- GIFS -->
        <v-expansion-panel-content>
          <div slot="header">Donde puedo encontrar <b>GIF's?</b></div>
          <v-card>
            <v-card-text class="grey lighten-3">
              Puedes encontrar una gran variedad de GIF's en este <a target="_blank" href="http://giphy.com">link</a>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <!-- WEBMS & MP4S -->
        <v-expansion-panel-content>
          <div slot="header">Donde puedo encontrar <b>Videos?</b></div>
          <v-card>
            <v-card-text class="grey lighten-3">
              Puedes encontrar una gran variedad de Videos en este <a target="_blank" href="https://funnyjunk.com">link</a>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <!-- WebDesign -->
        <v-expansion-panel-content>
          <div slot=header>Siento que le <b>faltan cosas al sitio...</b></div>
          <v-card>
            <v-card-text class="grey lighten-3">
              Estoy de acuerdo contigo si tienes esta opinion, ya que considero que el desarrollo de este sitio fue algo
              precipitado de mi parte y un ejercicio para aprender y crecer como desarrollador fullstack. El desarrollo no
              tomo mas de 3 meses y solo yo trabaje en el 95% del codigo lo cual no me permitio incluir todo lo que en un inicio
              yo pensaba. Estoy atento a cualquier sugerencia por medio de los canales oficiales.
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <!-- Likes -->
        <v-expansion-panel-content>
          <div slot=header>Por que no hay <b>likes?</b></div>
          <v-card>
            <v-card-text class="grey lighten-3">
              La ausencia de likes es deliberada, el algoritmo de popularidad utiliza <i>otros metodos</i> para determinar que posts
              son los mas controversiales/populares. Esto remueve el <i>bias</i> de pensamiento homogeneo evitando que se cree una camara
              de echo ideologica o de opinion.
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'info'
}
</script>

<style></style>
