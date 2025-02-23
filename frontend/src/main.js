import { createApp } from 'vue';
import App from './App.vue'; // Import the main App component
import router from './router'; // Import the router
import store from './store'; // Import Vuex store

import { Quasar } from 'quasar';
import quasarUserOptions from './quasar-user-options'; // Quasar options for configuration

// Create Vue application instance
const app = createApp(App);

app.use(Quasar, quasarUserOptions) // Use Quasar with custom options
   .use(router) // Use the router
   .use(store)  // Use Vuex store for state management
   .mount('#q-app'); // Mount app to the div with id="q-app" in index.html
