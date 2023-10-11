import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/

export default defineConfig(({ command, mode, ssrBuild }) => {

  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), ['VITE_','MY_',''])
  //loadEnv(mode, directory, ['prefijos'])

  if (command === 'serve') {
    return {
      // dev specific config
      plugins: [react()],
      base: "./",
      define: {
        BASENAME: JSON.stringify("/"),
        MY_VARIABLE1_CONFIG_SERVE: JSON.stringify("A STRING VALUE"),
        MY_VARIABLE2_CONFIG_SERVE: JSON.stringify(env.VITE_MY_VARIABLE_ENV_DEVELOPMENT),
        MY_VARIABLE3_CONFIG_SERVE: JSON.stringify(env.MY_VARIABLE_ENV_DEVELOPMENT),
        MY_VARIABLE4_CONFIG_SERVE: JSON.stringify(env.VITE_VARIABLE_WITH_VITE),
        MY_VARIABLE5_CONFIG_SERVE: JSON.stringify(env.NOT_MY_VARIABLE_ENV_DEVELOPMENT),
        MY_VARIABLE6_CONFIG_SERVE: JSON.stringify(env.VITE_MY_VARIABLE_ENV_PRODUCTION),
      }
    }
  } else {
    // command === 'build'
    return {
      // build specific config
      plugins: [react()],
      base: "./",
      define: {
        BASENAME: JSON.stringify("/ReactRouter-DataApi"),
        MY_VARIABLE1_CONFIG_BUILD: JSON.stringify("A STRING VALUE IN BUILD PRODUCTION"),
        MY_VARIABLE2_CONFIG_BUILD: JSON.stringify(env.VITE_MY_VARIABLE_ENV_PRODUCTION),
        MY_VARIABLE3_CONFIG_BUILD: JSON.stringify(env.MY_VARIABLE_ENV_PRODUCTION),
        
      }
    }
  }
})