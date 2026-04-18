import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/shared/hooks/useAppStore';
import type { Tip, Language } from '@shared/types';

interface UseTipsReturn {
  tips: Tip[];
  paymentTips: Tip[];
  hoursTips: Tip[];
  instructionTips: Tip[];
  emergencyTips: Tip[];
  hasTips: boolean;
}

export function useTips(moduleId: string | null): UseTipsReturn {
  const { i18n } = useTranslation();
  const tips = useAppStore((state) => state.tips);

  return useMemo(() => {
    if (!moduleId) {
      return {
        tips: [],
        paymentTips: [],
        hoursTips: [],
        instructionTips: [],
        emergencyTips: [],
        hasTips: false,
      };
    }

    // Filter tips for this module or global tips (moduleId = "ALL")
    const moduleTips = tips.filter(
      (tip) => tip.moduleId === moduleId || tip.moduleId === 'ALL'
    );

    return {
      tips: moduleTips,
      paymentTips: moduleTips.filter((t) => t.type === 'payment'),
      hoursTips: moduleTips.filter((t) => t.type === 'hours'),
      instructionTips: moduleTips.filter((t) => t.type === 'instruction'),
      emergencyTips: moduleTips.filter((t) => t.type === 'emergency'),
      hasTips: moduleTips.length > 0,
    };
  }, [moduleId, tips]);
}