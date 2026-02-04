/**
 * Firestore timestamp shape as it arrives over JSON
 */
export interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

/**
 * Runtime type guard
 */
export const isFirestoreTimestamp = (
  value: unknown,
): value is FirestoreTimestamp => {
  return (
    typeof value === "object" &&
    value !== null &&
    "_seconds" in value &&
    "_nanoseconds" in value &&
    typeof (value as Record<string, unknown>)["_seconds"] === "number" &&
    typeof (value as Record<string, unknown>)["_nanoseconds"] === "number"
  );
};

/**
 * Deep type transformation:
 * Replaces FirestoreTimestamp with Date recursively
 */
export type DeepConvertTimestamps<T> = T extends FirestoreTimestamp
  ? Date
  : T extends Array<infer U>
    ? Array<DeepConvertTimestamps<U>>
    : T extends object
      ? { [K in keyof T]: DeepConvertTimestamps<T[K]> }
      : T;

/**
 * Recursively converts Firestore timestamps into JS Date
 */
export const convertTimestamps = <T>(input: T): DeepConvertTimestamps<T> => {
  if (Array.isArray(input)) {
    return input.map((item) =>
      convertTimestamps(item),
    ) as DeepConvertTimestamps<T>;
  }

  if (isFirestoreTimestamp(input)) {
    return new Date(
      input._seconds * 1000 + input._nanoseconds / 1e6,
    ) as DeepConvertTimestamps<T>;
  }

  if (typeof input === "object" && input !== null) {
    const result: Record<string, unknown> = {};

    for (const key in input) {
      const value = (input as Record<string, unknown>)[key];
      result[key] = convertTimestamps(value);
    }

    return result as DeepConvertTimestamps<T>;
  }

  return input as DeepConvertTimestamps<T>;
};
