"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, Globe, Menu, X } from "lucide-react";
import { Language, useLanguage } from "@/context/LanguageContext";
import StaggeredMenu from "./StaggeredMenu";

export default function NavBar() {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  const navButtonClass =
    "relative z-0 inline-flex items-center justify-center overflow-hidden rounded-[25px] border px-[15px] py-[5px] text-[17px] font-semibold text-[var(--btn-color)] transition-colors duration-300 delay-100 ease-out before:absolute before:inset-0 before:-left-[5em] before:z-[-1] before:m-auto before:block before:h-[20em] before:w-[20em] before:rounded-full before:content-[''] before:transition-[box-shadow] before:duration-500 before:ease-out hover:text-white hover:before:shadow-[inset_0_0_0_10em_var(--btn-color)]";

  const menuItems = [
    { label: t("nav_home") || 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: t("nav_about") || 'About', ariaLabel: 'Learn about us', link: '/about' },
    { label: 'Community', ariaLabel: 'Community', link: '#' },
    { label: t("nav_contact") || 'Contact', ariaLabel: 'Contact us', link: '/contact' }
  ];

  const socialItems = [
    { label: 'Twitter', link: '#' },
    { label: 'GitHub', link: '#' },
    { label: 'LinkedIn', link: '#' }
  ];

  return (
    <>
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials
        displayItemNumbering={true}
        menuButtonColor="#0f172a"
        openMenuButtonColor="#0f172a"
        changeMenuColorOnOpen={true}
        colors={['#ffffff', '#f8fafc', '#f1f5f9']} // White/light theme background for menu
        isFixed={true}
        accentColor="#2563eb"
        logoUrl={
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-slate-900 p-1.5 rounded-lg group-hover:bg-slate-800 transition-colors">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 transition-colors break-keep whitespace-nowrap">
              ScamShield<span className="text-blue-600">.</span>
            </span>
          </Link>
        }
        centerActions={
          <>
            <Link
              href="/check"
              className={navButtonClass + " scale-90 whitespace-nowrap"}
              style={{ "--btn-color": "rgb(15, 23, 42)" } as React.CSSProperties}
            >
              <span className="mx-[10px] break-keep">{t("nav_check") || "Check Scam"}</span>
            </Link>
            <Link
              href="/help"
              className={navButtonClass + " scale-90 whitespace-nowrap"}
              style={{ "--btn-color": "rgb(220, 38, 38)" } as React.CSSProperties}
            >
              <span className="mx-[10px] break-keep">{t("nav_scammed") || "Got Scammed?"}</span>
            </Link>
          </>
        }
        headerActions={
          <div className="hidden md:flex items-center gap-2">
            <div className="mr-2 pr-3 border-r border-slate-200/50 flex items-center relative">
              <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-6 pointer-events-none" />
              <select
                value={language}
                onChange={handleLanguageChange}
                className="w-[140px] pl-9 pr-4 py-1.5 bg-transparent text-slate-700 font-bold rounded-md focus:outline-none appearance-none cursor-pointer hover:bg-slate-100/40 text-xs transition-all"
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
        }
      >
        {/* Mobile Content inside StaggeredMenu Panel */}
        <div className="md:hidden flex flex-col gap-6 mt-4">
          <div className="flex flex-col gap-3">
            <Link
              href="/check"
              className={navButtonClass + " w-full"}
              style={{ "--btn-color": "rgb(15, 23, 42)" } as React.CSSProperties}
            >
              <span className="mx-[10px]">{t("nav_check") || "Check Scam"}</span>
            </Link>
            <Link
              href="/help"
              className={navButtonClass + " w-full"}
              style={{ "--btn-color": "rgb(220, 38, 38)" } as React.CSSProperties}
            >
              <span className="mx-[10px]">{t("nav_scammed") || "Got Scammed?"}</span>
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Language</p>
            <div className="relative mt-2">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
              <select
                value={language}
                onChange={handleLanguageChange}
                className="w-full pl-10 py-3 bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-900 font-medium rounded-xl appearance-none cursor-pointer text-sm outline-none transition-colors"
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
      </StaggeredMenu>
    </>
  );
}
