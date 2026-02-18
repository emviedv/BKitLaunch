interface DebugConfig {
  enabled: boolean;
  level: 'info' | 'warn' | 'error' | 'debug';
  persistent: boolean;
}

class DebugService {
  private config: DebugConfig = {
    enabled: true, // Enable by default in development
    level: 'debug',
    persistent: true
  };

  private logHistory: Array<{
    timestamp: string;
    level: string;
    message: string;
    data?: any;
  }> = [];

  constructor() {
    this.info('DebugService initialized');
  }

  configure(config: Partial<DebugConfig>): void {
    this.config = { ...this.config, ...config };
    this.info('DebugService configured', config);
  }

  private shouldLog(level: string): boolean {
    if (!this.config.enabled) return false;
    
    const levels = ['debug', 'info', 'warn', 'error'];
    const configLevelIndex = levels.indexOf(this.config.level);
    const messageLevelIndex = levels.indexOf(level);
    
    return messageLevelIndex >= configLevelIndex;
  }

  private formatMessage(level: string, message: string, data?: any): void {
    const shouldLogMessage = this.shouldLog(level);

    if (!shouldLogMessage && !this.config.persistent) {
      return;
    }

    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level, message, data };
    
    if (this.config.persistent) {
      this.logHistory.push(logEntry);
      // Keep only last 100 entries
      if (this.logHistory.length > 100) {
        this.logHistory = this.logHistory.slice(-100);
      }
    }

    if (shouldLogMessage) {
      const emoji = {
        debug: '🔍',
        info: 'ℹ️',
        warn: '⚠️',
        error: '❌'
      }[level] || '';

      const prefix = `[BiblioKit ${emoji} ${level.toUpperCase()}] ${timestamp}`;
      
      if (data) {
        console.groupCollapsed(`${prefix} ${message}`);
        console.log('Data:', data);
        console.trace('Stack trace');
        console.groupEnd();
      } else {
        console.log(`${prefix} ${message}`);
      }
    }
  }

  debug(message: string, data?: any): void {
    this.formatMessage('debug', message, data);
  }

  info(message: string, data?: any): void {
    this.formatMessage('info', message, data);
  }

  warn(message: string, data?: any): void {
    this.formatMessage('warn', message, data);
  }

  error(message: string, data?: any): void {
    this.formatMessage('error', message, data);
  }

  // Save operations logging
  saveStart(operation: string, data?: any): void {
    this.debug(`💾 SAVE START: ${operation}`, data);
  }

  saveSuccess(operation: string, result?: any): void {
    this.info(`✅ SAVE SUCCESS: ${operation}`, result);
  }

  saveError(operation: string, error: any): void {
    this.error(`❌ SAVE ERROR: ${operation}`, error);
  }

  // API operations logging
  apiRequest(method: string, url: string, data?: any): void {
    this.debug(`🌐 API REQUEST: ${method} ${url}`, data);
  }

  apiResponse(method: string, url: string, response: any): void {
    this.debug(`📡 API RESPONSE: ${method} ${url}`, response);
  }

  apiError(method: string, url: string, error: any): void {
    this.error(`🚨 API ERROR: ${method} ${url}`, error);
  }

  // Content operations logging
  contentLoad(source: string, data?: any): void {
    this.info(`📂 CONTENT LOAD: ${source}`, data);
  }

  contentUpdate(section: string, data?: any): void {
    this.debug(`📝 CONTENT UPDATE: ${section}`, data);
  }

  contentPersist(mode: string, data?: any): void {
    this.info(`💾 CONTENT PERSIST: ${mode}`, data);
  }

  // Authentication logging
  authEvent(event: string, data?: any): void {
    this.info(`🔐 AUTH: ${event}`, data);
  }

  // Database operations
  dbConnection(status: string, data?: any): void {
    this.info(`🗄️ DATABASE: ${status}`, data);
  }

  dbQuery(query: string, params?: any): void {
    this.debug(`📊 DB QUERY: ${query}`, params);
  }

  // Get log history for debugging
  getLogHistory(): Array<{ timestamp: string; level: string; message: string; data?: any }> {
    return [...this.logHistory];
  }

  // Clear log history
  clearHistory(): void {
    this.logHistory = [];
    this.info('Log history cleared');
  }

  // Export logs as JSON for sharing with AI
  exportLogs(): string {
    return JSON.stringify(this.logHistory, null, 2);
  }
}

// Create singleton instance
export const debugService = new DebugService();

// Development mode detection
if (typeof window !== 'undefined' && typeof window.location !== 'undefined') {
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  debugService.configure({ 
    enabled: isDev,
    level: isDev ? 'debug' : 'warn',
    persistent: isDev
  });

  // Make available globally for console debugging
  (window as any).debugService = debugService;
}

export default debugService;
