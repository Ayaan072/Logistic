/*
# Reseed demo orders with new user IDs

The previous order data referenced old user IDs that were deleted.
This migration reinserts the demo orders using the new auth user IDs,
along with status history and notifications.
*/

DO $$
DECLARE
  op_ayaan uuid;
  op_rahul uuid;
  op_arjun uuid;
  op_priya uuid;
  admin_id uuid;
  o1 uuid; o2 uuid; o3 uuid; o4 uuid; o5 uuid; o6 uuid;
BEGIN
  SELECT id INTO op_ayaan FROM auth.users WHERE email = 'operator@logiflow.com';
  SELECT id INTO op_rahul FROM auth.users WHERE email = 'rahul@logiflow.com';
  SELECT id INTO op_arjun FROM auth.users WHERE email = 'arjun@logiflow.com';
  SELECT id INTO op_priya FROM auth.users WHERE email = 'priya@logiflow.com';
  SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@logiflow.com';

  -- Clean up any orphaned orders from previous seed
  DELETE FROM orders;

  -- ORD1001: Completed - assigned to Ayaan
  INSERT INTO orders (order_number, customer_name, customer_phone, pickup_address, delivery_address, package_type, package_weight, priority, delivery_date, notes, status, operator_id, accepted_at, picked_up_at, in_transit_at, delivered_at, completed_at, created_at)
  SELECT 'ORD1001', 'Rajesh Kumar', '+91-9912345670', 'Mumbai Warehouse, Andheri East', 'Pune Distribution Center, Hinjewadi', 'Electronic Equipment', 18, 'HIGH', CURRENT_DATE - 2, 'Fragile - handle with care', 'COMPLETED', op_ayaan,
    now() - interval '2 days' + interval '1 hour',
    now() - interval '2 days' + interval '2 hours',
    now() - interval '2 days' + interval '3 hours',
    now() - interval '2 days' + interval '6 hours',
    now() - interval '2 days' + interval '7 hours',
    now() - interval '3 days'
  RETURNING id INTO o1;

  -- ORD1002: In Transit - assigned to Rahul
  INSERT INTO orders (order_number, customer_name, customer_phone, pickup_address, delivery_address, package_type, package_weight, priority, delivery_date, notes, status, operator_id, accepted_at, picked_up_at, in_transit_at, created_at)
  SELECT 'ORD1002', 'Sunita Deshmukh', '+91-9912345671', 'Thane Logistics Hub, Ghodbunder Road', 'Nashik Central Warehouse, Satpur', 'Documents', 2, 'LOW', CURRENT_DATE, 'Confidential documents', 'IN_TRANSIT', op_rahul,
    now() - interval '5 hours',
    now() - interval '4 hours',
    now() - interval '3 hours',
    now() - interval '8 hours'
  RETURNING id INTO o2;

  -- ORD1003: Assigned - assigned to Arjun
  INSERT INTO orders (order_number, customer_name, customer_phone, pickup_address, delivery_address, package_type, package_weight, priority, delivery_date, notes, status, operator_id, created_at)
  SELECT 'ORD1003', 'Mahesh Iyer', '+91-9912345672', 'Mumbai Port Trust, Ballard Estate', 'Surat Textile Market, Ring Road', 'Clothing', 45, 'MEDIUM', CURRENT_DATE + 1, 'Bulk textile shipment', 'ASSIGNED', op_arjun,
    now() - interval '1 hour'
  RETURNING id INTO o3;

  -- ORD1004: New - unassigned
  INSERT INTO orders (order_number, customer_name, customer_phone, pickup_address, delivery_address, package_type, package_weight, priority, delivery_date, notes, status, created_at)
  SELECT 'ORD1004', 'Deepika Nair', '+91-9912345673', 'Pune Industrial Area, Chakan', 'Mumbai Logistics Center, Bhiwandi', 'Machinery', 120, 'HIGH', CURRENT_DATE + 2, 'Heavy machinery - forklift required', 'NEW',
    now() - interval '30 minutes'
  RETURNING id INTO o4;

  -- ORD1005: New - unassigned
  INSERT INTO orders (order_number, customer_name, customer_phone, pickup_address, delivery_address, package_type, package_weight, priority, delivery_date, notes, status, created_at)
  SELECT 'ORD1005', 'Karan Mehta', '+91-9912345674', 'Delhi Cargo Terminal, Okhla', 'Gurugram Warehouse, Sector 18', 'Furniture', 65, 'MEDIUM', CURRENT_DATE + 3, 'Assembly required at destination', 'NEW',
    now() - interval '15 minutes'
  RETURNING id INTO o5;

  -- ORD1006: Completed - assigned to Priya
  INSERT INTO orders (order_number, customer_name, customer_phone, pickup_address, delivery_address, package_type, package_weight, priority, delivery_date, notes, status, operator_id, accepted_at, picked_up_at, in_transit_at, delivered_at, completed_at, created_at)
  SELECT 'ORD1006', 'Ananya Gupta', '+91-9912345675', 'Bangalore Tech Park, Whitefield', 'Mysore Distribution Hub, Hebbal', 'Electronic Equipment', 25, 'HIGH', CURRENT_DATE - 1, 'Server equipment - temperature sensitive', 'COMPLETED', op_priya,
    now() - interval '1 day' + interval '1 hour',
    now() - interval '1 day' + interval '2 hours',
    now() - interval '1 day' + interval '3 hours',
    now() - interval '1 day' + interval '5 hours',
    now() - interval '1 day' + interval '6 hours',
    now() - interval '2 days'
  RETURNING id INTO o6;

  -- Status history for ORD1001
  INSERT INTO order_status_history (order_id, status, changed_by, changed_at, notes)
  VALUES
    (o1, 'NEW', admin_id, now() - interval '3 days', 'Order created'),
    (o1, 'ASSIGNED', admin_id, now() - interval '3 days' + interval '30 minutes', 'Assigned to Ayaan Verma'),
    (o1, 'ACCEPTED', op_ayaan, now() - interval '2 days' + interval '1 hour', 'Order accepted by operator'),
    (o1, 'PICKED_UP', op_ayaan, now() - interval '2 days' + interval '2 hours', 'Package picked up from warehouse'),
    (o1, 'IN_TRANSIT', op_ayaan, now() - interval '2 days' + interval '3 hours', 'Transit started'),
    (o1, 'DELIVERED', op_ayaan, now() - interval '2 days' + interval '6 hours', 'Delivered to Pune center'),
    (o1, 'COMPLETED', op_ayaan, now() - interval '2 days' + interval '7 hours', 'Order completed successfully');

  -- Status history for ORD1002
  INSERT INTO order_status_history (order_id, status, changed_by, changed_at, notes)
  VALUES
    (o2, 'NEW', admin_id, now() - interval '8 hours' - interval '30 minutes', 'Order created'),
    (o2, 'ASSIGNED', admin_id, now() - interval '8 hours', 'Assigned to Rahul Sharma'),
    (o2, 'ACCEPTED', op_rahul, now() - interval '5 hours', 'Order accepted by operator'),
    (o2, 'PICKED_UP', op_rahul, now() - interval '4 hours', 'Package picked up'),
    (o2, 'IN_TRANSIT', op_rahul, now() - interval '3 hours', 'Transit started toward Nashik');

  -- Status history for ORD1003
  INSERT INTO order_status_history (order_id, status, changed_by, changed_at, notes)
  VALUES
    (o3, 'NEW', admin_id, now() - interval '1 hour' - interval '15 minutes', 'Order created'),
    (o3, 'ASSIGNED', admin_id, now() - interval '1 hour', 'Assigned to Arjun Patel');

  -- Status history for ORD1004
  INSERT INTO order_status_history (order_id, status, changed_by, changed_at, notes)
  VALUES (o4, 'NEW', admin_id, now() - interval '30 minutes', 'Order created');

  -- Status history for ORD1005
  INSERT INTO order_status_history (order_id, status, changed_by, changed_at, notes)
  VALUES (o5, 'NEW', admin_id, now() - interval '15 minutes', 'Order created');

  -- Status history for ORD1006
  INSERT INTO order_status_history (order_id, status, changed_by, changed_at, notes)
  VALUES
    (o6, 'NEW', admin_id, now() - interval '2 days', 'Order created'),
    (o6, 'ASSIGNED', admin_id, now() - interval '2 days' + interval '20 minutes', 'Assigned to Priya Singh'),
    (o6, 'ACCEPTED', op_priya, now() - interval '1 day' + interval '1 hour', 'Order accepted by operator'),
    (o6, 'PICKED_UP', op_priya, now() - interval '1 day' + interval '2 hours', 'Package picked up'),
    (o6, 'IN_TRANSIT', op_priya, now() - interval '1 day' + interval '3 hours', 'Transit started'),
    (o6, 'DELIVERED', op_priya, now() - interval '1 day' + interval '5 hours', 'Delivered to Mysore hub'),
    (o6, 'COMPLETED', op_priya, now() - interval '1 day' + interval '6 hours', 'Order completed successfully');

  -- Notifications
  INSERT INTO notifications (user_id, message, order_id, read, created_at)
  VALUES
    (op_rahul, 'New order ORD1002 has been assigned to you.', o2, false, now() - interval '8 hours'),
    (op_arjun, 'New order ORD1003 has been assigned to you.', o3, false, now() - interval '1 hour');

  -- Update operator statuses: those with active orders are BUSY
  UPDATE profiles SET status = 'BUSY'
  WHERE id IN (SELECT DISTINCT operator_id FROM orders WHERE status IN ('ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'));

END $$;
