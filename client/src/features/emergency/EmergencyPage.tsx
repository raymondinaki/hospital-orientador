import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Phone, MapPin, ArrowLeft, Clock, Info, Flame, DoorOpen } from 'lucide-react';
import { EmergencyMap } from './EmergencyMap';

export default function EmergencyPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white animate-fade-in">
      {/* Header with back button */}
      <div className="sticky top-0 z-40 bg-red-600 text-white shadow-lg">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-red-700 gap-2"
                >
                  <ArrowLeft className="size-4" />
                  {t('emergency.backToHome')}
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-5" />
              <h1 className="text-xl font-bold">{t('emergency.title')}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Emergency Warning Banner */}
        <Card className="bg-red-600 text-white border-red-700 animate-pulse">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="size-12 mx-auto mb-3" />
            <h2 className="text-2xl font-bold mb-2">{t('emergency.subtitle')}</h2>
            <p className="text-red-100 text-lg">{t('emergency.instructions')}</p>
          </CardContent>
        </Card>

        {/* Emergency Procedures */}
        <Card className="border-red-200">
          <CardHeader className="bg-red-50 border-b border-red-200">
            <CardTitle className="text-red-800 flex items-center gap-2">
              <Info className="size-5" />
              {t('emergency.emergencyProcedures')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Fire */}
            <div className="flex gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex-shrink-0">
                <Flame className="size-8 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-orange-800 text-lg mb-1">
                  🔥 {t('emergency.fire').split(':')[0]}
                </h3>
                <p className="text-orange-700">{t('emergency.fire').split(':').slice(1).join(':')}</p>
              </div>
            </div>

            {/* Earthquake */}
            <div className="flex gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex-shrink-0">
                <MapPin className="size-8 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-yellow-800 text-lg mb-1">
                  🌋 {t('emergency.earthquake').split(':')[0]}
                </h3>
                <p className="text-yellow-700">{t('emergency.earthquake').split(':').slice(1).join(':')}</p>
              </div>
            </div>

            {/* Evacuation */}
            <div className="flex gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex-shrink-0">
                <DoorOpen className="size-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800 text-lg mb-1">
                  🚪 {t('emergency.evacuation').split(':')[0]}
                </h3>
                <p className="text-green-700">{t('emergency.evacuation').split(':').slice(1).join(':')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Evacuation Map */}
        <Card className="border-red-200">
          <CardHeader className="bg-red-50 border-b border-red-200">
            <CardTitle className="text-red-800 flex items-center gap-2">
              <MapPin className="size-5" />
              {t('emergency.evacuationMap')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <EmergencyMap />
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card className="border-red-200">
          <CardHeader className="bg-red-50 border-b border-red-200">
            <CardTitle className="text-red-800 flex items-center gap-2">
              <Phone className="size-5" />
              {t('emergency.contacts')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-sm text-red-600 mb-4 flex items-center gap-2">
              <Info className="size-4" />
              {t('emergency.callInstructions')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Ambulance */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center">
                  <Phone className="size-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-blue-800">{t('emergency.ambulance')}</h3>
                <p className="text-2xl font-bold text-blue-900 mt-1">106</p>
              </div>

              {/* Police */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-green-100 flex items-center justify-center">
                  <Phone className="size-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-green-800">{t('emergency.police')}</h3>
                <p className="text-2xl font-bold text-green-900 mt-1">105</p>
              </div>

              {/* Fire */}
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-orange-100 flex items-center justify-center">
                  <Flame className="size-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-orange-800">{t('emergency.fireDept')}</h3>
                <p className="text-2xl font-bold text-orange-900 mt-1">107</p>
              </div>
            </div>

            {/* Hospital Emergency */}
            <div className="mt-4 p-4 bg-red-100 rounded-lg border border-red-300">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="size-6 text-red-600" />
                  <div>
                    <h3 className="font-semibold text-red-800">Urgencias del Hospital</h3>
                    <p className="text-sm text-red-600">{t('emergency.instructions')}</p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="lg"
                  className="gap-2"
                  onClick={() => window.open('tel:+56225678900')}
                >
                  <Phone className="size-4" />
                  {t('emergency.callNow')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Floor-specific instructions */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
              <MapPin className="size-5" />
              {t('emergency.findYourExit')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-white rounded-lg border border-amber-200">
                <Badge variant="outline" className="mb-2 bg-amber-100 text-amber-800 border-amber-300">
                  {t('emergency.floor1')}
                </Badge>
                <p className="text-amber-700">
                  {t('emergency.nearestExit')}: {t('map.floor1')} — {t('emergency.evacuation')}
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-amber-200">
                <Badge variant="outline" className="mb-2 bg-amber-100 text-amber-800 border-amber-300">
                  {t('emergency.floor2')}
                </Badge>
                <p className="text-amber-700">
                  {t('emergency.nearestExit')}: {t('emergency.evacuationRoute')} — {t('map.floor2')} → {t('map.floor1')}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-amber-700 flex items-start gap-2">
              <AlertTriangle className="size-4 flex-shrink-0 mt-0.5" />
              {t('emergency.ifTrapped')}
            </p>
          </CardContent>
        </Card>

        {/* Back to home button */}
        <div className="pb-8">
          <Link href="/">
            <Button
              variant="outline"
              size="lg"
              className="w-full gap-2 border-red-200 text-red-600 hover:bg-red-50"
            >
              <ArrowLeft className="size-4" />
              {t('emergency.backToHome')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}