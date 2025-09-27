"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AlertTriangle, Home, RotateCcw, Bug } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        className="max-w-lg w-full text-center space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Error Icon */}
        <motion.div
          className="flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className="w-24 h-24 bg-error-0 rounded-full flex items-center justify-center shadow-container">
            <AlertTriangle className="w-12 h-12 text-error" />
          </div>
        </motion.div>

        {/* Error Title */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h1 className="heading-3 text-foreground">Oops! Có lỗi xảy ra</h1>
          <p className="body-medium-regular text-muted-foreground">
            Ứng dụng đã gặp phải một lỗi bất ngờ. Chúng tôi đã ghi nhận sự cố
            này và sẽ khắc phục sớm nhất có thể.
          </p>
        </motion.div>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === "development" && (
          <motion.div
            className="bg-error-0 border border-error-50 rounded-lg p-4 text-left"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="flex items-start space-x-3">
              <Bug className="w-5 h-5 text-error mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="body-small-semibold text-error">
                  Chi tiết lỗi (Development Mode):
                </h3>
                <p className="body-xsmall-regular text-error-200 font-mono break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="body-xsmall-regular text-error-200">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Button
            onClick={reset}
            className="flex items-center space-x-2 min-w-[140px]"
            size="lg"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Thử lại</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="flex items-center space-x-2 min-w-[140px]"
            size="lg"
          >
            <Home className="w-4 h-4" />
            <span>Về trang chủ</span>
          </Button>
        </motion.div>

        {/* Help Text */}
        <motion.div
          className="pt-4 border-t border-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <p className="body-small-regular text-muted-foreground">
            Nếu vấn đề vẫn tiếp tục, vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
