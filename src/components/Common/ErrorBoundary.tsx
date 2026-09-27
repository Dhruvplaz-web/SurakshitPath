import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[SurakshitPath] ErrorBoundary caught error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '24px',
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          margin: '12px 0',
          color: '#f3f4f6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#ef4444' }}>
            <AlertTriangle size={18} />
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>
              {this.props.fallbackTitle || 'Component Error'}
            </h4>
          </div>
          <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '16px' }}>
            {this.state.error?.message || 'An unexpected error occurred while rendering this module.'}
          </p>
          <button
            onClick={this.handleRetry}
            className="btn-civic"
            style={{ fontSize: '12px', padding: '4px 12px' }}
          >
            <RefreshCw size={12} /> Retry Component
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
