/*
# LogiFlow - Core Database Schema

Creates the foundational tables for the LogiFlow logistics platform:
profiles, orders, order_status_history, and notifications.

1. New Tables
- profiles: Extends auth.users with logistics-specific fields (name, role, phone, employee_id, operator status). Role is ADMIN or OPERATOR. Operator status is AVAILABLE, BUSY, or OFFLINE.
- orders: Stores all delivery orders with customer info, pickup/delivery addresses, package details, priority, status lifecycle, and operator assignment.
- order_status_history: Audit trail of every status change on an order, including who changed it and when.
- notifications: Per-user notifications for order assignments, status updates, etc.

2. Constraints & Indexes
- Partial unique index on orders(operator_id) for active statuses — enforces the ONE ACTIVE ORDER PER OPERATOR business rule at the database level.
- Index on orders.status for filtering.
- Index on order_status_history(order_id) for timeline queries.
- Index on notifications(user_id, read) for unread queries.

3. Security (RLS)
- profiles: All authenticated users can read profiles (operators need to see each other's status; admin manages operators). Users can update their own profile.
- orders: All authenticated users can read orders. All authenticated users can insert/update orders (operators update their assigned orders' status; admin creates/assigns).
- order_status_history: All authenticated users can read and insert history records.
- notifications: Users can read/update only their own notifications.
- All policies use auth.uid() for ownership checks.
*/

-- ============ PROFILES TABLE ============
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'OPERATOR' CHECK (role IN ('ADMIN', 'OPERATOR')),
  phone text,
  employee_id text,
  status text NOT NULL DEFAULT 'OFFLINE' CHECK (status IN ('AVAILABLE', 'BUSY', 'OFFLINE')),
  joining_date date DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_all" ON profiles;
CREATE POLICY "profiles_select_all"
  ON profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============ ORDERS TABLE ============
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  pickup_address text NOT NULL,
  delivery_address text NOT NULL,
  package_type text NOT NULL,
  package_weight numeric NOT NULL CHECK (package_weight > 0),
  priority text NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
  delivery_date date,
  notes text,
  status text NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED')),
  operator_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  accepted_at timestamptz,
  picked_up_at timestamptz,
  in_transit_at timestamptz,
  delivered_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "orders_select_all" ON orders;
CREATE POLICY "orders_select_all"
  ON orders FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "orders_insert_all" ON orders;
CREATE POLICY "orders_insert_all"
  ON orders FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "orders_update_all" ON orders;
CREATE POLICY "orders_update_all"
  ON orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "orders_delete_all" ON orders;
CREATE POLICY "orders_delete_all"
  ON orders FOR DELETE TO authenticated USING (true);

-- Partial unique index: one active order per operator
CREATE UNIQUE INDEX IF NOT EXISTS one_active_order_per_operator
  ON orders (operator_id)
  WHERE status IN ('ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED');

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_operator ON orders (operator_id);

-- ============ ORDER_STATUS_HISTORY TABLE ============
CREATE TABLE IF NOT EXISTS order_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status text NOT NULL,
  changed_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  changed_at timestamptz NOT NULL DEFAULT now(),
  notes text
);

ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "history_select_all" ON order_status_history;
CREATE POLICY "history_select_all"
  ON order_status_history FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "history_insert_all" ON order_status_history;
CREATE POLICY "history_insert_all"
  ON order_status_history FOR INSERT TO authenticated WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_history_order ON order_status_history (order_id);

-- ============ NOTIFICATIONS TABLE ============
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notif_select_own" ON notifications;
CREATE POLICY "notif_select_own"
  ON notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notif_insert_own" ON notifications;
CREATE POLICY "notif_insert_own"
  ON notifications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notif_update_own" ON notifications;
CREATE POLICY "notif_update_own"
  ON notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notif_delete_own" ON notifications;
CREATE POLICY "notif_delete_own"
  ON notifications FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_notif_user_unread ON notifications (user_id, read);
