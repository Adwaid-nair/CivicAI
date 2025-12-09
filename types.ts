export enum Severity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  EMERGENCY = 'Emergency'
}

export enum IssueStatus {
  OPEN = 'Open',
  SUBMITTED = 'Submitted',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  ESCALATED = 'Escalated'
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Authority {
  id: string;
  name: string;
  type: 'Municipality' | 'Corporation' | 'Panchayat' | 'Water Board' | 'Electricity Board';
  email: string;
  whatsapp: string;
}

export interface TimelineEvent {
  timestamp: number;
  title: string;
  description: string;
  icon: string; // FontAwesome class
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  severity: Severity;
  status: IssueStatus;
  location: Coordinates;
  address: string;
  createdAt: number;
  updatedAt: number;
  votes: number;
  authorityId: string;
  aiAnalysis?: {
    detectedObjects: string[];
    confidence: number;
    reasoning: string;
  };
  drafts?: {
    emailSubject: string;
    emailBody: string;
    whatsappMessage: string;
  };
  timeline: TimelineEvent[];
  commissionerResponse?: string;
}

export interface AIAnalysisResult {
  title: string;
  description: string;
  severity: Severity;
  authorityType: string; // Used to map to Authority
  detectedObjects: string[];
  confidence: number;
  reasoning: string;
}