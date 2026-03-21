'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, Loader2, Upload, CheckCircle2, X } from 'lucide-react';

interface RecoveryResult {
  scamType: string;
  riskLevel: string;
  detectedSignals: string[];
  recoverySteps: string;
  platform: string | null;
}

interface Props {
  defaultOpen?: boolean;
}

export default function GotScammedAssistant({ defaultOpen = false }: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [situation, setSituation] = useState('');
  const [platform, setPlatform] = useState('');
  const [amountLost, setAmountLost] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecoveryResult | null>(null);

  const handleSubmit = async () => {
    if (!situation && !file) return;
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      if (situation) formData.append('situation', situation);
      if (platform) formData.append('platform', platform);
      if (amountLost) formData.append('amountLost', amountLost);
      if (file) formData.append('image', file);

      const response = await fetch('http://localhost:5000/api/analyze/assist', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Assist request failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSituation('');
    setPlatform('');
    setAmountLost('');
    setFile(null);
    setResult(null);
    setIsOpen(false);
  };

  return (
    <section id="got-scammed-section" className="mt-4">
      {/* Trigger Card — only show when not defaultOpen */}
      {!isOpen && !result && !defaultOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-red-300 hover:shadow-md transition-all group text-left"
        >
          <div className="flex-shrink-0 bg-red-50 border border-red-200 rounded-xl p-3 group-hover:bg-red-100 transition-colors">
            <AlertOctagon className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Already got scammed? Get a recovery plan</p>
            <p className="text-xs text-slate-500 mt-0.5">Describe your situation or upload a screenshot — we'll generate step-by-step help using AI</p>
          </div>
          <span className="ml-auto text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg group-hover:bg-red-100 flex-shrink-0">
            Get Help →
          </span>
        </button>
      )}

      {/* Open Form */}
      <AnimatePresence>
        {isOpen && !result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="w-full bg-white border border-slate-200/70 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-10 relative overflow-hidden"
          >
            {/* Subtle decorative background blur */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

            <div className="space-y-7 relative z-10">
              {/* Situation Description */}
              <div>
                <label className="block text-[13px] font-bold text-slate-700 tracking-wide mb-2.5">
                  WHAT HAPPENED?
                </label>
                
                {/* Test Data Chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest self-center mr-1">Demo Case:</span>
                  {[
                    { label: 'UPI/OLX Fraud', text: 'I sent ₹5,000 via GPay for a camera on OLX but the seller blocked me immediately.', platform: 'Google Pay', amount: '5000' },
                    { label: 'Bank OTP', text: 'Someone called from SBI and asked for my OTP to update KYC. I gave it and ₹12,000 was debited.', platform: 'SBI', amount: '12000' },
                    { label: 'Remote Access', text: 'I installed AnyDesk thinking it was for tech support, then my phone screen went black and I lost ₹2,000.', platform: 'PhonePe', amount: '2000' }
                  ].map((chip, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSituation(chip.text);
                        setPlatform(chip.platform);
                        setAmountLost(chip.amount);
                      }}
                      className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                <textarea
                  value={situation}
                  onChange={e => setSituation(e.target.value)}
                  rows={4}
                  placeholder="e.g. I received a call saying my SBI account is blocked and they asked for my OTP. I gave it and ₹25,000 was transferred..."
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl p-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 focus:bg-white transition-all resize-none text-[15px] leading-relaxed shadow-sm"
                />
              </div>

              {/* Platform + Amount Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 tracking-wide mb-2.5">
                    PLATFORM USED <span className="text-slate-400 font-normal">(OPTIONAL)</span>
                  </label>
                  <select
                    value={platform}
                    onChange={e => setPlatform(e.target.value)}
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-700 text-[15px] focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 focus:bg-white transition-all appearance-none cursor-pointer shadow-sm"
                  >
                    <option value="">Unknown</option>
                    <option value="PhonePe">PhonePe</option>
                    <option value="Google Pay">Google Pay</option>
                    <option value="Paytm">Paytm</option>
                    <option value="BHIM">BHIM UPI</option>
                    <option value="SBI">SBI / Net Banking</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 tracking-wide mb-2.5">
                    AMOUNT LOST ₹ <span className="text-slate-400 font-normal">(OPTIONAL)</span>
                  </label>
                  <input
                    type="number"
                    value={amountLost}
                    onChange={e => setAmountLost(e.target.value)}
                    placeholder="e.g. 25000"
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-900 text-[15px] hover:bg-white focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 focus:bg-white transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Screenshot Upload */}
              <div>
                <label className="block text-[13px] font-bold text-slate-700 tracking-wide mb-2.5">
                  UPLOAD EVIDENCE <span className="text-slate-400 font-normal">(SCREENSHOT)</span>
                </label>
                <div
                  onClick={() => document.getElementById('assist-file')?.click()}
                  className={`w-full border-2 border-dashed rounded-2xl p-7 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 group shadow-sm ${
                    file ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 bg-white'
                  }`}
                >
                  <div className={`p-3.5 rounded-full transition-colors duration-300 ${file ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-700'}`}>
                    <Upload className="w-6 h-6 flex-shrink-0" />
                  </div>
                  
                  <span className="text-[15px] font-medium text-slate-600 text-center px-4 truncate max-w-full group-hover:text-slate-900 transition-colors">
                    {file ? file.name : 'Click to upload or drag & drop file'}
                  </span>
                  
                  {file && (
                    <button
                      onClick={e => { e.stopPropagation(); setFile(null); }}
                      className="mt-1 text-xs font-bold text-red-500 flex items-center gap-1.5 hover:text-red-600 transition-colors bg-red-50 px-3 py-1 rounded-full"
                    >
                      <X className="w-3 h-3" /> Remove Selection
                    </button>
                  )}
                  <input
                    id="assist-file"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-3">
                <button
                  onClick={handleSubmit}
                  disabled={loading || (!situation && !file)}
                  className="w-full flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl text-[15px] transition-all shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] disabled:shadow-none active:scale-[0.99]"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Synthesizing AI Recovery Plan...</>
                  ) : (
                    <>Generate Intelligent Recovery Plan</>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recovery Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h3 className="font-semibold text-slate-900 text-base">Your Recovery Plan</h3>
                <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-0.5 rounded font-semibold">Gemini AI</span>
              </div>
              <button onClick={reset} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Scam Type:</span>
              <span className="text-xs font-semibold bg-red-50 border border-red-200 text-red-700 px-2 py-1 rounded">
                {result.scamType?.replace(/_/g, ' ')}
              </span>
              {result.platform && (
                <span className="text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-700 px-2 py-1 rounded">
                  via {result.platform}
                </span>
              )}
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {result.recoverySteps.split('\n').map((step, idx) => {
                const trimmed = step.trim();
                if (!trimmed) return null;
                return (
                  <div key={idx} className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="flex-shrink-0 w-6 h-6 bg-red-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-slate-800 leading-relaxed font-medium">
                      {trimmed.replace(/^\d+\.\s*/, '')}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-xs text-amber-800 font-semibold">⚠️ Emergency: Call 1930 (National Cyber Crime Helpline) immediately and file at cybercrime.gov.in</p>
            </div>

            <button
              onClick={reset}
              className="mt-4 w-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold py-2.5 rounded-xl text-sm transition-colors"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
