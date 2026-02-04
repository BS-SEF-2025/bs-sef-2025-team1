import { FieldType, type Field } from "@/types";
import type { AssignmentFormState } from "@/types/hooks";

export const assignmentFieldValidation = (fields: Field[]): boolean => {
  return (
    fields.reduce((s, f) => s + f.weight, 0) == 100 &&
    fields.every(
      (f) =>
        f.name.trim() != "" &&
        (f.type == FieldType.TEXT ||
          (f.type == FieldType.SCALE &&
            f.scaleMin! >= 0 &&
            f.scaleMax! <= 100 &&
            f.scaleMin! < f.scaleMax!)),
    )
  );
};

export const formStateValidation = (state: AssignmentFormState): boolean => {
  const { title, description, courseId, deadline, fields, draggedIndex } =
    state;

  return (
    title.trim() != "" &&
    description.trim().length >= 10 &&
    courseId.trim() != "" &&
    deadline.trim() != "" &&
    assignmentFieldValidation(fields) &&
    draggedIndex == null
  );
};
