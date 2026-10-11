
# Library Books REST API

## Overview

This API manages books in a library.

Base URL: `https://api.library.com`

Each endpoint uses an HTTP method to describe the action and a resource URL to identify the book or collection.

## Endpoints

### 1. List all books

- **Method:** GET
- **Path:** `/books`
- **Description:** Returns all books in the library.
- **Example request body:** None.
- **Success status:** `200 OK`

### 2. Get one book

- **Method:** GET
- **Path:** `/books/42`
- **Description:** Returns the details of the book with ID 42.
- **Example request body:** None.
- **Success status:** `200 OK`

### 3. Create a book

- **Method:** POST
- **Path:** `/books`
- **Description:** Adds a new book to the library.
- **Example request body:**

```json
{
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "publishedYear": 1958
}
```

- **Success status:** `201 Created`

### 4. Replace a book

- **Method:** PUT
- **Path:** `/books/42`
- **Description:** Replaces all editable details of book 42.
- **Example request body:**

```json
{
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "publishedYear": 1958
}
```

- **Success status:** `200 OK`

### 5. Update part of a book

- **Method:** PATCH
- **Path:** `/books/42`
- **Description:** Updates selected fields of book 42.
- **Example request body:**

```json
{
  "title": "Updated Book Title"
}
```

- **Success status:** `200 OK`

### 6. Delete a book

- **Method:** DELETE
- **Path:** `/books/42`
- **Description:** Deletes book 42 from the library.
- **Example request body:** None.
- **Success status:** `204 No Content`

### 7. List books by author

- **Method:** GET
- **Path:** `/books?author=Chinua%20Achebe`
- **Description:** Returns books written by the specified author.
- **Example request body:** None.
- **Success status:** `200 OK`

## Error responses

### 400 Bad Request

Returned when the request contains invalid data.

Example: A request to create a book has no title or contains an invalid publication year.

### 404 Not Found

Returned when the requested resource does not exist.

Example: A request to `GET /books/9999` when no book with ID 9999 exists.
