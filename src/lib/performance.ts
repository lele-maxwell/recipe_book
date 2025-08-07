'use client'

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number> = new Map()
  private observers: Map<string, PerformanceObserver> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // Measure page load performance
  measurePageLoad(pageName: string) {
    if (typeof window === 'undefined') return

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigation) {
      const metrics = {
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        request: navigation.responseStart - navigation.requestStart,
        response: navigation.responseEnd - navigation.responseStart,
        dom: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        load: navigation.loadEventEnd - navigation.loadEventStart,
        total: navigation.loadEventEnd - navigation.fetchStart
      }

      console.log(`📊 Performance metrics for ${pageName}:`, metrics)
      this.metrics.set(`${pageName}_load`, metrics.total)
    }
  }

  // Measure Core Web Vitals
  measureWebVitals() {
    if (typeof window === 'undefined') return

    // Largest Contentful Paint (LCP)
    this.observeMetric('largest-contentful-paint', (entries) => {
      const lastEntry = entries[entries.length - 1]
      const lcp = lastEntry.startTime
      console.log('🎯 LCP:', lcp)
      this.metrics.set('lcp', lcp)
    })

    // First Input Delay (FID)
    this.observeMetric('first-input', (entries) => {
      const firstEntry = entries[0] as any
      const fid = firstEntry.processingStart - firstEntry.startTime
      console.log('⚡ FID:', fid)
      this.metrics.set('fid', fid)
    })

    // Cumulative Layout Shift (CLS)
    this.observeMetric('layout-shift', (entries) => {
      let cls = 0
      for (const entry of entries) {
        const layoutShiftEntry = entry as any
        if (!layoutShiftEntry.hadRecentInput) {
          cls += layoutShiftEntry.value
        }
      }
      console.log('📐 CLS:', cls)
      this.metrics.set('cls', cls)
    })
  }

  // Measure component render time
  measureComponentRender(componentName: string, renderFn: () => void) {
    const startTime = performance.now()
    renderFn()
    const endTime = performance.now()
    const renderTime = endTime - startTime
    
    console.log(`🔧 ${componentName} render time:`, renderTime)
    this.metrics.set(`${componentName}_render`, renderTime)
  }

  // Measure API call performance
  async measureApiCall<T>(apiName: string, apiCall: () => Promise<T>): Promise<T> {
    const startTime = performance.now()
    try {
      const result = await apiCall()
      const endTime = performance.now()
      const duration = endTime - startTime
      
      console.log(`🌐 API call ${apiName} took:`, duration)
      this.metrics.set(`api_${apiName}`, duration)
      
      return result
    } catch (error) {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      console.error(`❌ API call ${apiName} failed after:`, duration)
      this.metrics.set(`api_${apiName}_error`, duration)
      
      throw error
    }
  }

  // Measure image loading performance
  measureImageLoad(imageSrc: string, onLoad?: () => void) {
    if (typeof window === 'undefined') return

    const startTime = performance.now()
    const img = new Image()
    
    img.onload = () => {
      const endTime = performance.now()
      const loadTime = endTime - startTime
      console.log(`🖼️ Image ${imageSrc} loaded in:`, loadTime)
      this.metrics.set(`image_${imageSrc}`, loadTime)
      onLoad?.()
    }
    
    img.onerror = () => {
      const endTime = performance.now()
      const loadTime = endTime - startTime
      console.error(`❌ Image ${imageSrc} failed to load after:`, loadTime)
      this.metrics.set(`image_${imageSrc}_error`, loadTime)
    }
    
    img.src = imageSrc
  }

  // Get performance report
  getPerformanceReport(): Record<string, number> {
    const report: Record<string, number> = {}
    this.metrics.forEach((value, key) => {
      report[key] = value
    })
    return report
  }

  // Send performance data to analytics (placeholder)
  sendToAnalytics() {
    const report = this.getPerformanceReport()
    
    // In a real app, you would send this to your analytics service
    console.log('📈 Performance Report:', report)
    
    // Example: Send to Google Analytics, Mixpanel, etc.
    // gtag('event', 'performance_metrics', report)
  }

  private observeMetric(type: string, callback: (entries: PerformanceEntry[]) => void) {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries())
      })
      
      observer.observe({ type, buffered: true })
      this.observers.set(type, observer)
    } catch (error) {
      console.warn(`Performance observer for ${type} not supported:`, error)
    }
  }

  // Clean up observers
  cleanup() {
    this.observers.forEach((observer) => {
      observer.disconnect()
    })
    this.observers.clear()
  }
}

// React hook for performance monitoring
export function usePerformanceMonitor() {
  const monitor = PerformanceMonitor.getInstance()
  
  return {
    measurePageLoad: monitor.measurePageLoad.bind(monitor),
    measureWebVitals: monitor.measureWebVitals.bind(monitor),
    measureComponentRender: monitor.measureComponentRender.bind(monitor),
    measureApiCall: monitor.measureApiCall.bind(monitor),
    measureImageLoad: monitor.measureImageLoad.bind(monitor),
    getReport: monitor.getPerformanceReport.bind(monitor),
    sendToAnalytics: monitor.sendToAnalytics.bind(monitor)
  }
}

// Bundle size analyzer
export function analyzeBundleSize() {
  if (typeof window === 'undefined') return

  // Analyze loaded scripts
  const scripts = Array.from(document.querySelectorAll('script[src]'))
  const totalSize = scripts.reduce((total, script) => {
    const src = (script as HTMLScriptElement).src
    if (src.includes('_next/static')) {
      // Estimate size based on script name patterns
      if (src.includes('chunks/pages')) return total + 50 // Estimated KB
      if (src.includes('chunks/main')) return total + 100
      if (src.includes('chunks/webpack')) return total + 20
      if (src.includes('chunks/framework')) return total + 150
    }
    return total
  }, 0)

  console.log('📦 Estimated bundle size:', totalSize, 'KB')
  console.log('📦 Loaded scripts:', scripts.length)
  
  return { totalSize, scriptCount: scripts.length }
}

// Memory usage monitoring
export function monitorMemoryUsage() {
  if (typeof window === 'undefined') return

  // Check if memory API is available
  const perfWithMemory = performance as any
  if (!perfWithMemory.memory) return

  const memory = perfWithMemory.memory
  const memoryInfo = {
    used: Math.round(memory.usedJSHeapSize / 1048576), // MB
    total: Math.round(memory.totalJSHeapSize / 1048576), // MB
    limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
  }

  console.log('🧠 Memory usage:', memoryInfo)
  return memoryInfo
}