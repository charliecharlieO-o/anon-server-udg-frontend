
# Components
## Snackbar

Example without links:
``` js
this.$store.commit('snackbar/push', {
  text: 'Hey, I am a snackbar'
})
```

Example push event with `vue-router`:
``` js
this.$store.commit('snackbar/push', {
  text: 'Registrate',
  router: { name: 'signup' },
})
```

Example redirect to `google.com`:
``` js
this.$store.commit('snackbar/push', {
  text: 'Open google',
  url: 'https://google.com'
})
```
