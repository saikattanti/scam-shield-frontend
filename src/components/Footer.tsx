import React from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Live Map', href: '#map' },
      { label: 'Contact', href: '#contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Refund Policy', href: '#' },
    ],
  },
  {
    title: 'Social',
    links: [
      { label: 'Twitter', href: '#' },
      { label: 'LinkedIn', href: '#' },
      { label: 'GitHub', href: '#' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-white border-t border-slate-100 overflow-hidden" id="contact">
      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-14 pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

          {/* Brand column */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="bg-slate-900 p-1.5 rounded-lg group-hover:bg-slate-700 transition-colors duration-200">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-slate-900">
                ScamShield<span className="text-blue-600">.</span>
              </span>
            </Link>

            <div className="text-[13px] text-slate-400 leading-relaxed">
              <p>Copyright © {new Date().getFullYear()} ScamShield Labs</p>
              <p className="mt-0.5">All rights reserved</p>
            </div>
          </div>

          {/* Links columns */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footerLinks.map((group) => (
              <div key={group.title} className="flex flex-col gap-4">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                  {group.title}
                </p>
                <ul className="flex flex-col gap-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-500 hover:text-slate-900 transition-colors duration-150 font-medium"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Giant watermark — sits at the very bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none flex items-end justify-center"
        style={{ height: '130px' }}
      >
        <span
          className="block font-black leading-none tracking-tighter text-slate-100 whitespace-nowrap"
          style={{ fontSize: 'clamp(60px, 13vw, 180px)', lineHeight: 0.82 }}
        >
          SCAMSHIELD
        </span>
      </div>
    </footer>
  );
}
