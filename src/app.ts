import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'
import { initAnalytics, initSentry } from '@/utils/analytics'

import './app.scss'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    initAnalytics()
    initSentry()
  })

  // children 是将要会渲染的页面
  return children
}
  


export default App
