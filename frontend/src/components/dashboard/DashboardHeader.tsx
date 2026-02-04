import { Card, CardContent } from "@/components/ui/card";
import { UserRole } from "@/types";

interface Props {
  name: string;
  role: UserRole;
}

const DashboardHeader = ({ name, role }: Props) => {
  return (
    <Card className="rounded-[2.5rem] border border-slate-100 shadow-xl">
      <CardContent className="p-10 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 text-center md:text-right">
          <h1 className="text-4xl font-black text-slate-900 mb-3">
            שלום, {name.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-500 text-lg font-medium">
            {role === UserRole.STAFF
              ? "המערכת מוכנה לניהול הלמידה. הנה ריכוז הנתונים החשובים ביותר עבורך היום."
              : "כל הביקורות והמטלות שלך מרוכזות כאן. בדוק מה חדש ומה מחכה לביצוע."}
          </p>
        </div>

        <div className="w-28 h-28 bg-linear-to-br from-indigo-500 to-purple-600 rounded-[2rem] flex items-center justify-center text-5xl text-white shadow-2xl">
          {role === UserRole.STAFF ? "🏢" : "✨"}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardHeader;
