/*
# Seed Demo Users and Profiles

1. Creates demo auth users via auth.users (idempotent):
   - admin@logiflow.com (ADMIN)
   - operator@logiflow.com (OPERATOR)
   - Plus 4 additional operators for a realistic fleet

2. Creates corresponding profiles in the profiles table with role, phone, employee_id, and status.

3. Notes:
   - Uses gen_random_uuid() for user IDs if users don't exist.
   - Passwords are hashed with crypt() from pgcrypto.
   - Idempotent: uses ON CONFLICT / WHERE NOT EXISTS patterns.
*/

-- Helper function to find user by email
DO $$
DECLARE
  admin_id uuid;
  op1_id uuid;
  op2_id uuid;
  op3_id uuid;
  op4_id uuid;
  op5_id uuid;
BEGIN
  -- Create admin user
  SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@logiflow.com';
  IF admin_id IS NULL THEN
    admin_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role, raw_app_meta_data, raw_user_meta_data)
    VALUES (admin_id, '00000000-0000-0000-0000-000000000000', 'admin@logiflow.com',
      crypt('admin123', gen_salt('bf')), now(), now(), now(), 'authenticated', 'authenticated',
      jsonb_build_object('role', 'ADMIN'), jsonb_build_object('name', 'Admin User'));
  END IF;

  -- Create operator 1 (main demo operator)
  SELECT id INTO op1_id FROM auth.users WHERE email = 'operator@logiflow.com';
  IF op1_id IS NULL THEN
    op1_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role, raw_app_meta_data, raw_user_meta_data)
    VALUES (op1_id, '00000000-0000-0000-0000-000000000000', 'operator@logiflow.com',
      crypt('operator123', gen_salt('bf')), now(), now(), now(), 'authenticated', 'authenticated',
      jsonb_build_object('role', 'OPERATOR'), jsonb_build_object('name', 'Ayaan Verma'));
  END IF;

  -- Create operator 2
  SELECT id INTO op2_id FROM auth.users WHERE email = 'rahul@logiflow.com';
  IF op2_id IS NULL THEN
    op2_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role, raw_app_meta_data, raw_user_meta_data)
    VALUES (op2_id, '00000000-0000-0000-0000-000000000000', 'rahul@logiflow.com',
      crypt('operator123', gen_salt('bf')), now(), now(), now(), 'authenticated', 'authenticated',
      jsonb_build_object('role', 'OPERATOR'), jsonb_build_object('name', 'Rahul Sharma'));
  END IF;

  -- Create operator 3
  SELECT id INTO op3_id FROM auth.users WHERE email = 'arjun@logiflow.com';
  IF op3_id IS NULL THEN
    op3_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role, raw_app_meta_data, raw_user_meta_data)
    VALUES (op3_id, '00000000-0000-0000-0000-000000000000', 'arjun@logiflow.com',
      crypt('operator123', gen_salt('bf')), now(), now(), now(), 'authenticated', 'authenticated',
      jsonb_build_object('role', 'OPERATOR'), jsonb_build_object('name', 'Arjun Patel'));
  END IF;

  -- Create operator 4
  SELECT id INTO op4_id FROM auth.users WHERE email = 'priya@logiflow.com';
  IF op4_id IS NULL THEN
    op4_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role, raw_app_meta_data, raw_user_meta_data)
    VALUES (op4_id, '00000000-0000-0000-0000-000000000000', 'priya@logiflow.com',
      crypt('operator123', gen_salt('bf')), now(), now(), now(), 'authenticated', 'authenticated',
      jsonb_build_object('role', 'OPERATOR'), jsonb_build_object('name', 'Priya Singh'));
  END IF;

  -- Create operator 5
  SELECT id INTO op5_id FROM auth.users WHERE email = 'vikram@logiflow.com';
  IF op5_id IS NULL THEN
    op5_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role, raw_app_meta_data, raw_user_meta_data)
    VALUES (op5_id, '00000000-0000-0000-0000-000000000000', 'vikram@logiflow.com',
      crypt('operator123', gen_salt('bf')), now(), now(), now(), 'authenticated', 'authenticated',
      jsonb_build_object('role', 'OPERATOR'), jsonb_build_object('name', 'Vikram Reddy'));
  END IF;

  -- Insert profiles (idempotent)
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
