/* eslint-disable */
"use client";

import {
  CreditCard,
  ShieldAlert,
  Briefcase,
  Gift,
  FishIcon,
  UserX,
  Heart,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface CategoryBadgeProps {
  category: string;
}

const categoryConfig: Record<
  string,
  {
    icon: any;
    color: string;
    bgColor: string;
    borderColor: string;
    label: string;
    description: string;
  }
> = {
  UPI_Banking_Fraud: {
    icon: CreditCard,
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-300",
    label: "UPI/Banking Fraud",
    description: "Fraudulent banking or payment requests",
  },
  KYC_Scam: {
    icon: ShieldAlert,
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-300",
    label: "KYC Verification Scam",
    description: "Fake KYC update requests",
  },
  Job_Scam: {
    icon: Briefcase,
    color: "text-yellow-700",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-300",
    label: "Job Scam",
    description: "Fraudulent job offers or work-from-home schemes",
  },
  Lottery_Prize_Scam: {
    icon: Gift,
    color: "text-pink-700",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-300",
    label: "Lottery/Prize Scam",
    description: "Fake lottery wins or prize notifications",
  },
  Phishing_Identity_Theft: {
    icon: FishIcon,
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-300",
    label: "Phishing Attack",
    description: "Identity theft or credential harvesting attempt",
  },
  Impersonation_Scam: {
    icon: UserX,
    color: "text-rose-700",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-300",
    label: "Impersonation Scam",
    description: "Fake authority or organization impersonation",
  },
  Romance_Relationship_Scam: {
    icon: Heart,
    color: "text-fuchsia-700",
    bgColor: "bg-fuchsia-50",
    borderColor: "border-fuchsia-300",
    label: "Romance Scam",
    description: "Relationship-based financial fraud",
  },
  General_Suspicious_Activity: {
    icon: AlertTriangle,
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-300",
    label: "Suspicious Activity",
    description: "General suspicious behavior detected",
  },
  Legitimate: {
    icon: CheckCircle,
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-300",
    label: "Legitimate Message",
    description: "No threats detected",
  },
};

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const config =
    categoryConfig[category] || categoryConfig["General_Suspicious_Activity"];
  const Icon = config.icon;

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border-2 rounded-xl p-4 shadow-sm`}
    >
      <div className="flex items-start gap-3">
        <div className={`${config.color} flex-shrink-0`}>
          <Icon className="w-7 h-7" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`${config.color} font-bold text-base mb-1`}>
            {config.label}
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            {config.description}
          </p>
        </div>
      </div>
    </div>
  );
}
