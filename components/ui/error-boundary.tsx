"use client";

import { Component, ReactNode, ErrorInfo } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <DefaultErrorFallback
          error={this.state.error}
          onReset={() => this.setState({ hasError: false })}
        />
      );
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error?: Error;
  onReset: () => void;
}

function DefaultErrorFallback({ error, onReset }: DefaultErrorFallbackProps) {
  return (
    <div className='min-h-[400px] flex items-center justify-center p-6'>
      <motion.div
        className='max-w-md w-full text-center space-y-6'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Error Icon */}
        <motion.div
          className='flex justify-center'
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className='w-16 h-16 bg-error-0 rounded-full flex items-center justify-center shadow-container'>
            <AlertTriangle className='w-8 h-8 text-error' />
          </div>
        </motion.div>

        {/* Error Content */}
        <div className='space-y-3'>
          <h3 className='heading-5 text-foreground'>Có lỗi xảy ra</h3>
          <p className='body-medium-regular text-muted-foreground'>
            Thành phần này đã gặp phải lỗi bất ngờ. Vui lòng thử lại.
          </p>

          {/* Error Message in Development */}
          {process.env.NODE_ENV === "development" && error && (
            <motion.div
              className='bg-error-0 border border-error-50 rounded-lg p-3 text-left mt-4'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className='body-xsmall-regular text-error-200 font-mono break-all'>
                {error.message}
              </p>
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <motion.div
          className='flex flex-col sm:flex-row gap-3 justify-center'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={onReset}
            size='sm'
            className='flex items-center space-x-2'
          >
            <RefreshCw className='w-4 h-4' />
            <span>Thử lại</span>
          </Button>

          <Button
            variant='outline'
            size='sm'
            onClick={() => (window.location.href = "/")}
            className='flex items-center space-x-2'
          >
            <Home className='w-4 h-4' />
            <span>Về trang chủ</span>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Hook-based error boundary for functional components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorFallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={errorFallback} onError={onError}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
