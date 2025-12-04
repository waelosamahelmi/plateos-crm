import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useRestaurant } from '@/lib/restaurant-context';

export const ContactSection: React.FC = () => {
  const { t } = useLanguage();
  const { config } = useRestaurant();

  if (!config) {
    return (
      <section id="contact" className="py-16 bg-gray-50 dark:bg-stone-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>Loading contact information...</p>
          </div>
        </div>
      </section>
    );
  }

  // Format hours for display
  const formattedHours = Object.entries(config.hours.general).map(([day, hours]) => ({
    day: day.charAt(0).toUpperCase() + day.slice(1),
    ...hours
  }));

  // Group consecutive days with same hours
  const groupedHours = formattedHours.reduce((acc: any[], curr) => {
    if (curr.closed) {
      acc.push({ days: [curr.day], hours: t('Suljettu', 'Closed') });
      return acc;
    }

    const timeStr = `${curr.open} - ${curr.close}`;
    const lastGroup = acc[acc.length - 1];

    if (lastGroup && lastGroup.hours === timeStr) {
      lastGroup.days.push(curr.day);
    } else {
      acc.push({ days: [curr.day], hours: timeStr });
    }

    return acc;
  }, []);

  return (
    <section id="contact" className="py-16 bg-gray-50 dark:bg-stone-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('Ota yhteyttä', 'Contact Us')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t(
              'Ota meihin yhteyttä varausten, catering-palveluiden tai kysymysten osalta.',
              'Get in touch with us for reservations, catering, or any questions you may have.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                {t('Puhelin', 'Phone')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{config.phone}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{config.email}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {t('Osoite', 'Address')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">
                {config.address.street}<br />
                {config.address.postalCode} {config.address.city}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {t('Aukioloajat', 'Hours')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {groupedHours.map((group, index) => (
                  <p key={index}>
                    <span className="font-medium">
                      {group.days.length === 1
                        ? group.days[0]
                        : `${group.days[0]} - ${group.days[group.days.length - 1]}`
                      }:
                    </span>{' '}
                    {group.hours}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
