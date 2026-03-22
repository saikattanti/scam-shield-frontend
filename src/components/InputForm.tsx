/* eslint-disable */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Link as LinkIcon,
  Image as ImageIcon,
  Loader2,
  Volume2,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Mic,
  Lock,
  Eye,
  EyeOff,
  Globe,
  Calendar,
  Shield,
  ExternalLink,
  Zap,
  Sparkles,
  Search,
  CheckCircle2,
  ArrowRight,
  BarChart2,
  Clock,
} from "lucide-react";
import RiskBreakdown from "./RiskBreakdown";
import EvidenceTable from "./EvidenceTable";
import FraudTimeline from "./FraudTimeline";
import SmartActionPanel, { SmartActions } from "./SmartActionPanel";
import { useLanguage } from "@/context/LanguageContext";
import UnifiedButton from "@/components/ui/unified-button";

type InputType = "text" | "url" | "image" | "audio";

type UrlMetadata = {
  title?: string | null;
  creationDate?: string | null;
  ageInDays?: number | null;
  hasPasswordForm?: boolean;
  isShortlink?: boolean;
  resolvedUrl?: string | null;
  dnsResolved?: boolean;
  suspiciousTLD?: boolean;
  matchesPhishingPattern?: boolean;
  isIPUrl?: boolean;
  protocol?: string;
};

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
  urlMetadata?: UrlMetadata;
  smartActions?: SmartActions | null;
} | null;

const TEST_CHIPS = [
  {
    label: "SMS Phish",
    tab: "text",
    text: "URGENT! Your SBI account is blocked due to KYC. Click here immediately: http://bit.ly/sbi-verify-now to avoid suspension.",
  },
  {
    label: "Lottery",
    tab: "text",
    text: "Congratulations! You have won Rs. 50,000. Pay Rs. 500 registration fee to claim now.",
  },
  { label: "Malware Link", tab: "url", text: "http://192.168.1.55/login/bank" },
];

const RISK_COLORS = {
  Critical: {
    bg: "bg-red-500",
    text: "text-red-600",
    light: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-700",
  },
  High: {
    bg: "bg-orange-500",
    text: "text-orange-600",
    light: "bg-orange-50",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-700",
  },
  Medium: {
    bg: "bg-amber-400",
    text: "text-amber-600",
    light: "bg-amber-50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-700",
  },
  Low: {
    bg: "bg-emerald-500",
    text: "text-emerald-600",
    light: "bg-emerald-50",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
  },
};

