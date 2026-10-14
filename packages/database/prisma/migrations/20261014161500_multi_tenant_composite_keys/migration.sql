-- Drop legacy global unique indexes that block multi-tenancy
DROP INDEX IF EXISTS "rooms_number_key";
DROP INDEX IF EXISTS "room_types_code_key";
DROP INDEX IF EXISTS "guests_email_key";
DROP INDEX IF EXISTS "pos_tables_number_key";
DROP INDEX IF EXISTS "pos_categories_name_key";

-- Create composite unique indexes scoped to propertyId
CREATE UNIQUE INDEX IF NOT EXISTS "rooms_propertyId_number_key" ON "rooms" ("propertyId", "number");
CREATE UNIQUE INDEX IF NOT EXISTS "room_types_propertyId_code_key" ON "room_types" ("propertyId", "code");
CREATE UNIQUE INDEX IF NOT EXISTS "guests_propertyId_email_key" ON "guests" ("propertyId", "email");
CREATE UNIQUE INDEX IF NOT EXISTS "pos_tables_propertyId_number_key" ON "pos_tables" ("propertyId", "number");
CREATE UNIQUE INDEX IF NOT EXISTS "pos_categories_propertyId_name_key" ON "pos_categories" ("propertyId", "name");

-- Create performance indexes for tenant query filtering (WHERE propertyId = ...)
CREATE INDEX IF NOT EXISTS "rooms_propertyId_idx" ON "rooms" ("propertyId");
CREATE INDEX IF NOT EXISTS "room_types_propertyId_idx" ON "room_types" ("propertyId");
CREATE INDEX IF NOT EXISTS "guests_propertyId_idx" ON "guests" ("propertyId");
CREATE INDEX IF NOT EXISTS "pos_tables_propertyId_idx" ON "pos_tables" ("propertyId");
CREATE INDEX IF NOT EXISTS "pos_categories_propertyId_idx" ON "pos_categories" ("propertyId");
CREATE INDEX IF NOT EXISTS "reservations_propertyId_idx" ON "reservations" ("propertyId");
CREATE INDEX IF NOT EXISTS "folios_propertyId_idx" ON "folios" ("propertyId");
CREATE INDEX IF NOT EXISTS "work_orders_propertyId_idx" ON "work_orders" ("propertyId");
CREATE INDEX IF NOT EXISTS "pos_orders_propertyId_idx" ON "pos_orders" ("propertyId");
CREATE INDEX IF NOT EXISTS "pos_return_requests_propertyId_idx" ON "pos_return_requests" ("propertyId");
CREATE INDEX IF NOT EXISTS "pos_order_items_propertyId_idx" ON "pos_order_items" ("propertyId");
CREATE INDEX IF NOT EXISTS "inventory_items_propertyId_idx" ON "inventory_items" ("propertyId");
CREATE INDEX IF NOT EXISTS "inventory_recipes_propertyId_idx" ON "inventory_recipes" ("propertyId");
CREATE INDEX IF NOT EXISTS "pos_payments_propertyId_idx" ON "pos_payments" ("propertyId");
CREATE INDEX IF NOT EXISTS "expenses_propertyId_idx" ON "expenses" ("propertyId");
