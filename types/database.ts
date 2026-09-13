import type {
  PaymentStatus,
  PaymentMethod,
  UserRole,
} from "@/lib/calculations";

/* ============================================
   DATABASE TYPES
   ============================================ */

export interface Organization {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  address: string | null;
  logo_url: string | null;
  receipt_prefix: string;
  receipt_counter: number;
  footer_message: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  organization_id: string;
  auth_user_id: string;
  name: string;
  phone: string | null;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: string;
  organization_id: string;
  name: string;
  phone: string;
  city: string;
  area: string | null;
  monthly_amount: number;
  start_month: number;
  start_year: number;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface ChandaRecord {
  id: string;
  organization_id: string;
  member_id: string;
  month: number;
  year: number;
  expected_amount: number;
  paid_amount: number;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  organization_id: string;
  member_id: string;
  chanda_record_id: string;
  amount: number;
  payment_method: PaymentMethod;
  payment_date: string;
  receipt_number: string;
  recorded_by: string;
  status: "success" | "cancelled";
  cancellation_reason: string | null;
  cancelled_by: string | null;
  cancelled_at: string | null;
  created_at: string;
}

export interface Receipt {
  id: string;
  organization_id: string;
  payment_id: string;
  receipt_number: string;
  pdf_url: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  organization_id: string;
  user_id: string;
  action: string;
  entity: string;
  entity_id: string;
  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  reason: string | null;
  created_at: string;
}

/* ============================================
   VIEW / JOINED TYPES
   ============================================ */

export interface MemberWithStatus extends Member {
  current_month_status: PaymentStatus;
  current_month_paid: number;
  total_paid: number;
  total_pending: number;
}

export interface PaymentWithDetails extends Payment {
  member_name: string;
  member_phone: string;
  month: number;
  year: number;
  recorded_by_name: string;
}

export interface ReceiptWithDetails extends Receipt {
  payment: PaymentWithDetails;
  organization: Pick<Organization, "name" | "city" | "address" | "logo_url" | "footer_message">;
  member: Pick<Member, "name" | "phone" | "city" | "area">;
  chanda_month: number;
  chanda_year: number;
}

/* ============================================
   DASHBOARD TYPES
   ============================================ */

export interface DashboardMetrics {
  totalPeople: number;
  expectedThisMonth: number;
  collectedThisMonth: number;
  pendingThisMonth: number;
  collectionRate: number;
  paidCount: number;
  partialCount: number;
  pendingCount: number;
}

export interface MonthlyOverview {
  month: number;
  year: number;
  totalExpected: number;
  totalCollected: number;
  totalPending: number;
  collectionRate: number;
  paidCount: number;
  partialCount: number;
  pendingCount: number;
  records: ChandaRecordWithMember[];
}

export interface ChandaRecordWithMember extends ChandaRecord {
  member: Pick<Member, "id" | "name" | "phone" | "city" | "area" | "monthly_amount">;
}

export interface AnnualReport {
  year: number;
  totalExpected: number;
  totalCollected: number;
  totalPending: number;
  monthlyData: {
    month: number;
    expected: number;
    collected: number;
    pending: number;
    paidCount: number;
    partialCount: number;
    pendingCount: number;
  }[];
}

export interface PersonReport {
  member: Member;
  year: number;
  records: ChandaRecord[];
  totalPaid: number;
  totalExpected: number;
  totalPending: number;
}

/* ============================================
   FORM TYPES
   ============================================ */

export interface AddPersonFormData {
  name: string;
  phone: string;
  city: string;
  area: string;
  monthly_amount: number;
  start_month: number;
  start_year: number;
}

export interface RecordPaymentFormData {
  member_id: string;
  month: number;
  year: number;
  amount: number;
  payment_method: PaymentMethod;
}

export interface CancelPaymentFormData {
  payment_id: string;
  reason: string;
}

/* ============================================
   IMPORT / EXPORT TYPES
   ============================================ */

export interface ImportRow {
  name: string;
  phone: string;
  city: string;
  area: string;
  monthly_amount: number;
}

export interface ImportValidation {
  row: number;
  data: ImportRow;
  valid: boolean;
  errors: string[];
}

export interface ImportResult {
  total: number;
  valid: number;
  invalid: number;
  validations: ImportValidation[];
}
