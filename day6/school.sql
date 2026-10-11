
-- School Database

PRAGMA foreign_keys = ON;

-- students table
CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- courses table
CREATE TABLE courses (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

-- enrolments table
CREATE TABLE enrolments (
    id INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,

    FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE CASCADE,

    FOREIGN KEY (course_id)
        REFERENCES courses(id)
        ON DELETE CASCADE,

    UNIQUE (student_id, course_id)
);

-- Insert at least 3 students
INSERT INTO students (id, name, email) VALUES
(1, 'Amina Otieno', 'amina@example.com'),
(2, 'Brian Kamau', 'brian@example.com'),
(3, 'Grace Wanjiku', 'grace@example.com'),
(4, 'David Mwangi', 'david@example.com');

-- Insert at least 3 courses
INSERT INTO courses (id, name, description) VALUES
(1, 'Web Development', 'Learn HTML, CSS and JavaScript'),
(2, 'Database Systems', 'Learn SQL and database design'),
(3, 'Computer Networks', 'Learn networking fundamentals');

-- Insert at least 5 enrolments
INSERT INTO enrolments (student_id, course_id, grade) VALUES
(1, 1, 'A'),
(1, 2, 'B'),
(2, 1, 'B'),
(2, 3, 'A'),
(3, 2, 'A'),
(3, 3, 'B');

-- QUERY 1: All courses taken by one student, by name
SELECT
    students.name AS student_name,
    courses.name AS course_name,
    enrolments.grade
FROM students
JOIN enrolments ON enrolments.student_id = students.id
JOIN courses ON courses.id = enrolments.course_id
WHERE students.name = 'Amina Otieno'
ORDER BY courses.name;

-- QUERY 2: All students enrolled on one course
SELECT
    students.name AS student_name,
    courses.name AS course_name,
    enrolments.grade
FROM courses
JOIN enrolments ON enrolments.course_id = courses.id
JOIN students ON students.id = enrolments.student_id
WHERE courses.name = 'Web Development'
ORDER BY students.name;

-- QUERY 3: Number of students per course, including courses with zero students
SELECT
    courses.name AS course_name,
    COUNT(enrolments.student_id) AS student_count
FROM courses
LEFT JOIN enrolments ON enrolments.course_id = courses.id
GROUP BY courses.id, courses.name
ORDER BY courses.name;

-- QUERY 4: Students who have no enrolments
SELECT
    students.id,
    students.name,
    students.email
FROM students
LEFT JOIN enrolments ON enrolments.student_id = students.id
WHERE enrolments.id IS NULL;

-- QUERY 5: Update one enrolment's grade
UPDATE enrolments
SET grade = 'A'
WHERE student_id = 1 AND course_id = 2;

-- Verify the updated grade
SELECT
    students.name AS student_name,
    courses.name AS course_name,
    enrolments.grade
FROM enrolments
JOIN students ON students.id = enrolments.student_id
JOIN courses ON courses.id = enrolments.course_id
WHERE enrolments.student_id = 1
  AND enrolments.course_id = 2;

-- Optional index to speed up searches for enrolments by course
CREATE INDEX idx_enrolments_course_id
ON enrolments(course_id);
