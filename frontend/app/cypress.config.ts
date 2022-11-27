import admin from 'firebase-admin'
import { defineConfig } from 'cypress'
import { plugin as cypressFirebasePlugin } from 'cypress-firebase'

const cypressConfig = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config): any {
      return cypressFirebasePlugin(on, config, admin)
    },
  },
})

export default cypressConfig
