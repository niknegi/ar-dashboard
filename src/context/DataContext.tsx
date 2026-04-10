import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { generateDummyData, exportDummyDataToExcel } from "../data/dummyData";
import type { InvoiceData } from "../types";

interface DataContextValue {
  data: InvoiceData[];
  setData: (data: InvoiceData[]) => void;
  exportData: () => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<InvoiceData[]>([]);

  useEffect(() => {
    setData(generateDummyData(80));
  }, []);

  return (
    <DataContext.Provider
      value={{ data, setData, exportData: exportDummyDataToExcel }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
