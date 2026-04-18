import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/shared/hooks/useAppStore';
import type { Tip, Language } from '@shared/types';

interface TipBannerProps {
  paymentTips: Tip[];
  hoursTips: Tip[];
  instructionTips: Tip[];
  emergencyTips: Tip[];
}

const TIP_COLORS: Record<Tip['type'], string> = {
  payment: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
  hours: 'bg-green-50 border-green-200 hover:bg-green-100',
  instruction: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
  emergency: 'bg-red-50 border-red-200 hover:bg-red-100',
};

// Helper to get localized content from a tip
function getLocalizedContent(tip: Tip, language: Language): { title: string; content: string } {
  return {
    title: tip.title[language] || tip.title.es,
    content: tip.content[language] || tip.content.es,
  };
}

export function TipBanner({ paymentTips, hoursTips, instructionTips, emergencyTips }: TipBannerProps) {
  const { t } = useTranslation();
  const language = useAppStore((state) => state.language);

  // If no tips of any type, return null
  if (
    paymentTips.length === 0 &&
    hoursTips.length === 0 &&
    instructionTips.length === 0 &&
    emergencyTips.length === 0
  ) {
    return null;
  }

  return (
    <div
      role="complementary"
      aria-label={t('tips.viewDetails')}
      className="space-y-3 animate-slide-in-bottom"
    >
      {/* Payment tips */}
      {paymentTips.length > 0 && (
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-blue-700 flex items-center gap-1">
            <span>💰</span> {t('tips.payment')}
          </h4>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {paymentTips.map((tip) => {
              const { title, content } = getLocalizedContent(tip, language);
              return (
                <Card
                  key={tip.id}
                  className={`min-w-[200px] flex-shrink-0 ${TIP_COLORS.payment}`}
                >
                  <CardContent className="p-3">
                    <p className="font-medium text-sm text-blue-900">{title}</p>
                    <p className="text-xs text-blue-700 mt-1">{content}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Hours tips */}
      {hoursTips.length > 0 && (
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-green-700 flex items-center gap-1">
            <span>🕐</span> {t('tips.hours')}
          </h4>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {hoursTips.map((tip) => {
              const { title, content } = getLocalizedContent(tip, language);
              return (
                <Card
                  key={tip.id}
                  className={`min-w-[200px] flex-shrink-0 ${TIP_COLORS.hours}`}
                >
                  <CardContent className="p-3">
                    <p className="font-medium text-sm text-green-900">{title}</p>
                    <p className="text-xs text-green-700 mt-1">{content}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Instruction tips */}
      {instructionTips.length > 0 && (
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-amber-700 flex items-center gap-1">
            <span>ℹ️</span> {t('tips.instructions')}
          </h4>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {instructionTips.map((tip) => {
              const { title, content } = getLocalizedContent(tip, language);
              return (
                <Card
                  key={tip.id}
                  className={`min-w-[200px] flex-shrink-0 ${TIP_COLORS.instruction}`}
                >
                  <CardContent className="p-3">
                    <p className="font-medium text-sm text-amber-900">{title}</p>
                    <p className="text-xs text-amber-700 mt-1">{content}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Emergency tips */}
      {emergencyTips.length > 0 && (
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-red-700 flex items-center gap-1">
            <span>🚨</span> {t('emergency.title')}
          </h4>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {emergencyTips.map((tip) => {
              const { title, content } = getLocalizedContent(tip, language);
              return (
                <Card
                  key={tip.id}
                  className={`min-w-[200px] flex-shrink-0 ${TIP_COLORS.emergency}`}
                >
                  <CardContent className="p-3">
                    <p className="font-medium text-sm text-red-900">{title}</p>
                    <p className="text-xs text-red-700 mt-1">{content}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}