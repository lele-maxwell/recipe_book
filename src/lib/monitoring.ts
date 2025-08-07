'use client'

// Error monitoring and logging system
export interface ErrorLog {
  id: string
  timestamp: string
  level: 'error' | 'warn' | 'info' | 'debug'
  message: string
  stack?: string
  context?: Record<string, any>
  userId?: string
  sessionId?: string
  userAgent?: string
  url?: string
  component?: string
  action?: string
}

class ErrorMonitor {
  private static instance: ErrorMonitor
  private logs: ErrorLog[] = []
  private maxLogs = 1000
  private sessionId: string

  constructor() {
    this.sessionId = this.generateSessionId()
    this.setupGlobalErrorHandlers()
  }

  static getInstance(): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor()
    }
    return ErrorMonitor.instance
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private setupGlobalErrorHandlers() {
    if (typeof window === 'undefined') return

    // Handle unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.logError({
        message: event.message,
        stack: event.error?.stack,
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          type: 'javascript_error'
        }
      })
    })

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        context: {
          type: 'promise_rejection',
          reason: event.reason
        }
      })
    })

    // Handle React errors (if using error boundaries)
    if (typeof window !== 'undefined' && (window as any).__REACT_ERROR_OVERLAY_GLOBAL_HOOK__) {
      const originalConsoleError = console.error
      console.error = (...args) => {
        if (args[0]?.includes?.('React')) {
          this.logError({
            message: args.join(' '),
            context: {
              type: 'react_error',
              args
            }
          })
        }
        originalConsoleError.apply(console, args)
      }
    }
  }

  // Log different types of errors
  logError(error: Partial<ErrorLog>) {
    this.log('error', error)
  }

  logWarning(warning: Partial<ErrorLog>) {
    this.log('warn', warning)
  }

  logInfo(info: Partial<ErrorLog>) {
    this.log('info', info)
  }

  logDebug(debug: Partial<ErrorLog>) {
    this.log('debug', debug)
  }

  private log(level: ErrorLog['level'], logData: Partial<ErrorLog>) {
    const log: ErrorLog = {
      id: this.generateLogId(),
      timestamp: new Date().toISOString(),
      level,
      message: logData.message || 'Unknown error',
      stack: logData.stack,
      context: logData.context || {},
      userId: logData.userId,
      sessionId: this.sessionId,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      component: logData.component,
      action: logData.action
    }

    // Add to local storage
    this.logs.push(log)
    
    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Console output for development
    if (process.env.NODE_ENV === 'development') {
      const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'
      console[consoleMethod](`[${level.toUpperCase()}] ${log.message}`, log)
    }

    // Send to external monitoring service in production
    if (process.env.NODE_ENV === 'production' && level === 'error') {
      this.sendToMonitoringService(log)
    }
  }

  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private async sendToMonitoringService(log: ErrorLog) {
    try {
      // In a real application, you would send to services like:
      // - Sentry
      // - LogRocket
      // - Datadog
      // - Custom logging endpoint
      
      // Example: Send to custom logging endpoint
      await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(log)
      }).catch(() => {
        // Silently fail if logging endpoint is not available
      })

      // Example: Send to Sentry (if configured)
      // if (window.Sentry) {
      //   window.Sentry.captureException(new Error(log.message), {
      //     tags: {
      //       component: log.component,
      //       action: log.action
      //     },
      //     extra: log.context
      //   })
      // }

    } catch (error) {
      // Don't let logging errors break the application
      console.warn('Failed to send log to monitoring service:', error)
    }
  }

  // Get logs for debugging
  getLogs(filter?: {
    level?: ErrorLog['level']
    component?: string
    since?: Date
  }): ErrorLog[] {
    let filteredLogs = [...this.logs]

    if (filter) {
      if (filter.level) {
        filteredLogs = filteredLogs.filter(log => log.level === filter.level)
      }
      if (filter.component) {
        filteredLogs = filteredLogs.filter(log => log.component === filter.component)
      }
      if (filter.since) {
        filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= filter.since!)
      }
    }

    return filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  // Get error statistics
  getErrorStats(): {
    totalErrors: number
    errorsByLevel: Record<string, number>
    errorsByComponent: Record<string, number>
    recentErrors: ErrorLog[]
    errorRate: number // errors per minute
  } {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    const recentLogs = this.logs.filter(log => new Date(log.timestamp) >= oneHourAgo)

    const errorsByLevel: Record<string, number> = {}
    const errorsByComponent: Record<string, number> = {}

    this.logs.forEach(log => {
      errorsByLevel[log.level] = (errorsByLevel[log.level] || 0) + 1
      if (log.component) {
        errorsByComponent[log.component] = (errorsByComponent[log.component] || 0) + 1
      }
    })

    return {
      totalErrors: this.logs.length,
      errorsByLevel,
      errorsByComponent,
      recentErrors: recentLogs.slice(0, 10),
      errorRate: recentLogs.length / 60 // errors per minute
    }
  }

  // Clear logs
  clearLogs() {
    this.logs = []
  }

  // Export logs for analysis
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }
}

