const LoadingScreen = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-500">טוען...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
