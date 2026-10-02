/*
# Recreate auth users with proper bcrypt password format (v4 final)

Fixes:
1. bcrypt cost 10 (GoTrue-compatible, not cost 6 from pgcrypto default)
2. confirmed_at in auth.users is generated — not inserted
3. email in auth.identities is generated — not inserted
4. Correct column names: provider_id (not identity_id)
*/

DO $$
DECLARE
  admin_id uuid;
  op1_id uuid;
  op2_id uuid;
  op3_id uuid;
  op4_id uuid;
  op5_id uuid;
BEGIN
  admin_id := gen_random_uuid();
  op1_id := gen_random_uuid();
  op2_id := gen_random_uuid();
  op3_id := gen_random_uuid();
  op4_id := gen_random_uuid();
  op5_id := gen_random_uuid();

  -- Insert auth users with bcrypt cost 10
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_sso_user, is_anonymous)
  VALUES
    (admin_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@logiflow.com',
     crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
     jsonb_build_object('role', 'ADMIN'), jsonb_build_object('name', 'Admin User'), false, false),
    (op1_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'operator@logiflow.com',
     crypt('operator123', gen_salt('bf', 10)), now(), now(), now(),
     jsonb_build_object('role', 'OPERATOR'), jsonb_build_object('name', 'Ayaan Verma'), false, false),
    (op2_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'rahul@logiflow.com',
     crypt('operator123', gen_salt('bf', 10)), now(), now(), now(),
     jsonb_build_object('role', 'OPERATOR'), jsonb_build_object('name', 'Rahul Sharma'), false, false),
    (op3_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'arjun@logiflow.com',
     crypt('operator123', gen_salt('bf', 10)), now(), now(), now(),
     jsonb_build_object('role', 'OPERATOR'), jsonb_build_object('name', 'Arjun Patel'), false, false),
    (op4_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'priya@logiflow.com',
     crypt('operator123', gen_salt('bf', 10)), now(), now(), now(),
     jsonb_build_object('role', 'OPERATOR'), jsonb_build_object('name', 'Priya Singh'), false, false),
    (op5_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'vikram@logiflow.com',
     crypt('operator123', gen_salt('bf', 10)), now(), now(), now(),
     jsonb_build_object('role', 'OPERATOR'), jsonb_build_object('name', 'Vikram Reddy'), false, false);

  -- Insert identities (email is a generated column — omit it)
  INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  VALUES
    (admin_id::text, admin_id, jsonb_build_object('sub', admin_id::text, 'email', 'admin@logiflow.com'), 'email', now(), now(), now()),
    (op1_id::text, op1_id, jsonb_build_object('sub', op1_id::text, 'email', 'operator@logiflow.com'), 'email', now(), now(), now()),
    (op2_id::text, op2_id, jsonb_build_object('sub', op2_id::text, 'email', 'rahul@logiflow.com'), 'email', now(), now(), now()),
    (op3_id::text, op3_id, jsonb_build_object('sub', op3_id::text, 'email', 'arjun@logiflow.com'), 'email', now(), now(), now()),
    (op4_id::text, op4_id, jsonb_build_object('sub', op4_id::text, 'email', 'priya@logiflow.com'), 'email', now(), now(), now()),
    (op5_id::text, op5_id, jsonb_build_object('sub', op5_id::text, 'email', 'vikram@logiflow.com'), 'email', now(), now(), now());

  -- Insert profiles
  INSERT INTO profiles (id, name, email, role, phone, employee_id, status, joining_date)
  VALUES
    (admin_id, 'Admin User', 'admin@logiflow.com', 'ADMIN', '+91-9876543210', 'EMP001', 'AVAILABLE', '2024-01-15'),
    (op1_id, 'Ayaan Verma', 'operator@logiflow.com', 'OPERATOR', '+91-9812345678', 'EMP002', 'AVAILABLE', '2024-02-01'),
    (op2_id, 'Rahul Sharma', 'rahul@logiflow.com', 'OPERATOR', '+91-9823456789', 'EMP003', 'AVAILABLE', '2024-02-15'),
    (op3_id, 'Arjun Patel', 'arjun@logiflow.com', 'OPERATOR', '+91-9834567890', 'EMP004', 'AVAILABLE', '2024-03-01'),
    (op4_id, 'Priya Singh', 'priya@logiflow.com', 'OPERATOR', '+91-9845678901', 'EMP005', 'AVAILABLE', '2024-03-15'),
    (op5_id, 'Vikram Reddy', 'vikram@logiflow.com', 'OPERATOR', '+91-9856789012', 'EMP006', 'AVAILABLE', '2024-04-01')
  ON CONFLICT (id) DO NOTHING;

END $$;
