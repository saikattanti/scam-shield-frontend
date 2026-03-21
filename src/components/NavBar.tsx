'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as any);
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-slate-900 p-2 rounded-lg group-hover:bg-slate-800 transition-colors">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold tracking-tight text-slate-900">ScamShield<span className="text-blue-600">.</span></span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">{t('nav_home')}</Link>
            <Link href="#about" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">{t('nav_about')}</Link>
            {/* Native Instant Translation Menu */}
            <div className="flex items-center relative">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <select 
                value={language}
                onChange={handleLanguageChange}
                className="pl-9 pr-8 py-1.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent appearance-none cursor-pointer hover:bg-slate-50 text-sm transition-all shadow-sm"
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिन्दी (HI)</option>
                <option value="bn">বাংলা (BN)</option>
                <option value="ta">தமிழ் (TA)</option>
                <option value="te">తెలుగు (TE)</option>
                <option value="mr">मराठी (MR)</option>
                <option value="gu">ગુજરાતી (GU)</option>
                <option value="kn">ಕನ್ನಡ (KN)</option>
                <option value="ml">മലയാളം (ML)</option>
                <option value="pa">ਪੰਜਾਬੀ (PA)</option>
                <option value="ur">اردو (UR)</option>
                <option value="or">ଓଡ଼ିଆ (OR)</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <Link href="/check" className="text-sm font-semibold bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">{t('nav_check')}</Link>
              <Link href="/help" className="text-sm font-semibold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors">{t('nav_scammed')}</Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <div className="px-4 pt-2 pb-4 space-y-1 shadow-lg">
            <Link href="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50">{t('nav_home')}</Link>
            <Link href="#about" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50">{t('nav_about')}</Link>
            <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
              <Link href="/check" onClick={() => setIsOpen(false)} className="flex-1 text-center text-sm font-semibold bg-slate-900 text-white py-2.5 rounded-lg hover:bg-slate-800 transition-colors">{t('nav_check')}</Link>
              <Link href="/help" onClick={() => setIsOpen(false)} className="flex-1 text-center text-sm font-semibold text-red-600 border border-red-200 bg-red-50 py-2.5 rounded-lg">{t('nav_scammed')}</Link>
            </div>
            <div className="mt-3 flex justify-center w-full relative">
              <Globe className="w-4 h-4 text-slate-400 absolute left-4 top-2.5 pointer-events-none" />
              <select 
                value={language}
                onChange={(e) => { handleLanguageChange(e); setIsOpen(false); }}
                className="w-full pl-10 pr-6 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 appearance-none cursor-pointer text-sm shadow-sm"
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिन्दी (HI)</option>
                <option value="bn">বাংলা (BN)</option>
                <option value="ta">தமிழ் (TA)</option>
                <option value="te">తెలుగు (TE)</option>
                <option value="mr">मराठी (MR)</option>
                <option value="gu">ગુજરાતી (GU)</option>
                <option value="kn">ಕನ್ನಡ (KN)</option>
                <option value="ml">മലയാളം (ML)</option>
                <option value="pa">ਪੰਜਾਬੀ (PA)</option>
                <option value="ur">اردو (UR)</option>
                <option value="or">ଓଡ଼ିଆ (OR)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
