// ─── Report Types ─────────────────────────────────────────────

export type ReportCategory =
  | 'pothole'
  | 'crack'
  | 'flooding'
  | 'broken_sign'
  | 'broken_light'
  | 'damaged_guardrail'
  | 'missing_manhole'
  | 'sidewalk_damage'
  | 'other';

export type ReportStatus = 'pending' | 'in_review' | 'in_progress' | 'resolved' | 'rejected';

export type ReportPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  status: ReportStatus;
  priority: ReportPriority;
  coordinates: Coordinates;
  address: string;
  photos: string[];
  createdAt: string;
  updatedAt: string;
  votes: number;
  reporterName?: string;
  reporterContact?: string;
}

export interface ReportFormData {
  title: string;
  description: string;
  category: ReportCategory;
  priority: ReportPriority;
  coordinates: Coordinates | null;
  address: string;
  photos: File[];
  reporterName: string;
  reporterContact: string;
  anonymous: boolean;
}

// ─── UI Types ─────────────────────────────────────────────────

export interface FilterState {
  categories: ReportCategory[];
  statuses: ReportStatus[];
  priorities: ReportPriority[];
  searchQuery: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

// ─── API Types (placeholder for future backend) ───────────────

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ─── Stats Types ──────────────────────────────────────────────

export interface DashboardStats {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  inProgressReports: number;
  criticalReports: number;
  reportsThisWeek: number;
  resolutionRate: number;
}
