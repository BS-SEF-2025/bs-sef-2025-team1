import { Card } from "@/components/ui/card";
import type { PropsWithChildren } from "react";

export default function ResultsHeader({ children }: PropsWithChildren) {
  return (
    <Card className="flex flex-row items-center justify-between p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
      <div>
        <h2 className="text-3xl font-black text-slate-900">סיכום וביצועים</h2>
        <p className="text-slate-500 font-medium">
          צפה בתוצאות וניתוח נתוני הביקורת
        </p>
      </div>

      {children}
    </Card>
  );
}
