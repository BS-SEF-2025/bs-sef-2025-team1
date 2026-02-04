import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Props {
  search: string;
  setSearch: (v: string) => void;
}

const UsersHeader = ({ search, setSearch }: Props) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100">
      <div>
        <h2 className="text-3xl font-black text-slate-900">ניהול משתמשים</h2>
        <p className="text-slate-500 font-medium">נהל הרשאות ותפקידים במערכת</p>
      </div>

      <div className="relative w-full md:w-80">
        <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="חיפוש לפי שם או אימייל..."
          className="pr-12 rounded-2xl"
        />
      </div>
    </div>
  );
};

export default UsersHeader;
