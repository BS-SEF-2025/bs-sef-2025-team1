import type { Field } from "@/types";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  total: number;
  fields: Field[];
}

export default function WeightIndicator({ total, fields }: Props) {
  if (!fields.some((f) => f.required)) return null;

  const valid = total === 100;

  return (
    <Card
      className={cn(
        "mt-8 p-6 rounded-2xl flex flex-row items-center justify-between transition-colors border",
        valid
          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
          : "bg-rose-50 text-rose-700 border-rose-100",
      )}
    >
      <div className="flex  items-center gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-full text-sm flex items-center justify-center font-black",
            valid ? "bg-emerald-100" : "bg-rose-100",
          )}
        >
          {total}%
        </div>

        <span className="font-black">סך משקולות הקריטריונים</span>
      </div>

      {!valid && (
        <span className="text-xs font-bold animate-pulse">
          חובה להגיע בדיוק ל-100%
        </span>
      )}
    </Card>
  );
}
