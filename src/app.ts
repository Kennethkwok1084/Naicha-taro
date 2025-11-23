import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'
import { initAnalytics, initSentry } from '@/utils/analytics'

import './app.scss'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    // 初始化埋点和监控
    initAnalytics()
    initSentry()

    // TODO: M2 阶段实现登录检查逻辑
    // const isLoggedIn = await checkLoginStatus()
    // if (!isLoggedIn) {
    //   Taro.reLaunch({ url: '/pages/login/index' })
    // }
  })

  // children 是将要会渲染的页面
  return children
}
  


export default App
