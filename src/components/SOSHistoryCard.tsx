import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type SOSStatus = "pending" | "approved" | "rejected";

interface SOSHistoryCardProps {
  type: string;
  date: string;
  time: string;
  status: SOSStatus;
  amount?: number;
  message?: string;
}

const statusConfig = {
  pending: {
    icon: Clock,
    label: "En attente",
    className: "bg-status-pending text-white",
  },
  approved: {
    icon: CheckCircle,
    label: "Approuvé",
    className: "bg-status-approved text-white",
  },
  rejected: {
    icon: XCircle,
    label: "Refusé",
    className: "bg-status-rejected text-white",
  },
};

const typeLabels: Record<string, string> = {
  medical: "🏥 Médical",
  transport: "🚗 Transport",
  housing: "🏠 Logement",
  other: "⚠️ Autre",
};

export const SOSHistoryCard = ({ type, date, time, status, amount, message }: SOSHistoryCardProps) => {
  const StatusIcon = statusConfig[status].icon;

  return (
    <Card className="p-4 border-border shadow-soft hover:shadow-elevated transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">{typeLabels[type] || type}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{date} à {time}</span>
          </div>
          
          {amount && (
            <div className="text-base font-medium">
              Montant demandé : <span className="text-primary">{amount}€</span>
            </div>
          )}
          
          {message && (
            <p className="text-sm text-muted-foreground line-clamp-2">{message}</p>
          )}
        </div>
        
        <Badge className={cn("flex items-center gap-1.5 px-3 py-1.5", statusConfig[status].className)}>
          <StatusIcon className="w-4 h-4" />
          <span className="font-medium">{statusConfig[status].label}</span>
        </Badge>
      </div>
    </Card>
  );
};
