import { HTMLAttributes } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  className?: string
}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
} 