"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="max-w-4xl mx-auto px-4 py-14 space-y-6">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600">{t('nav_contact')}</p>
        <h1 className="text-4xl font-black tracking-tight">{t('contact_title')}</h1>
        <p className="text-slate-600 leading-relaxed">{t('contact_p1')}</p>
        <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50 space-y-2">
          <p className="text-sm text-slate-700"><span className="font-semibold">{t('contact_helpline')}:</span> 1930</p>
          <p className="text-sm text-slate-700"><span className="font-semibold">{t('contact_portal')}:</span> cybercrime.gov.in</p>
          <p className="text-sm text-slate-700"><span className="font-semibold">{t('contact_email')}:</span> support@scamshield.in</p>
        </div>
      </section>
    </main>
  );
}
