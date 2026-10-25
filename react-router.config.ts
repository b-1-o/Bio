import type { Config } from '@react-router/dev/config'

export default {
  appDirectory: 'app',
  buildDirectory: 'build',
  ssr: false,
  future: {
    v8_viteEnvironmentApi: true,
  },
} satisfies Config
