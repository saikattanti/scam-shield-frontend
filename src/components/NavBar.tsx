"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import StaggeredMenu from "./StaggeredMenu";
import UnifiedButton from "@/components/ui/unified-button";
import { ArrowRight } from "lucide-react";

export default function NavBar() {
  const { t } = useLanguage();

  const navButtonClass =
    "relative z-0 inline-flex items-center justify-center overflow-hidden rounded-[25px] border px-[15px] py-[5px] text-[17px] font-semibold text-[var(--btn-color)] transition-colors duration-300 delay-100 ease-out before:absolute before:inset-0 before:-left-[5em] before:z-[-1] before:m-auto before:block before:h-[20em] before:w-[20em] before:rounded-full before:content-[''] before:transition-[box-shadow] before:duration-500 before:ease-out hover:text-white hover:before:shadow-[inset_0_0_0_10em_var(--btn-color)]";

  const menuItems = [
    { label: t("nav_home") || "Home", ariaLabel: "Go to home page", link: "/" },
    {
      label: t("nav_about") || "About",
      ariaLabel: "Learn about us",
      link: "/about",
    },
    { label: "Community", ariaLabel: "Community", link: "#" },
    {
      label: t("nav_contact") || "Contact",
      ariaLabel: "Contact us",
      link: "/contact",
    },
  ];

  const socialItems = [
    { label: "Twitter", link: "https://twitter.com" },
    {
      label: "GitHub",
      link: "https://github.com/saikattanti/scam-shield-frontend",
    },
    { label: "LinkedIn", link: "https://www.linkedin.com" },
  ];

  return (
    <>
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials
        displayItemNumbering={false}
        menuButtonColor="#ffffff"
        openMenuButtonColor="#ffffff"
        changeMenuColorOnOpen={true}
        colors={["#ffffff", "#f8fafc", "#f1f5f9"]} // White/light theme background for menu
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
        centerActions={null}
        headerActions={
          <div className="hidden md:flex items-center gap-2">
            <UnifiedButton
              href="/check"
              text={t("nav_check") || "Check Scam"}
              variant="shimmer"
              className="scale-90 shadow-lg"
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            />
            <UnifiedButton
              href="/help"
              text={t("nav_scammed") || "Got Scammed?"}
              variant="glass"
              className="scale-90"
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            />
          </div>
        }
      >
        {/* Mobile Content inside StaggeredMenu Panel */}
        <div className="md:hidden flex flex-col gap-6 mt-4">
          <div className="flex flex-col gap-3">
            <UnifiedButton
              href="/check"
              text={t("nav_check") || "Check Scam"}
              variant="shimmer"
              className="w-full"
            />
            <UnifiedButton
              href="/help"
              text={t("nav_scammed") || "Got Scammed?"}
              variant="glass"
              className="w-full text-slate-900"
            />
          </div>
        </div>
      </StaggeredMenu>
    </>
  );
}
