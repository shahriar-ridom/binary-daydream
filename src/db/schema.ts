import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// Tables

// Products Table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  priceInCents: integer("price_in_cents").notNull(),
  description: text("description"),
  filePath: text("file_path").notNull(),
  imagePath: text("image_path").notNull(),
  isAvailable: boolean("is_available").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// Users Table
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role: text("role").default("customer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// Sessions Table
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
});

// Accounts table
export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

// Verifications Table
export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// Orders Table
export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    pricePaidInCents: integer("price_paid_in_cents").notNull(),
    stripePaymentIntentId: text("stripe_payment_intent_id").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("order_user_idx").on(table.userId)],
);

// Download Verifications Table
export const downloadVerifications = pgTable("download_verifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at")
    .notNull()
    .$defaultFn(() => new Date(Date.now() + 1000 * 60 * 60 * 24)),
});

// Relations

// Product to Orders and DownloadVerifications. One to Many Relations
export const productRelations = relations(products, ({ many }) => ({
  orders: many(orders),
  downloadVerifications: many(downloadVerifications),
}));

// User to Orders. One to Many Relations.
export const userRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

// Session to User. One to One.
export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

// Order to User and Product. One to One relation.
export const orderRelations = relations(orders, ({ one }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  product: one(products, {
    fields: [orders.productId],
    references: [products.id],
  }),
}));

// DownloadVerificationt to Product. One to One relation
export const downloadVerificationRelations = relations(
  downloadVerifications,
  ({ one }) => ({
    product: one(products, {
      fields: [downloadVerifications.productId],
      references: [products.id],
    }),
  }),
);

// Zod Validation
export const insertProductSchema = createInsertSchema(products, {
  name: (schema) => schema.min(1, "name required"),
  priceInCents: (schema) => schema.min(1, "price must be atleast 1 cent"),
});

export const insertOrderSchema = createInsertSchema(orders);
