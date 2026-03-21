'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, Loader2, Upload, CheckCircle2, X, Phone, Search, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import SlideArrowButton from '@/components/ui/slide-arrow-button';
import SmartActionPanel, { SmartActions } from './SmartActionPanel';

interface RecoveryResult {
  scamType: string;
  riskLevel: string;
  detectedSignals: string[];
  recoverySteps: string;
  smartActions?: SmartActions | null;
  firDraft?: string;
  platform: string | null;
}

interface Props {
  defaultOpen?: boolean;
}

export default function GotScammedAssistant({ defaultOpen = true }: Props) {
  const { t } = useLanguage();
  const [situation, setSituation] = useState('');
  const [platform, setPlatform] = useState('');
  const [amountLost, setAmountLost] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecoveryResult | null>(null);
  const [userCity, setUserCity] = useState<string | null>(null);

  // Detect user city from IP on mount (client-side only, never stored)
  useState(() => {
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(data => { if (data?.city) setUserCity(data.city); })
      .catch(() => {});
  });

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

      const cityHeader: Record<string, string> = userCity ? { 'X-User-City': userCity } : {};

      const response = await fetch('http://localhost:5000/api/analyze/assist', {
        method: 'POST',
        headers: cityHeader,
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
    setResult(null);
  };

  const isIdle = !loading && !result;

  return (
    <div className={`flex flex-col lg:flex-row gap-6 w-full ${result ? 'items-start' : 'items-stretch'}`}>
      
      {/* ════ LEFT PANEL: THE INPUT WORKSPACE ════ */}
      <div className={`w-full lg:w-[420px] shrink-0 ${result ? 'sticky top-24' : ''}`}>
        
        {/* Soft UI Input Card */}
        <div className={`bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden p-6 pb-8 ${result ? '' : 'h-full'}`}>
          
          <div className="space-y-7 relative z-10">
            {/* Situation Description */}
            <div>
              <label className="block text-[13px] font-bold text-slate-700 tracking-wide mb-2.5">
                {t('form_label_what_happened')}
              </label>
              
              {/* Test Data Chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest self-center mr-1">{t('form_demo_case')}:</span>
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
                      setResult(null);
                    }}
                    className="text-[11px] font-bold bg-white hover:bg-slate-50 text-slate-700 py-1.5 px-3 rounded-md border border-slate-200 transition-colors"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              <textarea
                value={situation}
                onChange={e => setSituation(e.target.value)}
                rows={5}
                placeholder="e.g. I received a call saying my SBI account is blocked and they asked for my OTP. I gave it and ₹25,000 was transferred..."
                className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] p-5 text-slate-600 placeholder-slate-400 focus:outline-none focus:border-slate-200 focus:bg-white transition-all resize-none text-sm leading-relaxed"
              />
            </div>

            {/* Platform + Amount Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[13px] font-bold text-slate-700 tracking-wide mb-2.5">
                  {t('form_label_platform')}
                </label>
                <select
                  value={platform}
                  onChange={e => setPlatform(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] px-4 py-3.5 text-slate-600 text-sm focus:outline-none focus:border-slate-200 focus:bg-white transition-all appearance-none cursor-pointer"
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
                  {t('form_label_amount')} (₹)
                </label>
                <input
                  type="number"
                  value={amountLost}
                  onChange={e => setAmountLost(e.target.value)}
                  placeholder="e.g. 25000"
                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] px-4 py-3.5 text-sm text-slate-600 focus:outline-none focus:border-slate-200 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Screenshot Upload */}
            <div>
              <label className="block text-[13px] font-bold text-slate-700 tracking-wide mb-2.5">
                {t('form_label_evidence')}
              </label>
              <div
                onClick={() => document.getElementById('assist-file')?.click()}
                className={`w-full h-[140px] border-2 border-dashed rounded-[1.5rem] p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  file ? 'border-slate-200 bg-white' : 'border-slate-200/50 hover:bg-slate-100/50 bg-slate-50'
                }`}
              >
                {!file ? (
                  <>
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-2">
                       <Upload className="w-5 h-5 text-slate-400" />
                    </div>
                    <span className="text-sm font-bold text-slate-500">
                      {t('form_upload_screenshot')}
                    </span>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 w-full">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl shadow-sm flex items-center justify-center">
                       <Upload className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-bold text-slate-600 truncate max-w-[200px]">
                      {file.name}
                    </span>
                    <button
                      onClick={e => { e.stopPropagation(); setFile(null); }}
                      className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full flex gap-1 items-center"
                    >
                      <X className="w-3 h-3" /> {t('form_remove_selection')}
                    </button>
                  </div>
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
            <div className="flex justify-center pt-2">
              <SlideArrowButton
                onClick={handleSubmit}
                disabled={loading || (!situation && !file)}
                text={loading ? t('form_generating_recovery') : t('form_generate_recovery')}
                primaryColor="#dc2626"
                className="w-full max-w-85 border-red-200 disabled:opacity-60 disabled:cursor-not-allowed sm:w-auto sm:max-w-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ════ RIGHT PANEL: THE RESULTS WORKSPACE ════ */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          
          {/* STATE: IDLE */}
          {isIdle && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, position: 'absolute' }}
              className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-10 flex flex-col items-center justify-center text-center w-full h-full"
            >
              <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center mb-8">
                <Search className="w-10 h-10 text-red-300" />
              </div>
              <h3 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">{t('form_need_help_now')}</h3>
              <p className="text-sm text-slate-500 max-w-[400px] mb-10 leading-relaxed">
                Provide the details of your incident on the left. The Gemini AI engine will analyze exactly what type of scam it was, and instantly generate a 1-2-3 recovery protocol including official helpline numbers, app-specific blocking instructions, and legal reporting links.
              </p>
            </motion.div>
          )}

          {/* STATE: ANALYZING */}
          {loading && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-12 h-full flex flex-col items-center justify-center text-center w-full relative"
            >
              <div className="relative z-10">
                <div className="relative w-24 h-24 mb-10 mx-auto">
                  <div className="absolute inset-0 rounded-full border-[6px] border-slate-100" />
                  <div className="absolute inset-0 rounded-full border-[6px] border-t-red-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <AlertOctagon className="w-8 h-8 text-red-500 animate-pulse" />
                  </div>
                </div>

                <h3 className="text-2xl font-black text-slate-800 mb-3">{t('form_analyzing_recovery')}</h3>
                <p className="text-sm text-slate-500 mb-10 max-w-sm mx-auto">Gemini is pulling the exact reporting pipelines for your specific scam vector...</p>
              </div>
            </motion.div>
          )}

          {/* STATE: RESULTS */}
          {result && !loading && (
             <motion.div
             key="results"
             initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
             className="w-full space-y-6"
           >
             {/* HERO RESULT CARD */}
             <div className={`bg-slate-50 rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden`}>
               <div className={`bg-red-500 px-10 py-8 text-white relative flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden`}>
                 <div className="absolute -left-10 top-0 opacity-10 blur-xl">
                   <AlertOctagon className="w-[300px] h-[300px] translate-y-10" />
                 </div>

                 <div className="flex items-center gap-6 z-10 w-full">
                   <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center shadow-inner border border-white/30 shrink-0">
                     <ShieldCheck className="w-8 h-8 text-white" />
                   </div>
                   <div className="flex-1">
                     <div className="flex items-center justify-between w-full">
                        <h2 className="text-4xl font-black uppercase tracking-tighter shadow-sm mb-1 leading-none">
                          {t('form_recovery_plan')}
                        </h2>
                        <span className="bg-white/20 border border-white/30 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-sm self-start mt-2">
                          Extracted by Gemini
                        </span>
                     </div>
                     <div className="flex items-center gap-2 text-white font-medium text-sm pt-2 tracking-wide">
                        <span className="opacity-80">{t('form_scam_classification')}:</span> <span className="font-bold">{result.scamType?.replace(/_/g, ' ')}</span>
                        {result.platform && <span className="opacity-80 ml-2">via</span>} 
                        {result.platform && <span className="font-bold">{result.platform}</span>}
                     </div>
                   </div>
                 </div>
               </div>

               <div className="p-8 pb-10 bg-white">
                 <div className="flex items-center justify-between mb-4 mt-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('form_step_guidance')}</p>
                 </div>
                 
                 <div className="space-y-4">
                   {result.recoverySteps.split(/\|\|\|/).filter((s: string) => s.trim()).slice(0, 5).map((step: string, idx: number) => {
                     const parts = step.trim().split('\n').filter((p: string) => p.trim());
                     const title = parts[0].replace(/^(\d+\.\s*|🚨\s*|📞\s*|🧾\s*|🛑\s*|🧑‍⚖️\s*|⚠️\s*|\*\*)+|(\*\*)+$/g, '').trim();
                     const subItems = parts.slice(1);
                     return (
                       <div key={idx} className="flex gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 items-start">
                         <span className="flex-shrink-0 w-8 h-8 bg-red-600 text-white text-xs font-black rounded-full flex items-center justify-center shadow-sm mt-0.5">
                           {idx + 1}
                         </span>
                         <div className="flex-1">
                           <p className="text-[15px] text-slate-900 font-bold">
                             {title}
                           </p>
                           {subItems.length > 0 && (
                             <ul className="space-y-1.5 mt-2 flex flex-col">
                               {subItems.map((item, i) => {
                                 const cleanItem = item.replace(/^[-*•]\s*/, '').trim();
                                 if (!cleanItem) return null;
                                 return (
                                   <li key={i} className="text-[14px] text-slate-600 font-medium leading-relaxed flex items-start gap-2">
                                     <span className="text-slate-300 mt-[2px] text-lg leading-none">•</span> 
                                     <span>{cleanItem}</span>
                                   </li>
                                 );
                               })}
                             </ul>
                           )}
                         </div>
                       </div>
                     );
                   })}
                 </div>

                 {result.smartActions && (
                   <div className="mt-8 mb-2">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 pl-1">Emergency Action Centre</p>
                     <SmartActionPanel actions={result.smartActions} />
                   </div>
                 )}

                 {result.firDraft && (
                   <div className="mt-8 mb-2">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 pl-1">Pre-filled Police Complaint (Copy Code)</p>
                     <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative group">
                       <button
                         onClick={() => navigator.clipboard.writeText(result.firDraft || '')}
                         className="absolute top-4 right-4 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                       >
                         Copy to Clipboard
                       </button>
                       <pre className="text-[13px] text-slate-700 font-mono whitespace-pre-wrap leading-relaxed">
                         {result.firDraft}
                       </pre>
                     </div>
                   </div>
                 )}

                 <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                   <div>
                     <p className="text-red-900 font-bold text-lg mb-1">{t('form_official_timeline')}</p>
                     <p className="text-sm text-red-700 font-medium">Reporting to Cyber Crime within the "Golden Hour" maximizes fund recovery chances by freezing the fraudster's intermediate accounts.</p>
                   </div>
                   <SlideArrowButton href="tel:1930" text="Call 1930" primaryColor="#dc2626" className="border-red-200" />
                 </div>

               </div>
             </div>
           </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
