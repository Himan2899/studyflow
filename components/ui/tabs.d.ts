import { HTMLAttributes } from 'react'

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}

export interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string
  className?: string
}

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string
  className?: string
} 