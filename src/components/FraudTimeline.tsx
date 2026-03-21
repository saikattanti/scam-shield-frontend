'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, FileText, Copy, CheckCheck, Loader2, AlertOctagon, ChevronDown } from 'lucide-react';
import SlideArrowButton from '@/components/ui/slide-arrow-button';

const ACTION_OPTIONS = [
  { id: 'otp', label: 'Shared OTP', icon: '🔑' },
  { id: 'money', label: 'Transferred Money', icon: '💸' },
  { id: 'link', label: 'Clicked a Link', icon: '🔗' },
  { id: 'app', label: 'Installed an App', icon: '📱' },
  { id: 'aadhar', label: 'Shared Aadhaar/PAN', icon: '🪪' },
  { id: 'password', label: 'Gave Password', icon: '🔒' },
  { id: 'call', label: 'Was on a Call', icon: '📞' },
  { id: 'none', label: 'None — Just Received', icon: '📩' },
];

const PLATFORM_OPTIONS = [
  'UPI / PhonePe / Google Pay',
  'WhatsApp',
  'Email',
  'SMS / Text Message',
  'Phone Call',
  'Job Portal (Naukri / LinkedIn)',
  'Facebook / Instagram',
  'OLX / Quikr',
  'Telegram',
  'Other',
];

