import { View } from '@tarojs/components'
import { useMemo } from 'react'
import './index.scss'

export interface SkeletonProps {
  rows?: number
  showAvatar?: boolean
  showTitle?: boolean
  animated?: boolean
  className?: string
}

export const Skeleton = ({
  rows = 3,
  showAvatar = false,
  showTitle = true,
  animated = true,
  className
}: SkeletonProps) => {
  const placeholders = useMemo(() => Array.from({ length: rows }), [rows])

  return (
    <View className={`skeleton ${animated ? 'skeleton--animated' : ''} ${className ?? ''}`.trim()}>
      {showAvatar && <View className='skeleton__avatar' />}
      <View className='skeleton__body'>
        {showTitle && <View className='skeleton__title' />}
        {placeholders.map((_, index) => (
          <View key={index} className='skeleton__row' />
        ))}
      </View>
    </View>
  )
}

export default Skeleton
