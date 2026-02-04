import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  description: string;
  value: number;
  Icon: React.ElementType;
  color: string;
}

const colorClasses: Record<string, string> = {
  indigo: "bg-indigo-50 text-indigo-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-rose-50 text-rose-600",
  sky: "bg-sky-50 text-sky-600",
};

const StatisticCard = ({ label, description, value, Icon, color }: Props) => {
  return (
    <Card className="rounded-[2rem] border border-slate-100">
      <CardContent className="p-8 flex items-start gap-6">
        <div
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
            colorClasses[color],
          )}
        >
          <Icon className="w-6 h-6" />
        </div>

        <div>
          <p className="text-4xl font-black text-slate-900 leading-none mb-1">
            {value}
          </p>
          <p className="text-sm font-black text-slate-700 mb-1">{label}</p>
          <p className="text-xs font-bold text-slate-400 leading-tight">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticCard;
