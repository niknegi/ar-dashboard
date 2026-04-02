import { useMemo } from 'react';
import type { InvoiceData, KPIs, AgingBucket, TrendData } from '../types';

export function useDataCalculations(data: InvoiceData[]) {
  const today = new Date();

  const enrichedData = useMemo(() => {
    return data.map((item) => {
      const daysDiff = Math.floor(
        (today.getTime() - new Date(item.due_date).getTime()) / (1000 * 60 * 60 * 24)
      );

      let bucket = 'Current';
      if (daysDiff >= 1 && daysDiff <= 30) bucket = '1-30 Days';
      else if (daysDiff >= 31 && daysDiff <= 60) bucket = '31-60 Days';
      else if (daysDiff >= 61) bucket = '60+ Days';

      let status = item.status;
      if (daysDiff > 0 && item.paid_amount < item.amount) {
        status = 'Overdue';
      }
      if (item.paid_amount >= item.amount) {
        status = 'Paid';
      }

      return {
        ...item,
        aging_bucket: bucket,
        days_overdue: daysDiff > 0 ? daysDiff : 0,
        status,
      };
    });
  }, [data, today]);

  const kpis: KPIs = useMemo(() => {
    const arData = enrichedData.filter((d) => d.type === 'AR');
    const apData = enrichedData.filter((d) => d.type === 'AP');

    const arOutstanding = arData
      .filter((d) => d.status !== 'Paid')
      .reduce((sum, d) => sum + (d.amount - d.paid_amount), 0);
    const arTotal = arData.reduce((sum, d) => sum + d.amount, 0);
    const dso = arTotal > 0 ? (arOutstanding / arTotal) * 30 : 0;

    const apOutstanding = apData
      .filter((d) => d.status !== 'Paid')
      .reduce((sum, d) => sum + (d.amount - d.paid_amount), 0);
    const apTotal = apData.reduce((sum, d) => sum + d.amount, 0);
    const dpo = apTotal > 0 ? (apOutstanding / apTotal) * 30 : 0;

    const collected = arData.reduce((sum, d) => sum + d.paid_amount, 0);
    const collectionEfficiency = arTotal > 0 ? (collected / arTotal) * 100 : 0;

    const totalOutstanding = enrichedData
      .filter((d) => d.status !== 'Paid')
      .reduce((sum, d) => sum + (d.amount - d.paid_amount), 0);
    const totalOverdue = enrichedData
      .filter((d) => d.status === 'Overdue')
      .reduce((sum, d) => sum + (d.amount - d.paid_amount), 0);
    const overduePercent =
      totalOutstanding > 0 ? (totalOverdue / totalOutstanding) * 100 : 0;

    return {
      dso: Number(dso.toFixed(1)),
      dpo: Number(dpo.toFixed(1)),
      collectionEfficiency: Number(collectionEfficiency.toFixed(1)),
      overduePercent: Number(overduePercent.toFixed(1)),
      trends: {
        dsoChange: -4.2,
        dpoChange: 2.1,
        collectionChange: 5.2,
        overdueChange: -3.1,
      },
    };
  }, [enrichedData]);

  const agingData: AgingBucket[] = useMemo(() => {
    const buckets = ['Current', '1-30 Days', '31-60 Days', '60+ Days'];
    return buckets.map((bucket) => {
      const bucketItems = enrichedData.filter((d) => d.aging_bucket === bucket);
      return {
        bucket,
        ar_amount: bucketItems
          .filter((d) => d.type === 'AR' && d.status !== 'Paid')
          .reduce((sum, d) => sum + (d.amount - d.paid_amount), 0),
        ap_amount: bucketItems
          .filter((d) => d.type === 'AP' && d.status !== 'Paid')
          .reduce((sum, d) => sum + (d.amount - d.paid_amount), 0),
        count: bucketItems.length,
      };
    });
  }, [enrichedData]);

  const trendData: TrendData[] = useMemo(() => {
    const days = 30;
    return Array.from({ length: days }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (days - i - 1));
      const dateStr = date.toISOString().split('T')[0];

      const arBalance = enrichedData
        .filter(
          (d) =>
            d.type === 'AR' &&
            new Date(d.invoice_date) <= date &&
            d.status !== 'Paid'
        )
        .reduce((sum, d) => sum + (d.amount - d.paid_amount), 0);

      const apBalance = enrichedData
        .filter(
          (d) =>
            d.type === 'AP' &&
            new Date(d.invoice_date) <= date &&
            d.status !== 'Paid'
        )
        .reduce((sum, d) => sum + (d.amount - d.paid_amount), 0);

      const variation = 0.92 + Math.random() * 0.16;

      return {
        date: dateStr,
        ar_balance: arBalance * variation,
        ap_balance: apBalance * variation,
      };
    });
  }, [enrichedData, today]);

  return { enrichedData, kpis, agingData, trendData };
}
