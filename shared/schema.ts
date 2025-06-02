import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // "weapon", "armor", "consumable", etc.
  rarity: text("rarity").notNull().default("common"), // "common", "rare", "epic", "legendary"
  description: text("description"),
  icon: text("icon").notNull(),
  value: integer("value").notNull().default(0),
  stackable: boolean("stackable").notNull().default(false),
  maxStack: integer("max_stack").notNull().default(1),
});

export const npcInventory = pgTable("npc_inventory", {
  id: serial("id").primaryKey(),
  npcId: text("npc_id").notNull(),
  itemId: integer("item_id").notNull().references(() => items.id),
  quantity: integer("quantity").notNull().default(1),
  slot: text("slot"), // "head", "chest", "legs", "feet", "main_hand", "off_hand", "bag", etc.
  isEquipped: boolean("is_equipped").notNull().default(false),
});

export const npcStats = pgTable("npc_stats", {
  id: serial("id").primaryKey(),
  npcId: text("npc_id").notNull().unique(),
  gold: integer("gold").notNull().default(0),
  silver: integer("silver").notNull().default(0),
  level: integer("level").notNull().default(1),
  experience: integer("experience").notNull().default(0),
});

export const npcsTable = pgTable("npcs", {
  id: varchar("id", { length: 255 }).primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  houseId: varchar("house_id", { length: 255 }).notNull(),
  gridX: integer("grid_x"),
  gridZ: integer("grid_z"),
  isControlled: boolean("is_controlled").default(false),
  isAutoMode: boolean("is_auto_mode").default(false),
  aiState: varchar("ai_state", { length: 50 }).default("at_home"), // at_home, exploring, returning_home
  aiLastStateChange: timestamp("ai_last_state_change").defaultNow(),
  aiTargetX: integer("ai_target_x"),
  aiTargetZ: integer("ai_target_z"),
  // Advanced AI properties
  aiPersonality: text("ai_personality"),
  aiEnergy: integer("ai_energy"), // 0-100
  aiMood: text("ai_mood"),
  gold: integer("gold").default(100),
  silver: integer("silver").default(50),
  createdAt: timestamp("created_at").defaultNow(),
  // Vision system
  showVision: boolean("show_vision").default(false),
  visionRange: integer("vision_range").default(10),
  visionAngle: integer("vision_angle").default(90),
});

export const insertItemSchema = createInsertSchema(items);
export const insertNpcInventorySchema = createInsertSchema(npcInventory);
export const insertNpcStatsSchema = createInsertSchema(npcStats);

export type Item = typeof items.$inferSelect;
export type NpcInventory = typeof npcInventory.$inferSelect;
export type NpcStats = typeof npcStats.$inferSelect;