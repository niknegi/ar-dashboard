import { useCallback } from 'react';
import * as XLSX from 'xlsx';
import type { InvoiceData } from '../types';

function parseDate(val: unknown): Date {
  if (val instanceof Date) return val;
  if (typeof val === 'number') return XLSX.SSF.parse_date_code(val);
  const str = String(val || '').trim();
  const d = new Date(str);
  return isNaN(d.getTime()) ? new Date() : d;
}

function parseNumber(val: unknown): number {
  if (typeof val === 'number') return val;
  const n = Number(String(val || '').replace(/[^0-9.\-]/g, ''));
  return isNaN(n) ? 0 : n;
}

export function useExcelParser(onDataLoaded: (data: InvoiceData[]) => void) {
  const parseFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (!data) return;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false }) as Record<string, unknown>[];

        const transformedData: InvoiceData[] = jsonData.map((row: any) => {
          const typeVal = String(row.type || row.Type || 'AR').toUpperCase();
          const statusVal = String(row.status || row.Status || 'Current');

          return {
            invoice_id: String(row.invoice_id || row.Invoice_ID || row['Invoice ID'] || ''),
            customer_vendor: String(row.customer_vendor || row.Customer_Vendor || row['Customer Vendor'] || ''),
            type: typeVal === 'AP' ? 'AP' : 'AR',
            invoice_date: parseDate(row.invoice_date || row.Invoice_Date || row['Invoice Date']),
            due_date: parseDate(row.due_date || row.Due_Date || row['Due Date']),
            amount: parseNumber(row.amount || row.Amount),
            paid_amount: parseNumber(row.paid_amount || row.Paid_Amount || row['Paid Amount']),
            status: ['Current', 'Overdue', 'Paid'].includes(statusVal)
              ? (statusVal as 'Current' | 'Overdue' | 'Paid')
              : 'Current',
          };
        });

        onDataLoaded(transformedData);
      };
      reader.readAsBinaryString(file);
    },
    [onDataLoaded]
  );

  return { parseFile };
}
