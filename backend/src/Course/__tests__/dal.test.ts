import { deleteCollection, insertMany, testFirestore } from "../../services/__tests__/firestore";
import { addTestPrefix } from "../../utils/firestore.utils";
import { courseCollectionName, CourseDal } from "../dal";
import { courses } from "./mock";

describe("course dal", () => {
    const testCollectionName = addTestPrefix(courseCollectionName);
  const courseDal = new CourseDal(testFirestore, testCollectionName);

  describe("getAllCourses", () => {
    test("empty collection", async () => {
      const res = await courseDal.getAllCourses();

      expect(res).toEqual([]);
    });

    test("non empty collection", async () => {
      await insertMany(testCollectionName, courses);
      const res = await courseDal.getAllCourses();

      await deleteCollection(testCollectionName);

      expect(res).toEqual(courses);
    });
  });
});
