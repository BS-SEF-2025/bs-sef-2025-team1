import { Card } from "@/components/ui/card";
import { type Assignment, FieldType, type SubmissionAnswer } from "@/types";
import ScaleField from "./ScaleField";

interface Props {
  assignment: Assignment;
  answers: SubmissionAnswer[];
  setAnswers: (a: SubmissionAnswer[]) => void;
}

export default function FieldsReviewCard({
  assignment,
  answers,
  setAnswers,
}: Props) {
  const onValueChange = (fieldId: string, value: string | number) => {
    const exists = answers.find((a) => a.fieldId === fieldId);

    if (!exists) {
      setAnswers([...answers, { fieldId, value }]);
      return;
    }

    setAnswers(
      answers.map((a) => (a.fieldId === fieldId ? { ...a, value } : a)),
    );
  };

  return (
    <Card className="p-10 rounded-[2.5rem] space-y-12">
      <h2 className="text-2xl font-black">שאלון ביקורת עמיתים</h2>
      <div className="divide-y divide-slate-100 space-y-12">
        {assignment.fields.map((field) => (
          <div key={field.id} className="py-4 mb-6 first:pt-0">
            <div className="flex justify-between items-start pb-2">
              <div className="flex-1">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  {field.name}
                  {field.required && (
                    <span className="text-rose-500" title="חובה">
                      *
                    </span>
                  )}
                </h3>
                <p className="text-slate-500 font-medium mt-1">
                  {field.description}
                </p>
              </div>
              {field.weight > 0 && (
                <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black shadow-sm">
                  משקל: {field.weight}%
                </div>
              )}
            </div>

            {field.type === FieldType.SCALE ? (
              <ScaleField
                value={
                  (answers.find((a) => a.fieldId == field.id)?.value ??
                    field.scaleMin) as number
                }
                scaleMin={field.scaleMin!}
                scaleMax={field.scaleMax!}
                onChange={(v) => onValueChange(field.id, v)}
              />
            ) : (
              <textarea
                value={
                  (answers.find((a) => a.fieldId == field.id)?.value ??
                    "") as string
                }
                onChange={(e) => onValueChange(field.id, e.target.value)}
                required={field.required}
                placeholder="כתוב את הפידבק שלך כאן..."
                className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all min-h-40 text-lg font-medium"
              />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
