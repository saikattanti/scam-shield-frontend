'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Link as LinkIcon, Image as ImageIcon, Search, Loader2 } from 'lucide-react';
import RiskGauge from './RiskGauge';
import CategoryBadge from './CategoryBadge';

type InputType = 'text' | 'url' | 'image';

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
} | null;

export default function InputForm() {
    const [activeTab, setActiveTab] = useState<InputType>('text');
    const [inputText, setInputText] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [feedbackLoading, setFeedbackLoading] = useState(false);

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
        if (activeTab !== 'image' && !inputText) return;
        if (activeTab === 'image' && !selectedFile) return;

        setIsAnalyzing(true);
        setAnalysisResult(null);

        try {
            let response;
            if (activeTab === 'image' && selectedFile) {
                const formData = new FormData();
                formData.append('image', selectedFile);
                response = await fetch('http://localhost:5000/api/analyze/image', {
                    method: 'POST',
                    body: formData,
                });
            } else {
                response = await fetch('http://localhost:5000/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: activeTab, content: inputText }),
                });
            }

            const data = await response.json();
            setAnalysisResult(data);
            setFeedbackSubmitted(false); // Reset feedback for new analysis
        } catch (error) {
            console.error('Analysis failed:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const submitFeedback = async (isAccurate: boolean) => {
        if (!analysisResult || !analysisResult.analysisId) return;
        
        setFeedbackLoading(true);
        try {
            await fetch('http://localhost:5000/api/feedback', {
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
        { id: 'text', label: 'Message', icon: MessageSquare },
        { id: 'url', label: 'Website URL', icon: LinkIcon },
        { id: 'image', label: 'Screenshot', icon: ImageIcon },
    ];

    return (
        <div className="w-full relative z-10">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-6">
                {/* Tabs */}
                <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl mb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as InputType)}
                            className={`flex-1 flex items-center justify-center py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === tab.id
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                                }`}
                        >
                            <tab.icon className="w-4 h-4 mr-2" />
                            {tab.label}
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
                                    className="w-full h-40 bg-slate-50 border border-slate-300 rounded-xl p-4 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none font-medium"
                                    placeholder="Paste the suspicious message (SMS, WhatsApp, Email)..."
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                />
                            )}
                            {activeTab === 'url' && (
                                <input
                                    type="text"
                                    className="w-full h-14 bg-slate-50 border border-slate-300 rounded-xl px-4 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                                    placeholder="Paste the website link (e.g., http://suspicious-bank.com)..."
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                />
                            )}
                            {activeTab === 'image' && (
                                <div className="space-y-4">
                                    <div 
                                        onClick={() => document.getElementById('file-upload')?.click()}
                                        className={`w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${
                                            previewUrl ? 'border-blue-500 bg-blue-50' : 'border-slate-300 text-slate-500 hover:border-blue-500 hover:bg-blue-50'
                                        }`}
                                    >
                                        {previewUrl ? (
                                            <div className="relative w-full h-full">
                                                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <p className="text-white font-bold">Change Image</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <ImageIcon className="w-12 h-12 mb-3 text-slate-400" />
                                                <p className="text-sm font-medium text-slate-700">Click to upload screenshot</p>
                                                <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
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
                            </motion.div>
                    </AnimatePresence>
    
                    {/* Hackathon Demo Controls */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        <button
                            onClick={() => {
                                setActiveTab('text');
                                setInputText("URGENT! Your SBI account is blocked due to missing KYC. Click here immediately: http://bit.ly/sbi-verify-now to avoid suspension.");
                            }}
                            className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-lg border border-blue-200 transition-colors font-medium"
                        >
                            ⚡ Demo: KYC Scam
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('text');
                                setInputText("Congratulations! You have won a lottery of Rs. 50,000. Pay Rs. 500 registration fee to claim now. Call 9999999999");
                            }}
                            className="text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 py-2 px-4 rounded-lg border border-purple-200 transition-colors font-medium"
                        >
                            ⚡ Demo: Lottery
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('url');
                                setInputText("http://192.168.1.55/login/bank");
                            }}
                            className="text-xs bg-red-50 hover:bg-red-100 text-red-700 py-2 px-4 rounded-lg border border-red-200 transition-colors font-medium"
                        >
                            ⚡ Demo: IP URL
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('text');
                                setInputText("आपका खाता ब्लॉक हो गया है। तुरंत KYC अपडेट करें: bit.ly/kyc-urgent");
                            }}
                            className="text-xs bg-orange-50 hover:bg-orange-100 text-orange-700 py-2 px-4 rounded-lg border border-orange-200 transition-colors font-medium"
                        >
                            🇮🇳 Demo: Hindi
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('text');
                                setInputText("உங்கள் UPI கணக்கு தடுக்கப்பட்டது. உடனடியாக சரிபார்க்கவும்: paytm-verify.tk");
                            }}
                            className="text-xs bg-green-50 hover:bg-green-100 text-green-700 py-2 px-4 rounded-lg border border-green-200 transition-colors font-medium"
                        >
                            🇮🇳 Demo: Tamil
                        </button>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                            className="flex items-center px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Scanning...
                                </>
                            ) : (
                                <>
                                    <Search className="w-5 h-5 mr-2" />
                                    Analyze Risk
                                </>
                            )}
                        </button>
                    </div>

                    {analysisResult && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full mt-6 rounded-2xl bg-white p-6 border-2 border-slate-200 shadow-xl"
                            >
                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    {/* Gauge Section */}
                                    <div className="flex-shrink-0">
                                        <RiskGauge score={analysisResult.score} risk={analysisResult.risk} />
                                    </div>

                                    {/* Info Section */}
                                    <div className="flex-1 space-y-4 w-full">
                                        
                                        {/* Language Badge */}
                                        {analysisResult.language && (
                                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
                                                <span className="text-sm text-blue-700 font-semibold">
                                                    📝 Detected: {analysisResult.language.charAt(0).toUpperCase() + analysisResult.language.slice(1)}
                                                </span>
                                                {analysisResult.mlPowered && (
                                                    <span className="text-sm text-green-700 font-medium">
                                                        • AI-Powered {analysisResult.aiConfidence ? `(${analysisResult.aiConfidence}%)` : ''}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Category Badge - Enhanced */}
                                        <div>
                                            <p className="text-slate-600 text-xs uppercase tracking-wider font-bold mb-2">Threat Category</p>
                                            <CategoryBadge category={analysisResult.category} />
                                        </div>

                                        <div>
                                            <p className="text-slate-600 text-xs uppercase tracking-wider font-bold mb-2">Recommendation</p>
                                            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200 font-medium">
                                                {analysisResult.recommendation}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {analysisResult.signals.length > 0 && (
                                    <div className="mt-6 pt-4 border-t border-slate-200">
                                        <p className="text-xs text-slate-700 uppercase tracking-wider font-bold mb-3">Detected Risk Signals</p>
                                        <div className="grid gap-2">
                                            {analysisResult.signals.map((signal, idx) => (
                                                <div key={idx} className="flex items-center text-sm text-red-700 bg-red-50 px-4 py-3 rounded-lg border border-red-200 font-medium">
                                                    <span className="mr-2 text-red-600">⚠️</span>
                                                    {signal}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Feedback Section */}
                                <div className="mt-6 pt-4 border-t border-slate-200">
                                    <p className="text-xs text-slate-700 uppercase tracking-wider font-bold mb-3">Was this analysis helpful?</p>
                                    {!feedbackSubmitted ? (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => submitFeedback(true)}
                                                disabled={feedbackLoading}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-50 hover:bg-green-100 border border-green-300 text-green-700 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                👍 Accurate
                                            </button>
                                            <button
                                                onClick={() => submitFeedback(false)}
                                                disabled={feedbackLoading}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                👎 Inaccurate
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 border border-blue-300 text-blue-700 font-semibold rounded-lg">
                                            <span>✅ Thank you for your feedback!</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
            </div>
        </div>
    );
}
