import { reactive } from 'vue'
import { APP_NAME } from '@/utils'

export const useConfig = () => {
  const app = reactive({ name: APP_NAME })

  return { appName: app.name }
}
