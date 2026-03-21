'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Link as LinkIcon, Image as ImageIcon, Search, Loader2, Volume2, ShieldAlert, ShieldCheck, AlertTriangle, Mic, Lock, X } from 'lucide-react';
import CategoryBadge from './CategoryBadge';
import { useLanguage } from '@/context/LanguageContext';

type InputType = 'text' | 'url' | 'image' | 'audio';

type AnalysisResult = {
    score: number;
    risk: string;
    category: string;
    recommendation: string;
    signals: string[];
    language?: string;
    mlPowered?: boolean;
    aiConfidence?: number;
    analysisId?: string;
    aiSteps?: string | null;
    transcribedText?: string;
} | null;

export default function InputForm() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<InputType>('text');
    const [inputText, setInputText] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [feedbackLoading, setFeedbackLoading] = useState(false);

    // Audio text-to-speech for low-literacy users
    const speakResult = () => {
        if (!analysisResult) return;
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(analysisResult.recommendation);
        // Best effort to map locale to voice (demo)
        utterance.lang = analysisResult.language === 'hindi' ? 'hi-IN' : 'en-US';
        synth.speak(utterance);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (['text', 'url'].includes(activeTab) && !inputText) return;
        if (['image', 'audio'].includes(activeTab) && !selectedFile) return;

        setIsAnalyzing(true);
        setAnalysisResult(null);

        try {
            let response;
            if (activeTab === 'image' && selectedFile) {
                const formData = new FormData();
                formData.append('image', selectedFile);
                response = await fetch('http://127.0.0.1:5000/api/analyze/image', {
                    method: 'POST',
                    body: formData,
                });
            } else if (activeTab === 'audio' && selectedFile) {
                const formData = new FormData();
                formData.append('audio', selectedFile);
                response = await fetch('http://127.0.0.1:5000/api/analyze/audio', {
                    method: 'POST',
                    body: formData,
                });
            } else {
                response = await fetch('http://127.0.0.1:5000/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: activeTab, content: inputText }),
                });
            }

            const data = await response.json();
            if (data.error) throw new Error(data.error);
            setAnalysisResult(data);
            setFeedbackSubmitted(false); // Reset feedback for new analysis
        } catch (error: any) {
            console.error('Analysis failed:', error);
            alert(error.message || "Analysis failed. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const submitFeedback = async (isAccurate: boolean) => {
        if (!analysisResult || !analysisResult.analysisId) return;
        
        setFeedbackLoading(true);
        try {
            await fetch('http://127.0.0.1:5000/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    analysisId: analysisResult.analysisId,
                    isAccurate,
                    content: inputText,
                    predictedCategory: analysisResult.category,
                    predictedScore: analysisResult.score,
                }),
            });
            setFeedbackSubmitted(true);
        } catch (error) {
            console.error('Feedback submission failed:', error);
        } finally {
            setFeedbackLoading(false);
        }
    };

    const tabs = [
        { id: 'text', label: t('tab_text'), icon: MessageSquare },
        { id: 'url', label: t('tab_url'), icon: LinkIcon },
        { id: 'image', label: t('tab_image'), icon: ImageIcon },
        { id: 'audio', label: 'Audio Scan', icon: Mic },
    ];

    return (
        <div className="w-full relative z-10 transition-colors duration-500">
            {/* Simple Title replacing the Hero */}
            <div className="text-center mb-10">
               <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-3">{t('hero_title')}</h1>
               <p className="text-base md:text-lg text-slate-500 font-normal max-w-2xl mx-auto leading-relaxed">{t('hero_subtitle')}</p>
            </div>

            <div className={`border rounded-2xl shadow-sm p-6 md:p-8 transition-colors duration-500 ${
                analysisResult?.risk === 'Critical' || analysisResult?.risk === 'High' ? 'bg-white border-t-4 border-t-red-500 border-x-slate-200 border-b-slate-200' :
                analysisResult?.risk === 'Low' ? 'bg-white border-t-4 border-t-emerald-500 border-x-slate-200 border-b-slate-200' :
                analysisResult ? 'bg-white border-t-4 border-t-amber-500 border-x-slate-200 border-b-slate-200' : 'bg-white border-slate-200'
            }`}>
                
                {/* Visual Status Header - OVERRIDES TABS WHEN ANALYZED */}
                {analysisResult && (
                    <div className="flex flex-col items-center justify-center text-center space-y-4 mb-8">
                        {analysisResult.risk === 'Critical' || analysisResult.risk === 'High' ? (
                            <>
                                <ShieldAlert className="w-16 h-16 text-red-500 animate-pulse" />
                                <h2 className="text-3xl font-bold tracking-tight text-red-600">{t('result_danger')}</h2>
                            </>
                        ) : analysisResult.risk === 'Low' ? (
                            <>
                                <ShieldCheck className="w-16 h-16 text-emerald-500" />
                                <h2 className="text-3xl font-bold tracking-tight text-emerald-600">{t('result_safe')}</h2>
                            </>
                        ) : (
                            <>
                                <AlertTriangle className="w-16 h-16 text-amber-500" />
                                <h2 className="text-3xl font-bold tracking-tight text-amber-600">{t('result_caution')}</h2>
                            </>
                        )}
                        
                        <button 
                            onClick={speakResult}
                            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-md text-sm font-semibold border border-slate-200 transition-colors"
                        >
                            <Volume2 className="w-4 h-4" />
                            {t('listen_btn')}
                        </button>
                    </div>
                )}

                {/* Hide Input Form entirely when showing result to maintain strict single-focus UX */}
                {!analysisResult && (
                    <>
                        {/* Tabs */}
                        <div className="flex space-x-1 bg-slate-100/70 p-1 rounded-xl mb-6 border border-slate-200/60">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as InputType)}
                                    className={`flex-1 flex items-center justify-center py-2.5 text-sm md:text-base font-medium rounded-lg transition-all duration-200 ${
                                        activeTab === tab.id
                                        ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                        }`}
                                >
                                    <span className="mr-2 opacity-70"><tab.icon className="w-4 h-4" /></span>
                                    {tab.label.replace('📝 ', '').replace('🔗 ', '').replace('📸 ', '')}
                                </button>
                            ))}
                        </div>

                        {/* Input Area */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'text' && (
                                    <textarea
                                        className="w-full h-40 bg-white border border-slate-300 rounded-xl p-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all resize-none text-base shadow-sm"
                                        placeholder={t('input_text_placeholder')}
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                    />
                                )}
                                {activeTab === 'url' && (
                                    <input
                                        type="text"
                                        className="w-full h-14 bg-white border border-slate-300 rounded-xl px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all text-base shadow-sm"
                                        placeholder={t('input_url_placeholder')}
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                    />
                                )}
                            {activeTab === 'image' && (
                                <div className="space-y-4">
                                    <div 
                                        onClick={() => document.getElementById('file-upload')?.click()}
                                        className={`w-full h-40 border border-dashed rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${
                                            previewUrl ? 'border-slate-400 bg-slate-50' : 'border-slate-300 text-slate-500 hover:border-slate-400 hover:bg-slate-50'
                                        }`}
                                    >
                                        {previewUrl ? (
                                            <div className="relative w-full h-full p-2">
                                                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-md" />
                                                <div className="absolute inset-0 bg-slate-900/80 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                                    <p className="text-white font-medium text-sm">Change Image</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <ImageIcon className="w-8 h-8 mb-3 text-slate-400" />
                                                <p className="text-sm font-semibold text-slate-700">{t('upload_instruction')}</p>
                                                <p className="text-xs text-slate-500 mt-1">{t('upload_sub')}</p>
                                            </>
                                        )}
                                        <input 
                                            id="file-upload"
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    {selectedFile && (
                                        <div className="flex items-center justify-between bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                                            <span className="text-xs font-medium text-blue-700 truncate max-w-[200px]">
                                                📎 {selectedFile.name}
                                            </span>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedFile(null);
                                                    setPreviewUrl(null);
                                                }}
                                                className="text-xs text-red-600 hover:text-red-800 font-bold"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'audio' && (
                                <div className="space-y-4">
                                    <div 
                                        onClick={() => document.getElementById('audio-upload')?.click()}
                                        className={`w-full h-40 border border-dashed rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${
                                            selectedFile ? 'border-indigo-400 bg-indigo-50' : 'border-slate-300 text-slate-500 hover:border-indigo-400 hover:bg-indigo-50/50'
                                        }`}
                                    >
                                        {selectedFile ? (
                                            <div className="flex flex-col items-center">
                                                <Volume2 className="w-10 h-10 text-indigo-600 animate-pulse mb-2" />
                                                <p className="text-sm font-bold text-slate-900">{selectedFile.name}</p>
                                                <p className="text-xs text-slate-500 mt-1">Ready to transcribe call</p>
                                            </div>
                                        ) : (
                                            <>
                                                <Mic className="w-8 h-8 mb-3 text-indigo-500" />
                                                <p className="text-sm font-semibold text-slate-700">Upload Call Audio</p>
                                                <p className="text-xs text-slate-500 mt-1">Accepts .mp3, .wav, or voice notes</p>
                                            </>
                                        )}
                                        <input 
                                            id="audio-upload"
                                            type="file" 
                                            className="hidden" 
                                            accept="audio/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) setSelectedFile(file);
                                            }}
                                        />
                                    </div>
                                    {selectedFile && (
                                        <div className="flex items-center justify-between bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-200">
                                            <div className="flex items-center gap-2">
                                                <Volume2 className="w-3 h-3 text-indigo-600" />
                                                <span className="text-xs font-medium text-indigo-700 truncate max-w-[200px]">
                                                    {selectedFile.name}
                                                </span>
                                            </div>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedFile(null);
                                                }}
                                                className="text-xs text-red-600 hover:text-red-800 font-bold"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                            </motion.div>
                    </AnimatePresence>
    
                    {/* Enterprise Testing Chips */}
                    <div className="mt-4 flex flex-wrap gap-2 items-center">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">Test Data</span>
                        <button
                            onClick={() => {
                                setActiveTab('text');
                                setInputText("URGENT! Your SBI account is blocked due to missing KYC. Click here immediately: http://bit.ly/sbi-verify-now to avoid suspension.");
                            }}
                            className="text-xs bg-white hover:bg-slate-50 text-slate-600 py-1.5 px-3 rounded-md border border-slate-200 transition-colors shadow-sm"
                        >
                            SMS Phishing
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('text');
                                setInputText("Congratulations! You have won a lottery of Rs. 50,000. Pay Rs. 500 registration fee to claim now. Call 9999999999");
                            }}
                            className="text-xs bg-white hover:bg-slate-50 text-slate-600 py-1.5 px-3 rounded-md border border-slate-200 transition-colors shadow-sm"
                        >
                            Lottery Scam
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('url');
                                setInputText("http://192.168.1.55/login/bank");
                            }}
                            className="text-xs bg-white hover:bg-slate-50 text-slate-600 py-1.5 px-3 rounded-md border border-slate-200 transition-colors shadow-sm"
                        >
                            Malicious IP
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('text');
                                setInputText("DEAR CUSTOMER YOUR ELECTRICITY POWER WILL BE DISCONNECTED AT 9.30 PM. TONIGHT FROM KSEB OFFICE BECAUSE YOUR PREVIOUS MONTH BILL WAS NOT UPDATED. PLEASE CONTACT OUR OFFICER: 9876543210");
                            }}
                            className="text-xs bg-white hover:bg-slate-50 text-slate-600 py-1.5 px-3 rounded-md border border-slate-200 transition-colors shadow-sm"
                        >
                            Electricity Bill
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('text');
                                setInputText("Your Airtel SIM will be blocked today. Please complete your e-KYC within 1 hour by calling 8888888888 or clicking: bit.ly/airtel-kyc-now");
                            }}
                            className="text-xs bg-white hover:bg-slate-50 text-slate-600 py-1.5 px-3 rounded-md border border-slate-200 transition-colors shadow-sm"
                        >
                            SIM KYC
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('text');
                                setInputText("Earn ₹3000-₹8000 daily by liking YouTube videos. Work from home. No investment required. Contact on WhatsApp: wa.me/917777777777");
                            }}
                            className="text-xs bg-white hover:bg-slate-50 text-slate-600 py-1.5 px-3 rounded-md border border-slate-200 transition-colors shadow-sm"
                        >
                            Job Scam
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('text');
                                setInputText("आपका खाता ब्लॉक हो गया है। तुरंत KYC अपडेट करें: bit.ly/kyc-urgent");
                            }}
                            className="text-xs bg-white hover:bg-slate-50 text-slate-600 py-1.5 px-3 rounded-md border border-slate-200 transition-colors shadow-sm"
                        >
                            Hindi Text
                        </button>
                    </div>

                    {/* Privacy Reassurance */}
                    <div className="mt-6 flex items-center justify-center p-3 bg-slate-50 rounded-lg text-xs text-slate-500 border border-slate-200">
                        <span className="mr-2"><Lock className="w-3 h-3 text-amber-600" /></span>
                        <span>{t('privacy_notice')}</span>
                    </div>

                    <div className="mt-6 flex flex-col gap-4 items-center w-full">
                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                            className="w-full flex items-center justify-center px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed text-base"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                    {t('btn_scanning')}
                                </>
                            ) : (
                                <>
                                    {t('btn_analyze')}
                                </>
                            )}
                        </button>
                    </div>
                </>)}

                {/* Simple Result Panel */}
                {analysisResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full mt-2 rounded-xl"
                    >
                        <div className="flex flex-col gap-4">

                            {/* Audio Transcription Result */}
                            {analysisResult.transcribedText && (
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm mb-2">
                                    <div className="flex justify-between items-center mb-3">
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                            <Mic className="w-3.5 h-3.5 text-slate-400" /> Call Transcript
                                        </p>
                                        <span className="text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-200 px-1.5 py-0.5 rounded font-bold">Gemini 1.5 Flash</span>
                                    </div>
                                    <p className="text-sm text-slate-700 italic border-l-2 border-indigo-200 pl-3">
                                        "{analysisResult.transcribedText}"
                                    </p>
                                </div>
                            )}

                            {/* Recommendation */}
                            <div className="flex-1 space-y-4 w-full">
                                <div>
                                    <p className="text-slate-500 text-xs uppercase tracking-wider font-bold mb-2">{t('result_recommendation')}</p>
                                    <p className={`text-sm leading-relaxed p-4 rounded-xl border font-medium whitespace-pre-line ${
                                        analysisResult.risk === 'Critical' || analysisResult.risk === 'High' ? 'bg-red-50 text-red-900 border-red-200' :
                                        analysisResult.risk === 'Low' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' :
                                        'bg-amber-50 text-amber-900 border-amber-200'
                                    }`}>
                                        {analysisResult.recommendation}
                                    </p>
                                </div>
                            </div>

                            {/* AI-Powered Next Steps (Gemini) */}
                            {analysisResult.aiSteps && (
                                <div className="mt-1 pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">AI-Powered Next Steps</span>
                                        <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-0.5 rounded font-semibold">Gemini AI</span>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                                        {analysisResult.aiSteps.split('\n').map((step: string, idx: number) => {
                                            const trimmed = step.trim();
                                            if (!trimmed) return null;
                                            return (
                                                <div key={idx} className="flex gap-3 mb-3 last:mb-0">
                                                    <span className="flex-shrink-0 w-5 h-5 bg-slate-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center mt-0.5">{idx + 1}</span>
                                                    <p className="text-sm text-slate-700 leading-relaxed">{trimmed.replace(/^\d+\.\s*/, '')}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Risk Signals */}
                            {analysisResult.signals && analysisResult.signals.length > 0 && (
                                <div className="mt-1 pt-4 border-t border-slate-100">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-3">Detected Risk Signals</p>
                                    <div className="grid gap-2">
                                        {analysisResult.signals.map((signal: string, idx: number) => (
                                            <div key={idx} className="flex items-center text-xs text-slate-700 bg-slate-50 px-3 py-2 rounded-md border border-slate-200 font-medium">
                                                <AlertTriangle className="mr-2 w-3 h-3 text-red-500" />
                                                {signal}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <button 
                                onClick={() => { setAnalysisResult(null); setInputText(''); setSelectedFile(null); setPreviewUrl(null); }} 
                                className="flex-1 text-center bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold py-3 px-6 rounded-xl text-sm transition-colors shadow-sm"
                            >
                                {t('btn_clear')}
                            </button>
                            {(analysisResult.risk === 'High' || analysisResult.risk === 'Critical') && (
                                <button
                                    onClick={() => {
                                        const el = document.getElementById('got-scammed-section');
                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl text-sm transition-colors shadow-sm"
                                >
                                    <ShieldAlert className="w-4 h-4" />
                                    Already Got Scammed? Get Help
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