export default function FraudTimeline() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [when, setWhen] = useState('');
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [platform, setPlatform] = useState('');
  const [situation, setSituation] = useState('');
  const [amountLost, setAmountLost] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ summary: string; urgency: string; hoursSince: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const toggleAction = (id: string) => {
    setSelectedActions(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (!when && !situation) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          when,
          actions: selectedActions,
          platform,
          situation,
          amountLost,
        }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      console.error('Timeline generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.summary) return;
    navigator.clipboard.writeText(result.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const urgencyColor = (urgency: string) =>
    urgency.includes('CRITICAL') ? 'bg-red-50 border-red-200 text-red-700' :
    urgency.includes('URGENT') ? 'bg-orange-50 border-orange-200 text-orange-700' :
    urgency.includes('IMPORTANT') ? 'bg-amber-50 border-amber-200 text-amber-700' :
    'bg-slate-50 border-slate-200 text-slate-600';

  const canProceed1 = !!when || !!situation;
  const canProceed2 = selectedActions.length > 0;
  const canGenerate = (!!when || !!situation);

  return (
    <div className="mt-8">
      {/* Trigger */}
      {!isOpen && !result && (
        <SlideArrowButton
          onClick={() => setIsOpen(true)}
          text="Build Timeline"
          primaryColor="#7c3aed"
          className="w-full border-violet-200"
        />
      )}

      <AnimatePresence>
        {isOpen && !result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 rounded-xl p-2">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base">Fraud Incident Timeline Builder</h3>
                    <p className="text-violet-200 text-xs">Generates a legal-ready cybercrime complaint summary</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white text-sm">✕</button>
              </div>

              {/* Progress */}
              <div className="flex gap-2 mt-4">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${step >= s ? 'bg-white' : 'bg-white/30'}`} />
                ))}
              </div>
              <div className="flex justify-between mt-1">
                {['When?', 'What happened?', 'Details'].map((label, i) => (
                  <span key={label} className={`text-[10px] font-semibold ${step >= i + 1 ? 'text-white' : 'text-white/40'}`}>
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div className="p-6 space-y-5">
              {/* Step 1: When */}
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}>
                    <h4 className="text-sm font-bold text-slate-900 mb-3">📅 When did this happen?</h4>
                    <input
                      type="datetime-local"
                      value={when}
                      onChange={e => setWhen(e.target.value)}
                      max={new Date().toISOString().slice(0, 16)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all bg-slate-50 hover:bg-white"
                    />
                    <p className="text-xs text-slate-400 mt-2">If unsure, enter an approximate time or skip to Step 3 and describe it</p>

                    <div className="flex gap-3 mt-4">
                      <SlideArrowButton onClick={() => setIsOpen(false)} text="Cancel" primaryColor="#64748b" className="flex-1 border-slate-200 scale-90" />
                      <SlideArrowButton onClick={() => setStep(2)} text="Next" primaryColor="#7c3aed" className="flex-1 border-violet-200 scale-90" />
                    </div>
                  </motion.div>
                )}

                {/* Step 2: What actions */}
                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}>
                    <h4 className="text-sm font-bold text-slate-900 mb-3">🎯 What did you do? <span className="text-slate-400 font-normal">(select all that apply)</span></h4>
                    <div className="grid grid-cols-2 gap-2">
                      {ACTION_OPTIONS.map((action) => (
                        <button
                          key={action.id}
                          onClick={() => toggleAction(action.id)}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-sm text-left transition-all ${
                            selectedActions.includes(action.id)
                              ? 'bg-violet-50 border-violet-300 text-violet-800 font-semibold'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-base">{action.icon}</span>
                          <span className="text-xs">{action.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-3 mt-4">
                      <SlideArrowButton onClick={() => setStep(1)} text="Back" primaryColor="#64748b" className="flex-1 border-slate-200 scale-90" />
                      <SlideArrowButton onClick={() => setStep(3)} text="Next" primaryColor="#7c3aed" className="flex-1 border-violet-200 scale-90" />
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Platform & Details */}
                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-900">📱 Final details</h4>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Which platform / channel?</label>
                      <div className="relative">
                        <select
                          value={platform}
                          onChange={e => setPlatform(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all appearance-none bg-slate-50 hover:bg-white pr-10"
                        >
                          <option value="">Select platform…</option>
                          {PLATFORM_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Brief description <span className="text-slate-400 font-normal">(optional but helps)</span></label>
                      <textarea
                        value={situation}
                        onChange={e => setSituation(e.target.value)}
                        rows={3}
                        placeholder="e.g. Someone called from SBI, said my account is blocked, asked for OTP..."
                        className="w-full border border-slate-200 rounded-xl p-3 text-slate-900 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all bg-slate-50 hover:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Amount Lost ₹ <span className="text-slate-400 font-normal">(optional)</span></label>
                      <input
                        type="number"
                        value={amountLost}
                        onChange={e => setAmountLost(e.target.value)}
                        placeholder="e.g. 12000"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all bg-slate-50 hover:bg-white"
                      />
                    </div>

                    <div className="flex gap-3 pt-1">
                      <SlideArrowButton onClick={() => setStep(2)} text="Back" primaryColor="#64748b" className="flex-1 border-slate-200 scale-90" />
                      <SlideArrowButton
                        onClick={handleGenerate}
                        disabled={!canGenerate || loading}
                        text={loading ? 'Generating' : 'Generate Legal Summary'}
                        primaryColor="#7c3aed"
                        className="flex-1 border-violet-200 scale-90 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Result */}
        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-xl p-2">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">Legal Incident Summary</h3>
                  <p className="text-violet-200 text-xs">Ready to paste into cybercrime.gov.in</p>
                </div>
              </div>
              <div className={`text-xs font-bold px-2 py-1 rounded border ${urgencyColor(result.urgency)}`}>
                {result.urgency.split('—')[0].trim()}
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Urgency notice */}
              <div className={`flex items-center gap-2 p-3 rounded-xl border ${urgencyColor(result.urgency)}`}>
                <AlertOctagon className="w-4 h-4 flex-shrink-0" />
                <p className="text-xs font-semibold">{result.urgency}</p>
              </div>

              {/* Summary text */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">
                  {result.summary}
                </pre>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <SlideArrowButton onClick={handleCopy} text={copied ? 'Copied!' : 'Copy to Clipboard'} primaryColor="#7c3aed" className="flex-1 border-violet-200" />
                <SlideArrowButton href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" text="File at cybercrime.gov.in" primaryColor="#dc2626" className="flex-1 border-red-200" />
              </div>

              <SlideArrowButton
                onClick={() => { setResult(null); setIsOpen(false); setStep(1); setWhen(''); setSelectedActions([]); setPlatform(''); setSituation(''); setAmountLost(''); }}
                text="Start Over"
                primaryColor="#64748b"
                className="w-full border-slate-200"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
