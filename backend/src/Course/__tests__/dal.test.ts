import { testFirestoreClient } from "../../services/__tests__/firestore";
import { CourseDal } from "../dal";
import { courses } from "./mock";

describe("test", () => {
  test("unit1", () => {
    expect(1).toBe(1);
  });
});

describe("course dal", () => {

  const courseDal = new CourseDal(testFirestoreClient.getFirebase());

  describe("getAllCourses", () => {
    test("empty collection", async () => {
      const res = await courseDal.getAllCourses();

      expect(res).toEqual([]);
    });

    test("non empty collection", async () => {
      const res = await courseDal.getAllCourses();

      expect(res).toEqual(courses);
    });
  });
});
