export type SOSType = 'financial' | 'security' | 'medical' | 'location';

export interface SOSButtonConfig {
  id: SOSType;
  title: string;
  icon: string;
  color: string;
  message: string;
  gpsRequired: boolean;
  amountOptions?: number[];
  animation: 'pulse-fast' | 'pulse-medium' | 'pulse-slow' | 'none';
  priority: 'high' | 'medium' | 'low';
}

export interface SOSRequest {
  type: SOSType;
  amount?: number;
  location?: {
    lat: number;
    lng: number;
  };
  timestamp: string;
}

export interface SOSResponse {
  status: 'ok' | 'error';
  sos_id?: string;
  timestamp: string;
  message?: string;
}

export interface SOSHistoryItem {
  id: string;
  type: SOSType;
  date: string;
  time: string;
  status: 'sent' | 'read' | 'resolved';
  amount?: number;
  message: string;
}