// React hook for error monitoring
export function useErrorMonitor() {
  const monitor = ErrorMonitor.getInstance()

  return {
    logError: (error: Error | string, context?: Record<string, any>, component?: string) => {
      monitor.logError({
        message: typeof error === 'string' ? error : error.message,
        stack: typeof error === 'object' ? error.stack : undefined,
        context,
        component
      })
    },
    logWarning: (message: string, context?: Record<string, any>, component?: string) => {
      monitor.logWarning({ message, context, component })
    },
    logInfo: (message: string, context?: Record<string, any>, component?: string) => {
      monitor.logInfo({ message, context, component })
    },
    getLogs: monitor.getLogs.bind(monitor),
    getStats: monitor.getErrorStats.bind(monitor),
    clearLogs: monitor.clearLogs.bind(monitor)
  }
}

// Performance monitoring
export class PerformanceTracker {
  private static instance: PerformanceTracker
  private metrics: Map<string, number[]> = new Map()

  static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker()
    }
    return PerformanceTracker.instance
  }

  // Track API response times
  trackApiCall(endpoint: string, duration: number, success: boolean) {
    const key = `api_${endpoint}_${success ? 'success' : 'error'}`
    const existing = this.metrics.get(key) || []
    existing.push(duration)
    
    // Keep only last 100 measurements
    if (existing.length > 100) {
      existing.shift()
    }
    
    this.metrics.set(key, existing)

    // Log slow API calls
    if (duration > 5000) { // 5 seconds
      ErrorMonitor.getInstance().logWarning({
        message: `Slow API call: ${endpoint}`,
        context: {
          endpoint,
          duration,
          success,
          type: 'performance_warning'
        }
      })
    }
  }

  // Track component render times
  trackComponentRender(componentName: string, duration: number) {
    const key = `component_${componentName}`
    const existing = this.metrics.get(key) || []
    existing.push(duration)
    
    if (existing.length > 50) {
      existing.shift()
    }
    
    this.metrics.set(key, existing)

    // Log slow renders
    if (duration > 100) { // 100ms
      ErrorMonitor.getInstance().logWarning({
        message: `Slow component render: ${componentName}`,
        context: {
          componentName,
          duration,
          type: 'render_performance'
        }
      })
    }
  }

  // Get performance statistics
  getPerformanceStats(): Record<string, {
    average: number
    min: number
    max: number
    count: number
  }> {
    const stats: Record<string, any> = {}

    this.metrics.forEach((values, key) => {
      if (values.length > 0) {
        stats[key] = {
          average: values.reduce((a, b) => a + b, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          count: values.length
        }
      }
    })

    return stats
  }
}

// Export singleton instances
export const errorMonitor = ErrorMonitor.getInstance()
export const performanceTracker = PerformanceTracker.getInstance()

// Utility functions for common logging scenarios
export const logApiError = (endpoint: string, error: Error, context?: Record<string, any>) => {
  errorMonitor.logError({
    message: `API Error: ${endpoint} - ${error.message}`,
    stack: error.stack,
    context: {
      endpoint,
      ...context,
      type: 'api_error'
    }
  })
}

export const logComponentError = (componentName: string, error: Error, props?: Record<string, any>) => {
  errorMonitor.logError({
    message: `Component Error: ${componentName} - ${error.message}`,
    stack: error.stack,
    component: componentName,
    context: {
      props,
      type: 'component_error'
    }
  })
}

export const logUserAction = (action: string, context?: Record<string, any>) => {
  errorMonitor.logInfo({
    message: `User Action: ${action}`,
    action,
    context: {
      ...context,
      type: 'user_action'
    }
  })
}