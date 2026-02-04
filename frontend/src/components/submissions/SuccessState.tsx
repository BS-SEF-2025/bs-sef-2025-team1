const SuccessState = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="w-full h-full flex items-center">
      <div className="max-w-2xl mx-auto py-20 text-center space-y-8 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto text-5xl shadow-lg shadow-emerald-100">
          ✓
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-slate-900">הביקורת הוגשה!</h2>
          <p className="text-slate-500 text-lg font-medium">
            תודה על הפידבק המקצועי שלך.
          </p>
        </div>
        <button
          onClick={onBack}
          className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
        >
          חזרה לרשימה
        </button>
      </div>
    </div>
  );
};

export default SuccessState;
