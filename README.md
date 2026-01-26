# bs-sef-2025-team1 – Feature Implementation Guide

This document describes the product features derived from the Jira backlog for project **BSSEF25T1 (bs-sef-2025-team1)**.

Each section corresponds to a Jira story and is intended to guide an AI development agent in planning tasks, implementing code, and writing appropriate commit messages.

---

## General Notes for the AI Agent

- Follow standard best practices: clear separation of concerns, tests, and documentation.
- For each story:
  - Create or update code, tests, and relevant configuration.
  - Ensure all **Acceptance Criteria** are met.
  - Use meaningful commit messages referencing the Jira key (e.g. `BSSEF25T1-50: implement basic course CRUD`).
- Backend and frontend technology stack should be adapted to the existing repository (REST / GraphQL, framework, ORM, etc.).

---

## BSSEF25T1-41 – Manage Assignments

**Jira:** https://sce-ac.atlassian.net/browse/BSSEF25T1-41  
**Type:** Story  
**Status:** To Do  
**Parent Epic:** BSSEF25T1-40  
**Role:** Staff member

### Goal

Implement full CRUD management of assignments so staff can control when and how students submit reviews, with proper deadlines and validation.

### Functional Requirements

Staff must be able to:

1. **Create an assignment**
   - Fields:
     - `name` (string)
     - `course` (reference to existing course)
     - `submissionDeadline` (datetime)
     - `reviewFields` (configuration of review fields; must integrate with story BSSEF25T1-60)
   - Each new assignment must have:
     - A valid associated course.
     - A submission deadline.
   - On creation, generate a **unique direct access link** per assignment (e.g. tokenized URL or `/assignments/:id`).

2. **Update an assignment**
   - Editable fields:
     - `name`
     - `course`
     - `submissionDeadline`
     - `reviewFields` (with validation according to BSSEF25T1-60).
   - Validation must re-run when updating review fields or deadline.

3. **Delete an assignment**
   - Deleting an assignment makes it **inaccessible via direct link**.
   - Decide how to handle related reviews (hard delete/soft delete/mark as orphaned) consistent with system design.
   - Ensure no active route or query can retrieve deleted assignments.

4. **Access control**
   - Only staff members can create/update/delete assignments.
   - Students should not access assignment management endpoints or screens.

5. **Deadline enforcement**
   - Review submission must be blocked after `submissionDeadline` (tie-in with BSSEF25T1-65 "Submit Review").

### Acceptance Criteria

- Staff can create an assignment with:
  - Name
  - Associated course
  - Submission deadline
  - Review fields
- Staff can update:
  - Assignment name
  - Course
  - Deadline
  - Review fields
- Staff can delete an assignment.
- Each assignment has a **unique direct access link**.
- An assignment **cannot be created** without:
  - A course
  - A deadline
- **Review submission is blocked** after the assignment deadline.
- Deleted assignments are **no longer accessible** via direct link.

---

## BSSEF25T1-50 – Manage Courses

**Jira:** https://sce-ac.atlassian.net/browse/BSSEF25T1-50  
**Type:** Story  
**Status:** In Progress  
**Assignee:** David Maor  
**Parent Epic:** BSSEF25T1-40  
**Role:** Staff member

### Goal

Implement full course management: creating, updating, deleting courses, and assigning/removing students. Courses are the main scope for assignments and reviews.

### Functional Requirements

1. **Create a course**
   - Minimum required field:
     - `name` (string, unique or at least non-empty).
   - Optional: course code, description, semester, etc., depending on repo conventions.

2. **Manage course membership**
   - Staff can:
     - Assign students to a course.
     - Remove students from a course.
   - Enforcement:
     - Only students assigned to a course can:
       - Be added to groups for that course (BSSEF25T1-55).
       - Submit reviews for assignments in that course (BSSEF25T1-65).

3. **Update a course**
   - Editable details may include:
     - `name`
     - Any other metadata fields supported by the system.
   - Should not break existing assignments and groups linked to the course.

4. **Delete a course**
   - On course deletion:
     - All related associations must be removed (or consistently handled):
       - Course–student membership
       - Groups in the course
       - Assignments in the course
       - Reviews linked through those assignments/groups
   - Decide between soft delete vs hard delete; behavior must be consistent and documented in code.

5. **Permissions**
   - Only staff members can create, edit, or delete courses.
   - Students cannot manage courses.

### Acceptance Criteria

