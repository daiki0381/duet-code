import admin from 'firebase-admin'
import { defineConfig } from 'cypress'
import { plugin as cypressFirebasePlugin } from 'cypress-firebase'

const cypressConfig = defineConfig({
  e2e: {
    projectId: '6ofkp6',
    defaultCommandTimeout: 20000,
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config): any {
      return cypressFirebasePlugin(on, config, admin)
    },
  },
})

export default cypressConfig
