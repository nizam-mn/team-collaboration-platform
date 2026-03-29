import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

// ENUMS
export const taskStatusEnum = pgEnum("task_status", [
  "todo",
  "in_progress",
  "done",
]);

// USERS
export const users = pgTable("users", {
  id: serial("id").primaryKey(),

  email: text("email").notNull().unique(),

  password: text("password").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// PROJECTS
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),

  name: text("name").notNull(),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow(),
});

// TASKS
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),

  title: text("title").notNull(),

  description: text("description"),

  status: taskStatusEnum("status").default("todo"),

  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),

  dueDate: timestamp("due_date"),

  createdAt: timestamp("created_at").defaultNow(),
});

// NOTES
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),

  content: text("content"),

  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow(),
});
