'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Plane, Truck, Clock, AlertCircle } from 'lucide-react';

interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  duration?: number;
}

interface NotificationToastsProps {
  progress: number;
  trackingId: string;
  packageName: string;
}

const NotificationToasts = ({ progress, trackingId, packageName }: NotificationToastsProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [lastProgress, setLastProgress] = useState(0);

  // Toast configurations for different progress milestones
  const getProgressToast = (newProgress: number): Toast | null => {
    if (newProgress >= 1 && lastProgress < 1) {
      return {
        id: `delivered-${Date.now()}`,
        title: 'Package Delivered! 🎉',
        message: `${packageName} has been successfully delivered`,
        type: 'success',
        icon: CheckCircle,
        duration: 6000
      };
    }
    
    if (newProgress >= 0.8 && lastProgress < 0.8) {
      return {
        id: `out-for-delivery-${Date.now()}`,
        title: 'Out for Delivery',
        message: `Your package is with the delivery driver`,
        type: 'info',
        icon: Truck,
        duration: 5000
      };
    }
    
    if (newProgress >= 0.5 && lastProgress < 0.5) {
      return {
        id: `halfway-${Date.now()}`,
        title: 'Halfway There!',
        message: `Your package is 50% of the way to its destination`,
        type: 'info',
        icon: Plane,
        duration: 4000
      };
    }
    
    if (newProgress >= 0.25 && lastProgress < 0.25) {
      return {
        id: `departed-${Date.now()}`,
        title: 'Package Departed',
        message: `Your package has left the origin facility`,
        type: 'info',
        icon: Plane,
        duration: 4000
      };
    }
    
    return null;
  };

  // Add toast to the list
  const addToast = (toast: Toast) => {
    setToasts(current => [...current, toast]);
    
    // Auto remove after duration
    setTimeout(() => {
      removeToast(toast.id);
    }, toast.duration || 4000);
  };

  // Remove toast by id
  const removeToast = (id: string) => {
    setToasts(current => current.filter(toast => toast.id !== id));
  };

  // Monitor progress changes
  useEffect(() => {
    if (progress !== lastProgress) {
      const toast = getProgressToast(progress);
      if (toast) {
        addToast(toast);
      }
      setLastProgress(progress);
    }
  }, [progress, lastProgress, packageName]);

  // Welcome toast on component mount
  useEffect(() => {
    const welcomeToast: Toast = {
      id: `welcome-${Date.now()}`,
      title: 'Tracking Active',
      message: `Now tracking ${trackingId}`,
      type: 'info',
      icon: Clock,
      duration: 3000
    };
    
    setTimeout(() => addToast(welcomeToast), 1000);
  }, [trackingId]);

  const getToastStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'info':
        return 'text-blue-500';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[1001] space-y-2 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = toast.icon;
          
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 300, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.9 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
              }}
              className={`
                relative p-4 rounded-lg shadow-lg border backdrop-blur-sm
                ${getToastStyles(toast.type)}
              `}
            >
              {/* Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Content */}
              <div className="flex items-start gap-3 pr-6">
                <div className={`flex-shrink-0 ${getIconColor(toast.type)}`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-sm">
                    {toast.title}
                  </h4>
                  <p className="text-sm opacity-90 mt-1">
                    {toast.message}
                  </p>
                </div>
              </div>

              {/* Progress bar for auto-dismiss */}
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-current opacity-30"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ 
                  duration: (toast.duration || 4000) / 1000, 
                  ease: "linear" 
                }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default NotificationToasts;