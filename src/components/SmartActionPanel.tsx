/* eslint-disable */
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink, Phone, Mail, Globe,
  ShieldAlert, MapPin, Smartphone, ChevronDown, ChevronUp,
  CheckSquare, Square, Clock, Building2, AlertTriangle, Copy, Check
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type GovPortalLink = {
  label: string;
  description: string;
  url: string;
  tag: string;
  icon: string;
  color: string;
};

type LocalPolice = {
  city: string;
  state: string;
  unit: string;
  phones: string[];
  email: string | null;
  website: string;
  address: string;
  isDetected: boolean;
};

type PlatformSupport = {
  name: string;
  logo: string;
  phone: string;
  supportUrl: string;
  escalationUrl: string;
  inAppPath: string;
};

type Urgency = {
  level: 'critical' | 'high';
  message: string;
  subtext: string;
  callNow: string;
};

export type SmartActions = {
  govPortal: GovPortalLink[];
  localPolice: LocalPolice;
  platformSupport: PlatformSupport[];
  evidenceChecklist: string[];
  urgency: Urgency | null;
};

// ─── Color map ────────────────────────────────────────────────────────────────

const TAG_COLORS: Record<string, string> = {
  red:    'bg-red-50 border-red-200 text-red-700',
  pink:   'bg-pink-50 border-pink-200 text-pink-700',
  purple: 'bg-purple-50 border-purple-200 text-purple-700',
  blue:   'bg-blue-50 border-blue-200 text-blue-700',
  slate:  'bg-slate-50 border-slate-200 text-slate-700',
};

