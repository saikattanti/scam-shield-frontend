"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function TermsPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="max-w-4xl mx-auto px-4 py-14 space-y-6">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600">{t('nav_terms')}</p>
        <h1 className="text-4xl font-black tracking-tight">{t('terms_title')}</h1>
        <p className="text-slate-600 leading-relaxed">
          {t('terms_p1')}
        </p>
        <p className="text-slate-600 leading-relaxed">
          {t('terms_p2')}
        </p>
      </section>
    </main>
  );
}
