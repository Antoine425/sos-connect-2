import { useState, useEffect } from 'react';
import { X, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LogEntry {
  id: number;
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: string;
}

export const MobileDebugConsole = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [logId, setLogId] = useState(0);

  useEffect(() => {
    // Intercept console methods
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;

    const addLog = (type: LogEntry['type'], args: any[]) => {
      const message = args.map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2);
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      }).join(' ');

      setLogs(prev => [
        ...prev.slice(-49), // Keep last 50 logs
        {
          id: logId,
          type,
          message,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
      setLogId(prev => prev + 1);
    };

    console.log = (...args) => {
      originalLog(...args);
      addLog('log', args);
    };

    console.error = (...args) => {
      originalError(...args);
      addLog('error', args);
    };

    console.warn = (...args) => {
      originalWarn(...args);
      addLog('warn', args);
    };

    console.info = (...args) => {
      originalInfo(...args);
      addLog('info', args);
    };

    // Cleanup
    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      console.info = originalInfo;
    };
  }, [logId]);

  // Toggle with keyboard shortcut (Ctrl+Shift+D)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setIsVisible(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const copyLogs = () => {
    const logsText = logs.map(log => 
      `[${log.timestamp}] ${log.type.toUpperCase()}: ${log.message}`
    ).join('\n');
    navigator.clipboard.writeText(logsText);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'error': return 'text-red-600 bg-red-50 dark:bg-red-950';
      case 'warn': return 'text-orange-600 bg-orange-50 dark:bg-orange-950';
      case 'info': return 'text-blue-600 bg-blue-50 dark:bg-blue-950';
      default: return 'text-foreground bg-muted/30';
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-colors"
        title="Ouvrir la console de debug"
      >
        🐛
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border p-3 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-lg">🐛 Console de Debug</h2>
          <p className="text-xs text-muted-foreground">{logs.length} logs</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={copyLogs}
            title="Copier les logs"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={clearLogs}
            title="Effacer les logs"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsVisible(false)}
            title="Fermer"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Logs */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 font-mono text-xs">
        {logs.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Aucun log pour le moment.<br />
            Testez la géolocalisation pour voir les logs ici.
          </div>
        ) : (
          logs.map(log => (
            <div
              key={log.id}
              className={`p-2 rounded text-xs whitespace-pre-wrap break-words ${getLogColor(log.type)}`}
            >
              <span className="text-muted-foreground">[{log.timestamp}]</span>{' '}
              <span className="font-semibold">{log.type.toUpperCase()}:</span>{' '}
              {log.message}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="bg-card border-t border-border p-3 text-xs text-muted-foreground text-center">
        Astuce : Appuyez sur Ctrl+Shift+D pour ouvrir/fermer
      </div>
    </div>
  );
};

