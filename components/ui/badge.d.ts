import { HTMLAttributes } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
} 