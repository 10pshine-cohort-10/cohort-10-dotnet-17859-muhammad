import type { ComponentProps } from 'react'
import { buttonStyles, type ButtonVariant } from './button-styles'

export function Button({
  variant = 'primary',
  className,
  type = 'button',
  ...props
}: ComponentProps<'button'> & { variant?: ButtonVariant }) {
  return <button type={type} className={buttonStyles(variant, className)} {...props} />
}
