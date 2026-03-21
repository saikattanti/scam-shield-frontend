'use client';

import { AlertTriangle, ShieldAlert, Info } from 'lucide-react';

interface EvidenceRow {
  signal: string;
  type: string;
  weight: 'Critical' | 'High' | 'Medium' | 'Low';
  example?: string;
}

interface Props {
  signals: string[];
  category: string;
}

function classifySignal(signal: string): EvidenceRow {
  const s = signal.toLowerCase();

  // Critical signals
  if (s.includes('ip address') || s.includes('raw ip')) {
    return { signal, type: 'Raw IP URL', weight: 'Critical', example: 'http://192.168.1.55/login' };
  }
  if (s.includes('typosquat') || s.includes('phishing domain')) {
    return { signal, type: 'Fake Bank Domain', weight: 'Critical', example: 'sbi-kyc.xyz' };
  }
  if (s.includes('password form') || s.includes('credential')) {
    return { signal, type: 'Credential Harvesting', weight: 'Critical', example: 'Login form on HTTP page' };
  }
  if (s.includes('otp') || s.includes('one time')) {
    return { signal, type: 'OTP Request', weight: 'Critical', example: 'Asking for OTP = never legitimate' };
  }
  if (s.includes('aadhaar') || s.includes('aadhar') || s.includes('pan card')) {
    return { signal, type: 'PII Request', weight: 'Critical', example: 'Aadhaar / PAN harvesting' };
  }
  if (s.includes('resolves to') && s.includes('phishing')) {
    return { signal, type: 'Shortlink → Phishing', weight: 'Critical', example: 'bit.ly → fake-sbi.tk' };
  }
  if (s.includes('domain is only') || s.includes('days old') && s.includes('critical')) {
    return { signal, type: 'Brand New Domain', weight: 'Critical', example: '< 15 days old' };
  }
  if (s.includes('insecure (http)')) {
    return { signal, type: 'No SSL Encryption', weight: 'Critical', example: 'HTTP (not HTTPS)' };
  }

  // High signals
  if (s.includes('urgency') || s.includes('urgent') || s.includes('pressure') || s.includes('immediately')) {
    return { signal, type: 'Urgency Manipulation', weight: 'High', example: '"Act now", "Expire tonight"' };
  }
  if (s.includes('shortener') || s.includes('bit.ly') || s.includes('url shortener')) {
    return { signal, type: 'Suspicious Shortlink', weight: 'High', example: 'bit.ly/xyz hides real URL' };
  }
  if (s.includes('banking context') || s.includes('upi') || s.includes('suspicious intent')) {
    return { signal, type: 'Banking + Scam Intent', weight: 'High', example: 'UPI + urgency combination' };
  }
  if (s.includes('keyword')) {
    return { signal, type: 'Scam Keywords', weight: 'High', example: '"Free", "Win", "Claim now"' };
  }
  if (s.includes('confidence') && (s.includes('high') || s.includes('%'))) {
    return { signal, type: 'ML Detection', weight: 'High', example: 'AI model flagged' };
  }
  if (s.includes('ai model') || s.includes('distilbert')) {
    return { signal, type: 'ML Detection', weight: 'High', example: 'AI model flagged' };
  }
  if (s.includes('password form') || s.includes('login form')) {
    return { signal, type: 'Login Form', weight: 'High', example: 'Credential collection page' };
  }
  if (s.includes('title') && s.includes('bank')) {
    return { signal, type: 'Title Mismatch', weight: 'High', example: 'Claims "SBI" but fake domain' };
  }

  // Medium signals
  if (s.includes('new') || s.includes('recently registered') || s.includes('days ago')) {
    return { signal, type: 'New Domain', weight: 'Medium', example: 'Registered < 90 days ago' };
  }
  if (s.includes('uppercase') || s.includes('caps')) {
    return { signal, type: 'Abnormal Formatting', weight: 'Medium', example: 'ALL CAPS used for pressure' };
  }
  if (s.includes('suspicious tld') || s.includes('.tk') || s.includes('.xyz')) {
    return { signal, type: 'Suspicious TLD', weight: 'Medium', example: '.tk .xyz .top domains' };
  }
  if (s.includes('whois') || s.includes('privacy-protected') || s.includes('hidden')) {
    return { signal, type: 'Hidden Domain Owner', weight: 'Medium', example: 'WHOIS privacy protection' };
  }

  // Default / Low
  return { signal, type: 'General Warning', weight: 'Low', example: 'Verify independently' };
}

const weightIcon = (weight: string) => {
  if (weight === 'Critical') return <ShieldAlert className="w-3.5 h-3.5 text-red-500" />;
  if (weight === 'High') return <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />;
  return <Info className="w-3.5 h-3.5 text-amber-500" />;
};

const weightBadge = (weight: string) => {
  switch (weight) {
    case 'Critical': return 'bg-red-50 text-red-700 border-red-200 font-bold';
    case 'High':     return 'bg-orange-50 text-orange-700 border-orange-200 font-semibold';
    case 'Medium':   return 'bg-amber-50 text-amber-700 border-amber-200';
    default:         return 'bg-slate-50 text-slate-500 border-slate-200';
  }
};

export default function EvidenceTable({ signals, category }: Props) {
  if (!signals || signals.length === 0) return null;

  const rows = signals.map(classifySignal);

  // Sort: Critical first
  const sortOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
  rows.sort((a, b) => sortOrder[a.weight] - sortOrder[b.weight]);

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Explainable AI — Signal Breakdown</p>
        <span className="text-[10px] bg-violet-50 text-violet-600 border border-violet-200 px-1.5 py-0.5 rounded font-bold">
          {rows.filter(r => r.weight === 'Critical' || r.weight === 'High').length} high-risk signals
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-3 py-2 text-slate-500 font-semibold uppercase tracking-wider">Signal Type</th>
              <th className="text-left px-3 py-2 text-slate-500 font-semibold uppercase tracking-wider hidden sm:table-cell">Example</th>
              <th className="text-center px-3 py-2 text-slate-500 font-semibold uppercase tracking-wider">Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, i) => (
              <tr key={i} className={`${row.weight === 'Critical' ? 'bg-red-50/40' : row.weight === 'High' ? 'bg-orange-50/30' : ''} hover:bg-slate-50 transition-colors`}>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1.5">
                    {weightIcon(row.weight)}
                    <span className="font-medium text-slate-700">{row.type}</span>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-slate-500 hidden sm:table-cell">
                  {row.example && <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">{row.example}</span>}
                </td>
                <td className="px-3 py-2.5 text-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] ${weightBadge(row.weight)}`}>
                    {row.weight}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
