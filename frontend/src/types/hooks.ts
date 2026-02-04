import { type Assignment, type Field, FieldType } from "@/types";

export interface AssignmentFormState {
  title: string;
  description: string;
  courseId: string;
  deadline: string;
  fields: Field[];
  draggedIndex: number | null;
  totalWeight: number;
}

export interface AssignmentFormActions {
  setTitle: (v: string) => void;
  setDescription: (v: string) => void;
  setCourseId: (v: string) => void;
  setDeadline: (v: string) => void;

  addField: (type: FieldType, isCriterion: boolean) => void;
  removeField: (fieldId: string) => void;
  updateField: (fieldId: string, updates: Partial<Field>) => void;

  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  reset: (a: Assignment) => void;
}

export interface AssignmentFormReturn {
  state: AssignmentFormState;
  actions: AssignmentFormActions;
}
