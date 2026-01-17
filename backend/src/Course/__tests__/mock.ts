import { EntityWithId } from "../../utils/types";
import { Course } from "../schema";

export const courses: EntityWithId<Course>[] = [
    {
        'name': 'linear algebra',
        'courseId': 'c001',
        id: '1'
    },
    {
        'name': 'OOP',
        'courseId': 'c002',
        id: '2'
    }
];