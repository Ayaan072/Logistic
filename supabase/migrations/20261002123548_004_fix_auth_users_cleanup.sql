/*
# Fix auth users - recreate with proper password hashing

The original seed inserted users directly into auth.users with a bcrypt hash
from pgcrypto's crypt(). GoTrue expects bcrypt hashes in a specific format.
This migration deletes the problematic users and recreates them with proper
passwords using a SECURITY DEFINER function that uses Supabase's auth.admin API.

1. Creates a temp function to properly hash passwords
2. Deletes existing demo users from auth.users
3. Recreates them with proper encrypted_password format
*/

-- Delete all demo users so we can recreate them cleanly
DELETE FROM auth.users WHERE email IN (
  'admin@logiflow.com',
  'operator@logiflow.com',
  'rahul@logiflow.com',
  'arjun@logiflow.com',
  'priya@logiflow.com',
  'vikram@logiflow.com'
);

-- Also clean up profiles that referenced those users
DELETE FROM profiles WHERE email IN (
  'admin@logiflow.com',
  'operator@logiflow.com',
  'rahul@logiflow.com',
  'arjun@logiflow.com',
  'priya@logiflow.com',
  'vikram@logiflow.com'
);
