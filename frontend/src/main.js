import { createApp } from 'vue';
import App from './App.vue'; // Import the main App component
import router from './router'; // Import the router

import { Quasar } from 'quasar';
import quasarUserOptions from './quasar-user-options'; // Quasar options for configuration

// Create Vue application instance
createApp(App)
  .use(Quasar, quasarUserOptions) // Use Quasar with custom options
  .use(router) // Use the router
  .mount('#q-app'); // Mount app to the div with id="q-app" in index.html
