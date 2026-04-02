export interface InvoiceData {
  invoice_id: string;
  customer_vendor: string;
  type: 'AR' | 'AP';
  invoice_date: Date;
  due_date: Date;
  amount: number;
  paid_amount: number;
  status: 'Current' | 'Overdue' | 'Paid';
  aging_bucket?: string;
  days_overdue?: number;
}

export interface KPIs {
  dso: number;
  dpo: number;
  collectionEfficiency: number;
  overduePercent: number;
  trends: {
    dsoChange: number;
    dpoChange: number;
    collectionChange: number;
    overdueChange: number;
  };
}

export interface AgingBucket {
  bucket: string;
  ar_amount: number;
  ap_amount: number;
  count: number;
}

export interface TrendData {
  date: string;
  ar_balance: number;
  ap_balance: number;
}
