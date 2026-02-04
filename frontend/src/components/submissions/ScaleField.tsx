interface Props {
  value: number;
  scaleMin: number;
  scaleMax: number;
  onChange: (v: number) => void;
}

const ScaleField = ({ value, scaleMin, scaleMax, onChange }: Props) => {
  return (
    <div className="space-y-6 pt-4">
      <div className="flex justify-between text-sm font-black text-indigo-600 px-2">
        <span className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
          {scaleMin}
        </span>
        <span className="text-4xl animate-in zoom-in duration-300 font-black">
          {value}
        </span>
        <span className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
          {scaleMax}
        </span>
      </div>
      <input
        type="range"
        min={scaleMin}
        max={scaleMax}
        step="1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600 hover:bg-slate-200 transition-all"
      />
    </div>
  );
};

export default ScaleField;
