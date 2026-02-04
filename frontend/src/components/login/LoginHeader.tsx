import { Info, UserStar } from "lucide-react";

interface Props {
  assignmentId?: string | null;
}

const LoginHeader = ({ assignmentId }: Props) => {
  return (
    <>
      <div className="inline-flex p-5 bg-indigo-50 rounded-3xl mb-6 shadow-inner">
        <UserStar className="w-12 h-12 text-indigo-600" />
      </div>

      <h1 className="text-4xl font-black text-slate-900 tracking-tight">
        AmiTeam
      </h1>
      <p className="text-slate-500 font-medium text-lg mt-2">
        ניהול ביקורת עמיתים חכם
      </p>

      {assignmentId && (
        <div className="mt-6 p-4 bg-amber-50 text-amber-800 rounded-2xl border border-amber-100 text-sm font-bold flex items-center gap-3">
          <Info className="w-5 h-5" />
          התחבר/י כדי להגיש ביקורת למשימה ששותפה איתך
        </div>
      )}
    </>
  );
};

export default LoginHeader;
