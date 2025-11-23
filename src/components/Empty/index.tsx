import { View } from '@tarojs/components'
import type { ReactNode } from 'react'
import { Button } from '@taroify/core'
import { BagOutlined } from '@taroify/icons'
import './index.scss'

export interface EmptyProps {
  title?: string
  description?: string
  actionText?: string
  onAction?: () => void
  icon?: ReactNode
  className?: string
}

export const Empty = ({
  title = '暂无数据',
  description = '去看看其它内容吧～',
  actionText,
  onAction,
  icon,
  className
}: EmptyProps) => {
  return (
    <View className={`empty ${className ?? ''}`.trim()}>
      <View className='empty__icon'>
        {icon || <BagOutlined size='48px' color='var(--naicha-muted-color)' />}
      </View>
      <View className='empty__title'>{title}</View>
      {!!description && <View className='empty__desc'>{description}</View>}
      {actionText && (
        <Button className='empty__action' color='primary' onClick={onAction}>
          {actionText}
        </Button>
      )}
    </View>
  )
}

export default Empty
