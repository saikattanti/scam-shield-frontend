'use client';

import { motion } from 'framer-motion';

interface RiskDimension {
  label: string;
  score: number;       // 0–100
  weight: 'Critical' | 'High' | 'Medium' | 'Low';
  icon: string;
}

interface Props {
  signals: string[];
  score: number;
  risk: string;
  category: string;
}

function computeDimensions(signals: string[], score: number, category: string): RiskDimension[] {
  const s = signals.join(' ').toLowerCase();
  const cat = (category || '').toLowerCase();

  // Urgency Manipulation
  let urgencyScore =
    (s.includes('urgent') || s.includes('urgency') || s.includes('immediately') || s.includes('24 hours') || s.includes('expire')) ? 80 :
    (s.includes('pressure') || s.includes('act now') || s.includes('today only')) ? 65 : 15;

  // Identity Spoofing
  let spoofScore =
    (s.includes('phishing') || s.includes('typosquat') || s.includes('impersonat') || cat.includes('phishing') || cat.includes('impersonation')) ? 90 :
    (s.includes('bank') && (s.includes('fake') || s.includes('fake'))) ? 70 :
    (s.includes('kyc') || s.includes('aadhaar') || s.includes('pan')) ? 70 : 20;

  // Financial Threat
  let financeScore =
    (cat.includes('upi') || cat.includes('banking') || s.includes('transaction') || s.includes('debit') || s.includes('transfer')) ? 85 :
    (s.includes('money') || s.includes('₹') || s.includes('rupee') || s.includes('lakh') || s.includes('fee')) ? 65 :
    (s.includes('lottery') || s.includes('prize') || s.includes('reward')) ? 60 : 20;

  // Link Safety
  let linkScore =
    (s.includes('critical') && (s.includes('ip address') || s.includes('phishing domain') || s.includes('shortlink resolve'))) ? 100 :
    (s.includes('sandboxing') || s.includes('password form') || s.includes('http') || s.includes('credential')) ? 85 :
    (s.includes('shortener') || s.includes('bit.ly') || s.includes('url shortener') || s.includes('suspicious domain')) ? 70 :
    (s.includes('url') || s.includes('link') || s.includes('domain')) ? 50 : 5;

  // Social Engineering
  let socialScore =
    (s.includes('job scam') || cat.includes('job') || s.includes('work from home') || s.includes('earn')) ? 80 :
    (s.includes('romance') || cat.includes('romance') || s.includes('lottery') || cat.includes('lottery')) ? 75 :
    (s.includes('keyword') || s.includes('suspicious language') || s.includes('manipulation')) ? 55 : 15;

  // CONSTRAINT LOGIC: Ensure visual dimensions mathematically align with the truth
  // If the ML engine says it's safe (e.g. 0-20), visually cap the dimensions.
  const maxAllowed = Math.max(score + 15, 10);
  
  urgencyScore = Math.min(urgencyScore, maxAllowed);
  spoofScore = Math.min(spoofScore, maxAllowed);
  financeScore = Math.min(financeScore, maxAllowed);
  linkScore = Math.min(linkScore, maxAllowed);
  socialScore = Math.min(socialScore, maxAllowed);

  // Aggressively squash for perfectly safe 0-score inputs
  if (score === 0) {
    urgencyScore = 0;
    spoofScore = 0;
    financeScore = 0;
    linkScore = 0;
    socialScore = 0;
  } else if (score < 5) {
    urgencyScore = Math.min(urgencyScore, 8);
    spoofScore = Math.min(spoofScore, 5);
    financeScore = Math.min(financeScore, 6);
    linkScore = Math.min(linkScore, 2);
    socialScore = Math.min(socialScore, 7);
  }

  return [
    { label: 'Urgency Manipulation', score: urgencyScore, weight: urgencyScore > 70 ? 'High' : urgencyScore > 40 ? 'Medium' : 'Low', icon: '⏰' },
    { label: 'Identity Spoofing', score: spoofScore, weight: spoofScore > 70 ? 'Critical' : spoofScore > 40 ? 'High' : 'Low', icon: '🎭' },
    { label: 'Financial Threat', score: financeScore, weight: financeScore > 70 ? 'Critical' : financeScore > 40 ? 'High' : 'Low', icon: '💰' },
    { label: 'Link Safety', score: linkScore, weight: linkScore > 80 ? 'Critical' : linkScore > 50 ? 'High' : linkScore > 20 ? 'Medium' : 'Low', icon: '🔗' },
    { label: 'Social Engineering', score: socialScore, weight: socialScore > 70 ? 'High' : socialScore > 40 ? 'Medium' : 'Low', icon: '🧠' },
  ];
}

const barColor = (score: number) => {
  if (score >= 80) return 'bg-red-500';
  if (score >= 60) return 'bg-orange-400';
  if (score >= 35) return 'bg-amber-400';
  return 'bg-emerald-400';
};

const badgeStyle = (weight: string) => {
  switch (weight) {
    case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
    case 'High':     return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'Medium':   return 'bg-amber-100 text-amber-700 border-amber-200';
    default:         return 'bg-slate-100 text-slate-500 border-slate-200';
  }
};

export default function RiskBreakdown({ signals, score, risk, category }: Props) {
  const dimensions = computeDimensions(signals, score, category);

  const overallColor =
    risk === 'Critical' ? 'text-red-600' :
    risk === 'High' ? 'text-orange-500' :
    risk === 'Medium' ? 'text-amber-500' : 'text-emerald-500';

  const ringColor =
    risk === 'Critical' ? 'ring-red-200 bg-red-50' :
    risk === 'High' ? 'ring-orange-200 bg-orange-50' :
    risk === 'Medium' ? 'ring-amber-200 bg-amber-50' : 'ring-emerald-200 bg-emerald-50';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Risk Score Breakdown</p>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ring-1 ${ringColor}`}>
          <span className={`text-sm font-black ${overallColor}`}>{score}/100</span>
          <span className={`text-xs font-bold ${overallColor}`}>{risk.toUpperCase()}</span>
        </div>
      </div>

      <div className="space-y-3">
        {dimensions.map((dim, i) => (
          <motion.div
            key={dim.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className="flex items-center gap-3"
          >
            <span className="text-base w-5 text-center flex-shrink-0">{dim.icon}</span>
            <span className="text-xs font-medium text-slate-600 w-36 flex-shrink-0 truncate">{dim.label}</span>
            <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
              <motion.div
                className={`h-2 rounded-full ${barColor(dim.score)}`}
                initial={{ width: '0%' }}
                animate={{ width: `${dim.score}%` }}
                transition={{ delay: i * 0.08 + 0.2, duration: 0.6, ease: 'easeOut' }}
              />
            </div>
            <span className="text-xs font-bold text-slate-500 w-8 text-right flex-shrink-0">{dim.score}%</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border flex-shrink-0 ${badgeStyle(dim.weight)}`}>
              {dim.weight}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
