"use client";

import { useEffect, useState } from 'react';
import { driver, Driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export interface TourStep {
  element: string;
  popover: {
    title: string;
    description: string;
    side?: 'top' | 'bottom' | 'left' | 'right';
    align?: 'start' | 'center' | 'end';
  };
}

interface ProductTourProps {
  steps: TourStep[];
  onComplete?: () => void;
  onSkip?: () => void;
  autoStart?: boolean;
}

export function ProductTour({ steps, onComplete, onSkip, autoStart = true }: ProductTourProps) {
  const [driverObj, setDriverObj] = useState<Driver | null>(null);

  useEffect(() => {
    const driverInstance = driver({
      showProgress: true,
      animate: true,
      smoothScroll: true,
      allowClose: true,
      overlayColor: 'rgba(0, 0, 0, 0.75)',
      stagePadding: 10,
      stageRadius: 8,
      popoverClass: 'tower-tour-popover',
      progressText: '{{current}} of {{total}}',
      nextBtnText: 'Next →',
      prevBtnText: '← Back',
      doneBtnText: 'Got it!',
      onDestroyStarted: () => {
        if (driverInstance.hasNextStep()) {
          onSkip?.();
        } else {
          onComplete?.();
        }
        driverInstance.destroy();
      },
      steps: steps.map(step => ({
        element: step.element,
        popover: {
          title: step.popover.title,
          description: step.popover.description,
          side: step.popover.side || 'bottom',
          align: step.popover.align || 'center',
        }
      }))
    });

    setDriverObj(driverInstance);

    if (autoStart) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        driverInstance.drive();
      }, 500);
    }

    return () => {
      driverInstance.destroy();
    };
  }, [steps, onComplete, onSkip, autoStart]);

  return null; // Driver.js manages its own DOM
}

// Predefined tour for the main app
export const appTourSteps: TourStep[] = [
  {
    element: '#sidebar-channels',
    popover: {
      title: '🧭 Your Channels',
      description: 'Each channel connects you to a different executive. Engineering → Ada, Product → Grace, and so on.',
      side: 'right',
    }
  },
  {
    element: '#channel-engineering',
    popover: {
      title: '🧠 Meet Ada, your CTO',
      description: 'Ada handles technical architecture, engineering decisions, and code strategy. She\'s direct and thorough.',
      side: 'right',
    }
  },
  {
    element: '#channel-product',
    popover: {
      title: '🎯 Meet Grace, your CPO',
      description: 'Grace focuses on product-market fit, user research, and roadmap priorities. She keeps you user-focused.',
      side: 'right',
    }
  },
  {
    element: '#channel-marketing',
    popover: {
      title: '📣 Meet Tony, your CMO',
      description: 'Tony handles positioning, content strategy, and go-to-market. He thinks about how customers see you.',
      side: 'right',
    }
  },
  {
    element: '#channel-finance',
    popover: {
      title: '📊 Meet Val, your CFO',
      description: 'Val covers unit economics, runway planning, and financial modeling. She asks the hard ROI questions.',
      side: 'right',
    }
  },
  {
    element: '#channel-decisions',
    popover: {
      title: '📋 Decisions Log',
      description: 'Major decisions get logged here. Your paper trail for what you decided and why.',
      side: 'right',
    }
  },
  {
    element: '#message-input',
    popover: {
      title: '💬 Start a conversation',
      description: 'Just type naturally. Ask questions, share problems, think out loud. Your exec team is here to help.',
      side: 'top',
    }
  },
];

// CSS for custom styling (add to globals.css)
export const tourStyles = `
.tower-tour-popover {
  background: #1f2937 !important;
  color: #f3f4f6 !important;
  border: 1px solid #374151 !important;
  border-radius: 12px !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
}

.tower-tour-popover .driver-popover-title {
  font-size: 18px !important;
  font-weight: 600 !important;
  color: #fff !important;
}

.tower-tour-popover .driver-popover-description {
  color: #9ca3af !important;
  font-size: 14px !important;
  line-height: 1.5 !important;
}

.tower-tour-popover .driver-popover-progress-text {
  color: #6b7280 !important;
}

.tower-tour-popover button {
  background: #4f46e5 !important;
  color: white !important;
  border: none !important;
  padding: 8px 16px !important;
  border-radius: 6px !important;
  font-weight: 500 !important;
  cursor: pointer !important;
  transition: background 0.2s !important;
}

.tower-tour-popover button:hover {
  background: #4338ca !important;
}

.tower-tour-popover .driver-popover-prev-btn {
  background: #374151 !important;
}

.tower-tour-popover .driver-popover-prev-btn:hover {
  background: #4b5563 !important;
}
`;
