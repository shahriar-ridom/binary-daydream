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

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

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