const TAG_BADGE: Record<string, string> = {
  red:    'bg-red-100 text-red-700',
  pink:   'bg-pink-100 text-pink-700',
  purple: 'bg-purple-100 text-purple-700',
  blue:   'bg-blue-100 text-blue-700',
  slate:  'bg-slate-100 text-slate-600',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="ml-2 text-slate-400 hover:text-slate-700 transition-colors" title="Copy">
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-black text-slate-800 tracking-tight">{title}</h4>
        {subtitle && <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SmartActionPanel({ actions }: { actions: SmartActions }) {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [evidenceOpen, setEvidenceOpen] = useState(false);

  const toggleCheck = (i: number) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="space-y-5"
    >

      {/* ══ URGENCY BANNER ══════════════════════════════════════════════════ */}
      {actions.urgency && (
        <div className={`rounded-[1.5rem] border p-6 flex items-start gap-4 ${
          actions.urgency.level === 'critical'
            ? 'bg-red-50 border-red-200'
            : 'bg-amber-50 border-amber-200'
        }`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            actions.urgency.level === 'critical' ? 'bg-red-100' : 'bg-amber-100'
          }`}>
            <Clock className={`w-5 h-5 ${actions.urgency.level === 'critical' ? 'text-red-600' : 'text-amber-600'}`} />
          </div>
          <div className="flex-1">
            <p className={`text-sm font-black ${actions.urgency.level === 'critical' ? 'text-red-800' : 'text-amber-800'}`}>
              ⏰ {actions.urgency.message}
            </p>
            <p className={`text-xs mt-1 ${actions.urgency.level === 'critical' ? 'text-red-600' : 'text-amber-600'}`}>
              {actions.urgency.subtext}
            </p>
          </div>
          <a
            href={`tel:${actions.urgency.callNow}`}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-white ${
              actions.urgency.level === 'critical' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'
            } transition-colors`}
          >
            <Phone className="w-3.5 h-3.5" />
            Call {actions.urgency.callNow}
          </a>
        </div>
      )}

      {/* ══ GOV PORTAL LINKS ══════════════════════════════════════════════ */}
      {actions.govPortal.length > 0 && (
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
          <SectionHeader
            icon={<ShieldAlert className="w-4.5 h-4.5 text-blue-600" />}
            title="Official Complaint Portal — cybercrime.gov.in"
            subtitle="Ministry of Home Affairs, Govt. of India. File your complaint directly on the correct page."
          />
          <div className="space-y-3">
            {actions.govPortal.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center gap-4 p-4 rounded-[1.25rem] border transition-all hover:shadow-sm ${TAG_COLORS[link.color] || TAG_COLORS.blue}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${TAG_BADGE[link.color] || TAG_BADGE.blue}`}>
                      {link.tag}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{link.label}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{link.description}</p>
                </div>
                <ExternalLink className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-slate-700 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ══ LOCAL CYBER POLICE ════════════════════════════════════════════ */}
      <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
        <SectionHeader
          icon={<Building2 className="w-4.5 h-4.5 text-emerald-600" />}
          title={actions.localPolice.isDetected
            ? `Local Cyber Crime HQ — ${actions.localPolice.city}`
            : 'National Cyber Crime Helpline'}
          subtitle={actions.localPolice.isDetected
            ? `Detected your location: ${actions.localPolice.city}, ${actions.localPolice.state}`
            : 'Your city was not detected. Using national helpline.'}
        />

        <div className="bg-slate-50 rounded-[1.25rem] border border-slate-100 p-5 space-y-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Unit</p>
            <p className="text-sm font-bold text-slate-800">{actions.localPolice.unit}</p>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Phone Numbers</p>
            <div className="flex flex-col gap-1.5">
              {actions.localPolice.phones.map((phone, i) => (
                <div key={i} className="flex items-center gap-2">
                  <a
                    href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                    className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-sm font-bold text-slate-800">{phone}</span>
                  </a>
                  <CopyButton text={phone} />
                </div>
              ))}
            </div>
          </div>

          {actions.localPolice.email && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Email</p>
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${actions.localPolice.email}`}
                  className="flex items-center gap-2 text-sm text-blue-600 font-bold hover:underline"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {actions.localPolice.email}
                </a>
                <CopyButton text={actions.localPolice.email} />
              </div>
            </div>
          )}

          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Address</p>
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
              <p className="text-xs text-slate-600 leading-relaxed">{actions.localPolice.address}</p>
            </div>
          </div>

          <a
            href={actions.localPolice.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-blue-600 font-bold hover:underline"
          >
            <Globe className="w-3.5 h-3.5" />
            {actions.localPolice.website.replace('https://', '')}
          </a>
        </div>
      </div>

      {/* ══ PLATFORM / APP SUPPORT ════════════════════════════════════════ */}
      {actions.platformSupport.length > 0 && (
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
          <SectionHeader
            icon={<Smartphone className="w-4.5 h-4.5 text-violet-600" />}
            title="In-App Fraud Support"
            subtitle="These platforms were detected in the scam. Contact them to dispute and flag the transaction."
          />
          <div className="space-y-4">
            {actions.platformSupport.map((platform, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 rounded-[1.25rem] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{platform.logo}</span>
                  <p className="text-sm font-black text-slate-800">{platform.name}</p>
                </div>

                <div className="space-y-2.5">
                  {/* In-App Instructions */}
                  <div className="bg-white rounded-xl border border-slate-200 px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">In-App Path</p>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">{platform.inAppPath}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`tel:${platform.phone.replace(/[^0-9]/g, '')}`}
                      className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call {platform.phone}
                    </a>
                    <a
                      href={platform.supportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Support Portal
                    </a>
                    <a
                      href={platform.escalationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-white border border-amber-200 hover:bg-amber-50 text-amber-700 text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Escalate Grievance
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ EVIDENCE CHECKLIST ════════════════════════════════════════════ */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <button
          onClick={() => setEvidenceOpen(!evidenceOpen)}
          className="w-full flex items-center justify-between p-8 text-left hover:bg-slate-50 transition-colors"
        >
          <SectionHeader
            icon={<CheckSquare className="w-4.5 h-4.5 text-amber-600" />}
            title="Evidence Checklist"
            subtitle="Collect these before filing. Tap to expand."
          />
          {evidenceOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
          )}
        </button>

        <AnimatePresence>
          {evidenceOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-8 pb-8">
                <div className="space-y-2">
                  {actions.evidenceChecklist.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => toggleCheck(i)}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
                        checkedItems.has(i)
                          ? 'bg-emerald-50 border border-emerald-200'
                          : 'bg-slate-50 border border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {checkedItems.has(i)
                          ? <CheckSquare className="w-4 h-4 text-emerald-600" />
                          : <Square className="w-4 h-4 text-slate-300" />
                        }
                      </div>
                      <p className={`text-xs leading-relaxed font-medium ${checkedItems.has(i) ? 'text-emerald-800 line-through' : 'text-slate-700'}`}>
                        {item}
                      </p>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-4 text-center">
                  {checkedItems.size}/{actions.evidenceChecklist.length} items collected
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  );
}
