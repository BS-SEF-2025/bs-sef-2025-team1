import { Button } from "@/components/ui/button";

const CoursesHeader = ({ onCreate }: { onCreate: () => void }) => {
  return (
    <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-100">
      <div>
        <h2 className="text-2xl font-black">ניהול קורסים</h2>
        <p className="text-slate-500 text-sm">
          צור ונהל את הקורסים האקדמיים שלך
        </p>
      </div>

      <Button
        onClick={onCreate}
        className="bg-indigo-600 hover:bg-indigo-700 rounded-2xl cursor-pointer"
      >
        + קורס חדש
      </Button>
    </div>
  );
};

export default CoursesHeader;