- Staff can create a course with a **name**.
- Staff can **assign and remove students** from a course.
- Staff can **update course details**.
- Staff can **delete a course**.
- **Course deletion removes all related associations.**

---

## BSSEF25T1-55 – Manage Groups

**Jira:** https://sce-ac.atlassian.net/browse/BSSEF25T1-55  
**Type:** Story  
**Status:** To Do  
**Parent Epic:** BSSEF25T1-40  
**Role:** Staff member

### Goal

Allow staff to manage student groups inside each course. Reviews are submitted per group, so groups must be correctly associated with courses and students.

### Functional Requirements

1. **Group–Course Relationship**
   - Each group belongs to **exactly one course**.
   - Group model must have a foreign key/reference to the course.

2. **Group Membership Constraints**
   - Only students enrolled in that course (see BSSEF25T1-50) can be added to the group.
   - On attempt to add a student not in the course:
     - Reject with a validation error.

3. **Create Group**
   - Staff can create a group for a specific course.
   - Fields could include:
     - `name` or `groupNumber`
     - `courseId`
     - initial list of students (optional or mandatory depending on design).

4. **Update Group**
   - Staff can:
     - Rename the group or change metadata.
     - Add or remove students, with course membership validations.

5. **Delete Group**
   - Staff can delete a group.
   - Define what happens to any reviews assigned to that group (should remain consistent with BSSEF25T1-65/74/78).

### Acceptance Criteria

- Each group belongs to **exactly one course**.
- Only students enrolled in the course can be added to the group.
- Groups can be **updated and deleted**.

---

## BSSEF25T1-60 – Configure Review Fields

**Jira:** https://sce-ac.atlassian.net/browse/BSSEF25T1-60  
**Type:** Story  
**Status:** To Do  
**Parent Epic:** BSSEF25T1-40  
**Role:** Staff member

### Goal

Provide a configurable schema for review fields attached to assignments with strict validation rules for types, weights, and mandatory fields.

### Field Types

Each review field is one of:

1. **Criterion**
   - Mandatory.
   - Scale-based (e.g. numeric scale: 1–5, 1–10).
   - Has a **weight > 0**.
2. **Feedback**
   - Has **weight = 0**.
   - May be either **mandatory** or **optional**.
   - Typically free-text or qualitative input.

### Functional Requirements

1. **Field Configuration**
   - For an assignment (BSSEF25T1-41), staff defines a list of review fields.
   - Each field includes:
     - `id` or `key`
     - `label`
     - `type` (`CRITERION` or `FEEDBACK`)
     - `weight` (number)
     - `isMandatory` (boolean)
     - `scaleDefinition` for Criterion (min, max, step, etc.).

2. **Weight Validation**
   - For all fields of type **Criterion**:
     - Their weights must sum to **exactly 100%**.
   - Feedback fields must have weight exactly **0**.

3. **Type and Mandatory Validation**
   - Criterion fields:
     - Must be mandatory (`isMandatory = true`).
   - Feedback fields:
     - May be mandatory or optional.
   - Field type must be either `Criterion` or `Feedback` (no other values allowed).

4. **Assignment Save Validation**
   - When saving or updating an assignment's review fields:
     - If any validation rule fails:
       - The **assignment cannot be saved**.
       - Return clear error messages describing which rule failed.

### Acceptance Criteria

- Field type must be **Criterion** or **Feedback**.
- Criterion fields are:
  - **Mandatory**
  - **Scale-based**
  - Have **weight > 0**
- Feedback fields:
  - Have **weight = 0**
  - May be **mandatory or optional**
- Total weight of all **Criterion** fields equals **exactly 100 percent**.
- Assignment cannot be saved if validation rules fail.

---

## BSSEF25T1-65 – Submit Review

**Jira:** https://sce-ac.atlassian.net/browse/BSSEF25T1-65  
**Type:** Story  
**Status:** To Do  
**Parent Epic:** BSSEF25T1-40  
**Role:** Student

### Goal

Allow a student to submit a structured review for an assignment, selecting which group they are reviewing and respecting assignment configuration and deadlines.

### Functional Requirements

1. **Entry Points**
   - A student can submit a review:
     - Via a **direct link** to the assignment (see BSSEF25T1-41).
     - Via an **assignment list** view accessible to the student.

2. **Group Selection**
   - Student must select the **reviewed group**:
     - Group options must be valid for the assignment's course (BSSEF25T1-55).
   - Enforce that:
     - The student can only operate within allowed scope based on system rules (e.g., self group vs other groups depending on design).