export default function InputForm() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<InputType>("text");
  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPrivacyPreview, setShowPrivacyPreview] = useState(false);
  const [userCity, setUserCity] = useState<string | null>(null);

  // Detect user city from IP on mount (client-side only, never stored)
  useState(() => {
    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((data) => {
        if (data?.city) setUserCity(data.city);
      })
      .catch(() => {});
  });

  const speakResult = () => {
    if (!analysisResult) return;
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(
      analysisResult.recommendation,
    );
    utterance.lang = analysisResult.language === "hindi" ? "hi-IN" : "en-US";
    synth.speak(utterance);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const getPrivacyPreview = () => {
    if (activeTab === "image")
      return `{\n  "payload": "[IMAGE]"\n  "note": "OCR processed locally"\n}`;
    if (activeTab === "audio")
      return `{\n  "payload": "[AUDIO]"\n  "note": "Transcribed & purged"\n}`;
    const sanitized = inputText
      .replace(/\d{10,12}/g, "[PHONE REDACTED]")
      .replace(/\b\d{12}\b/g, "[AADHAAR REDACTED]")
      .replace(/otp[:\s]+\d+/gi, "OTP: [REDACTED]");
    return `{\n  "type": "${activeTab}",\n  "content": "${sanitized.substring(0, 50)}..."\n}`;
  };

  const handleAnalyze = async () => {
    if (["text", "url"].includes(activeTab) && !inputText.trim()) return;
    if (["image", "audio"].includes(activeTab) && !selectedFile) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
    const cityHeader: Record<string, string> = userCity
      ? { "X-User-City": userCity }
      : {};
    try {
      let response;
      if (activeTab === "image" && selectedFile) {
        const fd = new FormData();
        fd.append("image", selectedFile);
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/analyze/image`, {
          method: "POST",
          body: fd,
          headers: cityHeader,
        });
      } else if (activeTab === "audio" && selectedFile) {
        const fd = new FormData();
        fd.append("audio", selectedFile);
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/analyze/audio`, {
          method: "POST",
          body: fd,
          headers: cityHeader,
        });
      } else {
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...cityHeader },
          body: JSON.stringify({ type: activeTab, content: inputText }),
        });
      }
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setAnalysisResult(data);
    } catch (error: any) {
      alert(
        error.message || "Analysis failed. Ensure all services are running.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setAnalysisResult(null);
    setInputText("");
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowPrivacyPreview(false);
  };

  const cleanTabLabel = (label: string) =>
    label.replace(/^[^\p{L}\p{N}]+/u, "").trim();

  const tabs = [
    { id: "text", label: cleanTabLabel(t("tab_text")), icon: MessageSquare },
    { id: "url", label: cleanTabLabel(t("tab_url")), icon: LinkIcon },
    { id: "image", label: cleanTabLabel(t("tab_image")), icon: ImageIcon },
    { id: "audio", label: t("input_tab_call"), icon: Mic },
  ];

  const risk = analysisResult?.risk as keyof typeof RISK_COLORS | undefined;
  const colors = risk ? (RISK_COLORS[risk] ?? RISK_COLORS.Low) : null;
  const isHighRisk = risk === "Critical" || risk === "High";

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
      {/* ════ LEFT PANEL: THE INPUT WORKSPACE ════ */}
      <div
        className={`w-full lg:w-[420px] shrink-0 h-fit ${isAnalyzing || analysisResult ? "lg:sticky lg:top-28" : ""}`}
      >
        {/* Soft UI Input Card */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 pb-8">
          {/* Tile-based Tab Navigation */}
          <div className="flex gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as InputType);
                  setAnalysisResult(null);
                }}
                className={`flex-1 flex flex-col items-center gap-1.5 py-4 rounded-2xl text-xs font-bold transition-all border ${
                  activeTab === tab.id
                    ? "border-slate-200 bg-white shadow-sm text-slate-900"
                    : "border-transparent text-slate-400 bg-transparent hover:text-slate-600 hover:bg-slate-50"
                }`}
              >
                <tab.icon
                  className={`w-5 h-5 ${activeTab === tab.id ? "text-blue-600" : "text-slate-300"}`}
                />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {/* Dynamic Input Areas */}
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {activeTab === "text" && (
                  <textarea
                    className="w-full h-[100px] bg-slate-50 border border-slate-100 rounded-[1.25rem] p-4 text-slate-600 placeholder-slate-400 focus:outline-none focus:border-slate-200 focus:bg-white transition-all resize-none text-[13px] leading-relaxed"
                    placeholder={t("input_text_placeholder")}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                )}

                {activeTab === "url" && (
                  <div className="space-y-3">
                    <div className="relative">
                      <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <input
                        type="text"
                        className="w-full h-16 bg-slate-50 border border-slate-100 rounded-[1.5rem] pl-14 pr-5 text-slate-600 placeholder-slate-400 focus:outline-none focus:border-slate-200 focus:bg-white transition-all text-sm"
                        placeholder={t("input_url_placeholder")}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {activeTab === "image" && (
                  <div className="relative group">
                    <div
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                      className={`w-full h-[90px] border-2 border-dashed rounded-[1rem] flex flex-col items-center justify-center cursor-pointer transition-all ${
                        previewUrl
                          ? "border-slate-200 bg-white"
                          : "border-slate-200/50 bg-slate-50 hover:bg-slate-100/50"
                      }`}
                    >
                      {previewUrl ? (
                        <>
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover p-1 opacity-50 absolute rounded-[1.25rem]"
                          />
                          <div className="bg-white/90 px-4 py-2 rounded-xl text-slate-800 font-bold z-10 shadow-sm border border-slate-200 text-sm">
                            Image attached. Change?
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-2">
                            <ImageIcon className="w-5 h-5 text-slate-400" />
                          </div>
                          <p className="text-sm font-bold text-slate-500">
                            {t("upload_instruction")}
                          </p>
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
                  </div>
                )}

                {activeTab === "audio" && (
                  <div className="relative group">
                    <div
                      onClick={() =>
                        document.getElementById("audio-upload")?.click()
                      }
                      className={`w-full h-[90px] border-2 border-dashed rounded-[1rem] flex flex-col items-center justify-center cursor-pointer transition-all ${
                        selectedFile
                          ? "border-slate-200 bg-white"
                          : "border-slate-200/50 bg-slate-50 hover:bg-slate-100/50"
                      }`}
                    >
                      {selectedFile ? (
                        <div className="text-center z-10">
                          <p className="text-sm font-bold text-slate-600 truncate max-w-[200px] mb-1">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-slate-400 font-medium">
                            Ready for transcription
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-2">
                            <Mic className="w-5 h-5 text-slate-400" />
                          </div>
                          <p className="text-sm font-bold text-slate-500">
                            {t("input_tab_call")}
                          </p>
                        </>
                      )}
                      <input
                        id="audio-upload"
                        type="file"
                        className="hidden"
                        accept="audio/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) setSelectedFile(f);
                        }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Test Chips (aligned to the image mockup style) */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-b border-slate-100 pb-5">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mr-1">
                TESTS:
              </span>
              {TEST_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => {
                    setActiveTab(chip.tab as InputType);
                    setInputText(chip.text);
                    setAnalysisResult(null);
                  }}
                  className="text-[10px] font-bold bg-white hover:bg-slate-50 text-slate-700 py-1.5 px-3 rounded-md border border-slate-200 transition-colors"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Ghost Light-Grey Action Button */}
            <div className="flex justify-center pt-1 w-full">
              <UnifiedButton
                onClick={handleAnalyze}
                disabled={
                  isAnalyzing ||
                  (["text", "url"].includes(activeTab)
                    ? !inputText.trim()
                    : !selectedFile)
                }
                text={isAnalyzing ? t("input_analyzing") : t("input_run_check")}
                variant="primary"
                className="w-full max-w-md"
                icon={<ArrowRight className="w-4 h-4" />}
              />
            </div>

            {/* Privacy Section */}
            <div className="flex flex-col items-center gap-2 pt-2">
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                <Lock className="w-3.5 h-3.5" />
                <span>Zero-knowledge processing.</span>
                <button
                  onClick={() => setShowPrivacyPreview(!showPrivacyPreview)}
                  className="text-blue-600 hover:underline font-bold ml-1"
                >
                  Preview payload
                </button>
                {showPrivacyPreview ? (
                  <EyeOff className="w-3.5 h-3.5 text-blue-600" />
                ) : (
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                )}
              </div>

              <AnimatePresence>
                {showPrivacyPreview && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="w-full overflow-hidden mt-2"
                  >
                    <pre className="text-[10px] font-mono bg-slate-900 text-emerald-400 p-4 rounded-xl whitespace-pre-wrap leading-relaxed w-full">
                      {getPrivacyPreview()}
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* ════ RIGHT PANEL: THE RESULTS WORKSPACE ════ */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          {/* STATE: IDLE */}
          {!isAnalyzing && !analysisResult && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, position: "absolute" }}
              className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-10 flex flex-col items-center justify-center text-center w-full min-h-[600px]"
            >
              <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-8">
                <Search className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">
                {t("input_payload_waiting")}
              </h3>
              <p className="text-sm text-slate-500 max-w-[400px] mb-12 leading-relaxed">
                {t("input_payload_hint")}
              </p>

              {/* Very minimal cards as specified in the mockup */}
              <div className="grid grid-cols-2 gap-4 w-full max-w-xl text-left">
                {[
                  {
                    icon: Zap,
                    title: "Hybrid ML Engine",
                    desc: "Sub-second NLP detection",
                  },
                  {
                    icon: BarChart2,
                    title: "Risk Score Matrix",
                    desc: "Detailed 5-factor breakdown",
                  },
                  {
                    icon: Sparkles,
                    title: "Gemini Recovery",
                    desc: "Context-aware action steps",
                  },
                  {
                    icon: Clock,
                    title: "Legal Timeline",
                    desc: "1-click cybercrime reports",
                  },
                ].map((feature) => (
                  <div
                    key={feature.title}
                    className="p-5 rounded-[1.25rem] bg-slate-50 border border-slate-100 flex items-center gap-4"
                  >
                    <feature.icon className="w-5 h-5 text-blue-500 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {feature.title}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STATE: ANALYZING */}
          {isAnalyzing && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-12 min-h-[600px] flex flex-col items-center justify-center text-center w-full relative"
            >
              <div className="relative z-10">
                <div className="relative w-24 h-24 mb-10 mx-auto">
                  <div className="absolute inset-0 rounded-full border-[6px] border-slate-100" />
                  <div className="absolute inset-0 rounded-full border-[6px] border-t-blue-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-blue-500 animate-pulse" />
                  </div>
                </div>

                <h3 className="text-2xl font-black text-slate-800 mb-3">
                  Analyzing Threat Vectors
                </h3>
                <p className="text-sm text-slate-500 mb-10 max-w-sm mx-auto">
                  Deep checking against multi-modal models and live threat
                  intelligence feeds...
                </p>
              </div>
            </motion.div>
          )}

          {/* STATE: RESULTS */}
          {analysisResult && colors && !isAnalyzing && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full space-y-6"
            >
              {/* HERO RESULT CARD */}
              <div
                className={`bg-slate-50 rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden`}
              >
                <div
                  className={`${colors.bg} px-10 py-8 text-white relative flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden`}
                >
                  <div className="absolute -left-10 top-0 opacity-10 blur-xl">
                    <ShieldAlert className="w-[300px] h-[300px] translate-y-10" />
                  </div>

                  <div className="flex items-center gap-6 z-10 w-full">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center shadow-inner border border-white/30 shrink-0">
                      {isHighRisk ? (
                        <ShieldAlert className="w-8 h-8 text-white" />
                      ) : (
                        <CheckCircle2 className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between w-full">
                        <h2 className="text-4xl font-black uppercase tracking-tighter shadow-sm mb-1 leading-none">
                          {isHighRisk
                            ? "DANGER — SCAM"
                            : analysisResult.risk === "Low"
                              ? "SAFE"
                              : "CAUTION"}
                        </h2>
                        {isHighRisk && (
                          <span className="bg-white/20 border border-white/30 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-sm self-start mt-2">
                            Critical Risk
                          </span>
                        )}
                      </div>
                      <p className="text-white font-medium text-sm pt-2 tracking-wide">
                        {analysisResult.category?.replace(/_/g, " ")} · AI
                        Confidence Score:{" "}
                        <strong>{analysisResult.score}/100</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-8 pb-10 bg-white">
                  <div className="flex items-center justify-between mb-4 mt-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Primary Directive
                    </p>
                    <button
                      onClick={speakResult}
                      className="text-[11px] font-bold text-white bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-full flex gap-1.5 items-center transition-colors shadow-sm"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> {t("input_listen_ai")}
                    </button>
                  </div>
                  <div
                    className={`p-6 rounded-[1.25rem] border ${colors.border} ${colors.light}`}
                  >
                    <p className="text-base md:text-lg text-slate-800 leading-relaxed font-semibold">
                      {analysisResult.recommendation}
                    </p>
                  </div>
                </div>
              </div>

              {/* GRID RESULTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visual Risk Breakdown */}
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 col-span-1 md:col-span-2">
                  <RiskBreakdown
                    signals={analysisResult.signals}
                    score={analysisResult.score}
                    risk={analysisResult.risk}
                    category={analysisResult.category}
                  />
                </div>

                {/* AI Guidance Recovery */}
                {analysisResult.aiSteps && (
                  <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 col-span-1 md:col-span-2">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3">
                      <Sparkles className="w-6 h-6 text-blue-600" /> Immediate
                      Rapid-Response Action Steps
                    </h3>
                    <div className="space-y-4">
                      {analysisResult.aiSteps
                        .split(/\|\|\|/)
                        .filter((s: string) => s.trim())
                        .slice(0, 5)
                        .map((step: string, idx: number) => {
                          const parts = step
                            .trim()
                            .split("\n")
                            .filter((p) => p.trim());
                          const title = parts[0]
                            .replace(
                              /^(\d+\.\s*|🚨\s*|📞\s*|🧾\s*|🛑\s*|🧑‍⚖️\s*|⚠️\s*|\*\*)+|(\*\*)+$/g,
                              "",
                            )
                            .trim();
                          const subItems = parts.slice(1);
                          return (
                            <div key={idx} className="flex gap-4">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${colors.bg} text-white text-xs font-black shadow-sm mt-0.5`}
                              >
                                {idx + 1}
                              </div>
                              <div className="flex-1">
                                <p className="text-[15px] text-slate-800 font-bold">
                                  {title}
                                </p>
                                {subItems.length > 0 && (
                                  <ul className="space-y-1 mt-1.5 pl-0.5">
                                    {subItems.map((item, i) => {
                                      const cleanItem = item
                                        .replace(/^[-*•]\s*/, "")
                                        .trim();
                                      if (!cleanItem) return null;
                                      return (
                                        <li
                                          key={i}
                                          className="text-[13px] text-slate-600 font-medium leading-relaxed flex items-start gap-2"
                                        >
                                          <span className="text-slate-300 mt-[1px] font-bold">
                                            •
                                          </span>
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
                  </div>
                )}

                {/* Evidence Table */}
                {analysisResult.signals?.length > 0 && (
                  <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 col-span-1 md:col-span-2">
                    <EvidenceTable
                      signals={analysisResult.signals}
                      category={analysisResult.category}
                    />
                  </div>
                )}

                {/* URL Scanner Results */}
                {analysisResult.urlMetadata && (
                  <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 col-span-1 md:col-span-2">
                    <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-500" /> Deep Scanner
                      Report
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {analysisResult.urlMetadata.isShortlink && (
                        <div className="col-span-2 lg:col-span-4 p-5 bg-orange-50 border border-orange-200 rounded-[1.25rem]">
                          <p className="text-xs font-bold text-orange-800 mb-2 flex items-center gap-2">
                            <LinkIcon className="w-4 h-4" /> URL Shortener
                            Unmasked:
                          </p>
                          <p className="text-sm font-mono text-orange-600 bg-white/60 px-4 py-2 rounded-xl border border-orange-100/50 break-all">
                            {analysisResult.urlMetadata.resolvedUrl}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Emergency Action Centre */}
              {analysisResult.smartActions && (
                <div className="pt-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 pl-1">
                    Emergency Action Centre
                  </p>
                  <SmartActionPanel actions={analysisResult.smartActions} />
                </div>
              )}

              <div className="pt-6">
                <FraudTimeline />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
