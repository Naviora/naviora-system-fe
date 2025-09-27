"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, Home, Mail } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to error monitoring service
    console.error("Global Error:", error);
  }, [error]);

  return (
    <html lang='en'>
      <body>
        <div className='min-h-screen bg-background flex items-center justify-center p-4'>
          <motion.div
            className='max-w-xl w-full text-center space-y-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Critical Error Icon */}
            <motion.div
              className='flex justify-center'
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
            >
              <div className='relative'>
                <div className='w-32 h-32 bg-error-0 rounded-full flex items-center justify-center shadow-container-large'>
                  <AlertCircle className='w-16 h-16 text-error' />
                </div>
                {/* Pulsing Ring */}
                <motion.div
                  className='absolute inset-0 border-2 border-error-100 rounded-full'
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>

            {/* Error Content */}
            <motion.div
              className='space-y-4'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h1 className='heading-2 text-foreground'>
                Lỗi hệ thống nghiêm trọng
              </h1>
              <p className='body-large-regular text-muted-foreground'>
                Ứng dụng đã gặp phải lỗi nghiêm trọng và không thể hoạt động
                bình thường. Chúng tôi đã được thông báo về sự cố này.
              </p>
            </motion.div>

            {/* Error ID */}
            {error.digest && (
              <motion.div
                className='bg-greyscale-25 border border-border rounded-lg p-4'
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <div className='flex items-center justify-center space-x-2 text-muted-foreground'>
                  <span className='body-small-regular'>Mã lỗi:</span>
                  <code className='body-small-medium font-mono bg-secondary px-2 py-1 rounded text-foreground'>
                    {error.digest}
                  </code>
                </div>
              </motion.div>
            )}

            {/* Recovery Actions */}
            <motion.div
              className='space-y-4'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Button
                  onClick={reset}
                  size='lg'
                  className='flex items-center space-x-2 min-w-[160px]'
                >
                  <RefreshCw className='w-4 h-4' />
                  <span>Khởi động lại ứng dụng</span>
                </Button>

                <Button
                  variant='outline'
                  onClick={() => (window.location.href = "/")}
                  size='lg'
                  className='flex items-center space-x-2 min-w-[160px]'
                >
                  <Home className='w-4 h-4' />
                  <span>Về trang chủ</span>
                </Button>
              </div>

              {/* Contact Support */}
              <div className='pt-4 border-t border-border'>
                <p className='body-small-regular text-muted-foreground mb-3'>
                  Nếu lỗi vẫn tiếp tục, vui lòng liên hệ hỗ trợ:
                </p>
                <Button
                  variant='ghost'
                  size='sm'
                  className='flex items-center space-x-2'
                  onClick={() => window.open("mailto:support@naviora.com")}
                >
                  <Mail className='w-4 h-4' />
                  <span>support@naviora.com</span>
                </Button>
              </div>
            </motion.div>

            {/* Status Indicator */}
            <motion.div
              className='flex items-center justify-center space-x-2 text-muted-foreground'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <div className='w-2 h-2 bg-error rounded-full animate-pulse' />
              <span className='body-xsmall-regular'>
                Đội ngũ kỹ thuật đã được thông báo
              </span>
            </motion.div>
          </motion.div>
        </div>
      </body>
    </html>
  );
}
