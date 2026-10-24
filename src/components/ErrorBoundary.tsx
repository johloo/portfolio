import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
  fallback: ReactNode
  onError?: (error: Error) => void
  children: ReactNode
}

/** Catches WebGL / scene crashes so the rest of the portfolio keeps working. */
export class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('3D scene failed:', error, info.componentStack)
    this.props.onError?.(error)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
