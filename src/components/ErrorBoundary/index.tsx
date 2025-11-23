import { Component, type ErrorInfo, type ReactNode } from 'react'
import { View } from '@tarojs/components'
import Empty from '@/components/Empty'
import { captureError } from '@/utils/analytics'
import './index.scss'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode | ((error: Error | null, reset: () => void) => ReactNode)
  onError?: (error: Error, info: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info)
    captureError(error, { componentStack: info.componentStack })
  }

  private resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    const { children, fallback } = this.props
    const { hasError, error } = this.state

    if (hasError) {
      if (fallback) {
        return typeof fallback === 'function' ? fallback(error, this.resetError) : fallback
      }

      return (
        <View className='error-boundary'>
          <Empty
            title='页面开小差了'
            description='请稍后再试或点击重试'
            actionText='重试'
            onAction={this.resetError}
          />
        </View>
      )
    }

    return children
  }
}

export default ErrorBoundary
