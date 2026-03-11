## 1. PostgreSQL vs SQLite for Production

SQLite is good for **prototypes and small local apps**, but it struggles in real production environments. It allows only **one writer at a time**, which causes delays when multiple users send requests simultaneously. PostgreSQL solves this with **MVCC**, allowing many transactions to run in parallel. It also supports **server architecture, connection pooling, strict data types, advanced constraints, and monitoring tools**, making it far more reliable, scalable, and safe for production systems.

---

## 2. Derived State in React

The number of pending tasks should **not be stored in its own `useState`** because that creates **two sources of truth**. When both `tasks` and `pendingCount` are stored separately, developers must manually keep them synchronized, which can easily cause bugs. The correct approach is to **derive the value directly from the tasks array**, e.g. filtering incomplete tasks. This follows React’s **single source of truth principle**, ensuring the count is always accurate and reducing complexity.

---

## 3. EF Core `Include()` and the N+1 Query Problem

If related data (like `Category`) is not loaded using `Include()`, EF Core may execute **one query for the main data and additional queries for each related record**, leading to the **N+1 problem**. For example, 50 tasks could result in **51 database queries**, which severely hurts performance. Using `Include()` performs **eager loading with a single SQL JOIN query**, retrieving all necessary data in one round-trip and making the application far more efficient.

---

**Overall:**
The document explains three key full-stack engineering principles:

* Choosing the **right database architecture (PostgreSQL over SQLite)** for scalability.
* Maintaining **clean state management in React using derived state**.
* Preventing **database performance issues in EF Core using `Include()` to avoid N+1 queries**.

