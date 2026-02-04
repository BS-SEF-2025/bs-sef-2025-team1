import { useState } from "react";
import { FieldType, type Assignment, type Field } from "@/types";
import type { AssignmentFormReturn } from "@/types/hooks";

export const useAssignmentForm = (): AssignmentFormReturn => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [deadline, setDeadline] = useState("");
  const [fields, setFields] = useState<Field[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addField = (type: FieldType, isCriterion: boolean) => {
    setFields((prev) => [
      ...prev,
      {
        id: `f${Date.now()}`,
        name: "",
        description: "",
        type,
        required: isCriterion,
        weight: isCriterion ? 10 : 0,
        scaleMin: type === FieldType.SCALE ? 1 : undefined,
        scaleMax: type === FieldType.SCALE ? 10 : undefined,
      },
    ]);
  };

  const removeField = (fid: string) =>
    setFields((prev) => prev.filter((f) => f.id !== fid));

  const updateField = (fid: string, updates: Partial<Field>) =>
    setFields((prev) =>
      prev.map((f) => (f.id === fid ? { ...f, ...updates } : f)),
    );

  const onDragStart = (index: number) => setDraggedIndex(index);

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();

    setFields((prev) => {
      if (draggedIndex === null || draggedIndex === index) return prev;

      const copy = [...prev];
      const item = copy.splice(draggedIndex, 1)[0];
      copy.splice(index, 0, item);

      setDraggedIndex(index);
      return copy;
    });
  };

  const onDragEnd = () => setDraggedIndex(null);

  const reset = (a: Assignment) => {
    setTitle(a.title);
    setDescription(a.description);
    setCourseId(a.courseId);
    setDeadline(a.deadline.toISOString());
    setFields(a.fields);
  };

  const totalWeight = fields.reduce((s, f) => s + f.weight, 0);

  return {
    state: {
      title,
      description,
      courseId,
      deadline,
      fields,
      draggedIndex,
      totalWeight,
    },
    actions: {
      setTitle,
      setDescription,
      setCourseId,
      setDeadline,
      addField,
      removeField,
      updateField,
      onDragStart,
      onDragOver,
      onDragEnd,
      reset,
    },
  };
};
