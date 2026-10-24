import { vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/Bio/',
  plugins: [remix({ ssr: false, buildDirectory: 'build' })],
})
