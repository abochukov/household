import { defineConfig, loadEnv } from 'vite'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  console.log('Loaded env:', env)
  return defineConfig({
    //...
  })
}