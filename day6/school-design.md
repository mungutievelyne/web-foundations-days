
# School Database Design

## 1. Overview

This database manages students, courses, and enrolments in a school. It stores student information, course details, and the grades students receive in their courses.

The database uses three tables: `students`, `courses`, and `enrolments`.

## 2. Table Design

### Students

The `students` table stores each student's ID, name, and email address.

- `id`: INTEGER PRIMARY KEY, uniquely identifies each student.
- `name`: TEXT NOT NULL, stores the student's name.
- `email`: TEXT NOT NULL UNIQUE, stores the student's email and prevents duplicate email addresses.

### Courses

The `courses` table stores the courses offered by the school.

- `id`: INTEGER PRIMARY KEY, uniquely identifies each course.
- `name`: TEXT NOT NULL, stores the course name.
- `description`: TEXT, provides optional information about the course.

### Enrolments

The `enrolments` table connects students to courses and records their grades.

- `id`: INTEGER PRIMARY KEY, uniquely identifies each enrolment.
- `student_id`: INTEGER NOT NULL, references `students.id`.
- `course_id`: INTEGER NOT NULL, references `courses.id`.
- `grade`: TEXT, stores the student's grade.

The foreign keys ensure that every enrolment refers to an existing student and course. The UNIQUE constraint on `(student_id, course_id)` prevents duplicate enrolments.

## 3. Relationships

### One-to-many relationships

A student can have many enrolments, but each enrolment belongs to one student. This relationship is represented by `enrolments.student_id`.

A course can also have many enrolments, but each enrolment refers to one course. This relationship is represented by `enrolments.course_id`.

### Many-to-many relationship

Students and courses have a many-to-many relationship. One student can take multiple courses, and one course can have multiple students.

The `enrolments` table acts as a join table between students and courses. It is necessary because it connects the two tables and stores additional information, such as each student's grade.

## 4. Index

I would add an index on `enrolments.course_id`:

`CREATE INDEX idx_enrolments_course_id ON enrolments(course_id);`

This index can make queries that find all students enrolled in a particular course faster. The trade-off is additional storage and slightly slower writes because the index must be maintained.

## 5. SQL or NoSQL?

I would choose a relational SQL database for this school system. Students, courses, and enrolments have clearly defined fields and relationships. SQL supports primary keys, foreign keys, unique constraints, JOINs, and transactions, which help maintain accurate enrolment and grade records. A document database could also work, but SQL is a natural fit for this structured data and the need to query relationships between students and courses.