3. **Field Validation**
   - All **mandatory fields** (from review field configuration, BSSEF25T1-60) must be completed.
   - For **scale-based Criterion** fields:
     - Values must be within the **defined scale range**.
   - For Feedback fields:
     - Required if marked mandatory.

4. **Deadline Enforcement**
   - If current time is **after** assignment's `submissionDeadline`:
     - Review submission must be **blocked**.
     - Show appropriate error message or UI indication.

5. **Persistence**
   - Save the review linked to:
     - Student
     - Assignment
     - Reviewed group
     - Timestamp
     - All Criterion + Feedback answers.

### Acceptance Criteria

- Reviews can be submitted via:
  - Direct link
  - Assignment list
- Student must **select the reviewed group**.
- All **mandatory fields** must be completed.
- Scale values are **within the defined range**.
- Review submission is **blocked after the assignment deadline**.

---

## BSSEF25T1-70 – View Submitted Reviews

**Jira:** https://sce-ac.atlassian.net/browse/BSSEF25T1-70  
**Type:** Story  
**Status:** To Do  
**Parent Epic:** BSSEF25T1-40  
**Role:** Student

### Goal

Allow a student to view the reviews that **they themselves have submitted**, with filtering options.

### Functional Requirements

1. **Access Control**
   - A student can see **only reviews they submitted**.
   - They should not see other students' submitted reviews in this view.

2. **Filtering**
   - Provide filters:
     - By **assignment**
     - By **group**
   - Combine filters where appropriate (assignment + group).

3. **Display**
   - Show:
     - Assignment details
     - Reviewed group
     - Date/time submitted
     - Criterion scores
     - Feedback fields
   - Ensure sensitive information is not exposed if not allowed by system rules.

### Acceptance Criteria

- Student can view **only reviews they submitted**.
- Reviews can be filtered by:
  - Assignment
  - Group

---

## BSSEF25T1-74 – View Reviews About My Group

**Jira:** https://sce-ac.atlassian.net/browse/BSSEF25T1-74  
**Type:** Story  
**Status:** To Do  
**Parent Epic:** BSSEF25T1-40  
**Role:** Student

### Goal

Enable students to view reviews that other students have submitted **about their group**, giving them feedback on their performance.

### Functional Requirements

1. **Group-based Access**
   - A student can view only reviews that:
     - Are related to groups the student is a member of (BSSEF25T1-55).
   - No access to reviews about other groups.

2. **Filtering**
   - Filters for:
     - **Assignment**
     - **Submitting group** (group that wrote the review).

3. **Display**
   - Display summary and details similar to BSSEF25T1-70, but from the perspective of:
     - "Reviews about my group".
   - Ensure no confidential meta information is exposed beyond what's expected for peer reviews (according to system's privacy requirements).

### Acceptance Criteria

- Student can view **only reviews related to their group**.
- Reviews can be filtered by:
  - Assignment
  - Submitting group

---

## BSSEF25T1-78 – Review Summary and Export

**Jira:** https://sce-ac.atlassian.net/browse/BSSEF25T1-78  
**Type:** Story  
**Status:** To Do  
**Parent Epic:** BSSEF25T1-40  
**Role:** Staff member

### Goal

Provide staff with aggregated review summaries and the ability to export data (e.g., CSV/Excel) for analysis.

### Functional Requirements

1. **Summary Views**
   - Aggregate review data, supporting filters:
     - By **assignment**
     - By **group**
     - By **student**
   - Possible metrics:
     - Average criterion scores
     - Distribution of scores
     - Count of submitted reviews
     - Any other relevant statistics.

2. **Filtering**
   - Filters should combine logically:
     - e.g. all reviews for a given assignment and group; or all reviews submitted by a particular student.

3. **Export to Excel**
   - Export currently displayed data (i.e., respecting filters) to an Excel-compatible format (XLSX or CSV).
   - Exported data must:
     - Match the on-screen data exactly.
     - Have appropriate column headers and formats.

4. **Permissions**
   - Only staff can access this summary and export functionality.

### Acceptance Criteria

- Staff can filter summaries by:
  - **Assignment**
  - **Group**
  - **Student**
- Staff can **export summary data to Excel**.
- **Exported data matches the displayed data**.

---

## Jira Board Reference

This README is based on the backlog from the Jira Software board:

- Board URL: https://sce-ac.atlassian.net/jira/software/projects/BSSEF25T1/boards/2274/backlog
- Project Key: **BSSEF25T1**
- Project Name: **bs-sef-2025-team1**

---
