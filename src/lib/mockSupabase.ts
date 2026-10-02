import type { Profile, Order, OrderStatusHistory, Notification } from '@/types';

// Mock IDs for seed users
const ADMIN_ID = '00000000-0000-0000-0000-000000000001';
const OP_AYAAN_ID = '00000000-0000-0000-0000-000000000002';
const OP_RAHUL_ID = '00000000-0000-0000-0000-000000000003';
const OP_ARJUN_ID = '00000000-0000-0000-0000-000000000004';
const OP_PRIYA_ID = '00000000-0000-0000-0000-000000000005';
const OP_VIKRAM_ID = '00000000-0000-0000-0000-000000000006';

interface MockAuthUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'ADMIN' | 'OPERATOR';
}

const SEED_USERS: MockAuthUser[] = [
  { id: ADMIN_ID, email: 'admin@logiflow.com', password: 'admin123', name: 'Admin User', role: 'ADMIN' },
  { id: OP_AYAAN_ID, email: 'operator@logiflow.com', password: 'operator123', name: 'Ayaan Verma', role: 'OPERATOR' },
  { id: OP_RAHUL_ID, email: 'rahul@logiflow.com', password: 'operator123', name: 'Rahul Sharma', role: 'OPERATOR' },
  { id: OP_ARJUN_ID, email: 'arjun@logiflow.com', password: 'operator123', name: 'Arjun Patel', role: 'OPERATOR' },
  { id: OP_PRIYA_ID, email: 'priya@logiflow.com', password: 'operator123', name: 'Priya Singh', role: 'OPERATOR' },
  { id: OP_VIKRAM_ID, email: 'vikram@logiflow.com', password: 'operator123', name: 'Vikram Reddy', role: 'OPERATOR' },
];

const SEED_PROFILES: Profile[] = [
  {
    id: ADMIN_ID,
    name: 'Admin User',
    email: 'admin@logiflow.com',
    role: 'ADMIN',
    phone: '+91-9876543210',
    employee_id: 'EMP001',
    status: 'AVAILABLE',
    joining_date: '2024-01-15',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: OP_AYAAN_ID,
    name: 'Ayaan Verma',
    email: 'operator@logiflow.com',
    role: 'OPERATOR',
    phone: '+91-9812345678',
    employee_id: 'EMP002',
    status: 'AVAILABLE',
    joining_date: '2024-02-01',
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    id: OP_RAHUL_ID,
    name: 'Rahul Sharma',
    email: 'rahul@logiflow.com',
    role: 'OPERATOR',
    phone: '+91-9823456789',
    employee_id: 'EMP003',
    status: 'BUSY',
    joining_date: '2024-02-15',
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: OP_ARJUN_ID,
    name: 'Arjun Patel',
    email: 'arjun@logiflow.com',
    role: 'OPERATOR',
    phone: '+91-9834567890',
    employee_id: 'EMP004',
    status: 'BUSY',
    joining_date: '2024-03-01',
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: OP_PRIYA_ID,
    name: 'Priya Singh',
    email: 'priya@logiflow.com',
    role: 'OPERATOR',
    phone: '+91-9845678901',
    employee_id: 'EMP005',
    status: 'AVAILABLE',
    joining_date: '2024-03-15',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: OP_VIKRAM_ID,
    name: 'Vikram Reddy',
    email: 'vikram@logiflow.com',
    role: 'OPERATOR',
    phone: '+91-9856789012',
    employee_id: 'EMP006',
    status: 'AVAILABLE',
    joining_date: '2024-04-01',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

const now = Date.now();
const SEED_ORDERS: Order[] = [
  {
    id: 'ord-001',
    order_number: 'ORD1001',
    customer_name: 'Rajesh Kumar',
    customer_phone: '+91-9912345670',
    pickup_address: 'Mumbai Warehouse, Andheri East',
    delivery_address: 'Pune Distribution Center, Hinjewadi',
    package_type: 'Electronic Equipment',
    package_weight: 18,
    priority: 'HIGH',
    delivery_date: new Date(now - 2 * 86400000).toISOString().split('T')[0],
    notes: 'Fragile - handle with care',
    status: 'COMPLETED',
    operator_id: OP_AYAAN_ID,
    accepted_at: new Date(now - 2 * 86400000 + 3600000).toISOString(),
    picked_up_at: new Date(now - 2 * 86400000 + 7200000).toISOString(),
    in_transit_at: new Date(now - 2 * 86400000 + 10800000).toISOString(),
    delivered_at: new Date(now - 2 * 86400000 + 21600000).toISOString(),
    completed_at: new Date(now - 2 * 86400000 + 25200000).toISOString(),
    created_at: new Date(now - 3 * 86400000).toISOString(),
    updated_at: new Date(now - 2 * 86400000 + 25200000).toISOString(),
  },
  {
    id: 'ord-002',
    order_number: 'ORD1002',
    customer_name: 'Sunita Deshmukh',
    customer_phone: '+91-9912345671',
    pickup_address: 'Thane Logistics Hub, Ghodbunder Road',
    delivery_address: 'Nashik Central Warehouse, Satpur',
    package_type: 'Documents',
    package_weight: 2,
    priority: 'LOW',
    delivery_date: new Date(now).toISOString().split('T')[0],
    notes: 'Confidential documents',
    status: 'IN_TRANSIT',
    operator_id: OP_RAHUL_ID,
    accepted_at: new Date(now - 5 * 3600000).toISOString(),
    picked_up_at: new Date(now - 4 * 3600000).toISOString(),
    in_transit_at: new Date(now - 3 * 3600000).toISOString(),
    delivered_at: null,
    completed_at: null,
    created_at: new Date(now - 8 * 3600000).toISOString(),
    updated_at: new Date(now - 3 * 3600000).toISOString(),
  },
  {
    id: 'ord-003',
    order_number: 'ORD1003',
    customer_name: 'Mahesh Iyer',
    customer_phone: '+91-9912345672',
    pickup_address: 'Mumbai Port Trust, Ballard Estate',
    delivery_address: 'Surat Textile Market, Ring Road',
    package_type: 'Clothing',
    package_weight: 45,
    priority: 'MEDIUM',
    delivery_date: new Date(now + 86400000).toISOString().split('T')[0],
    notes: 'Bulk textile shipment',
    status: 'ASSIGNED',
    operator_id: OP_ARJUN_ID,
    accepted_at: null,
    picked_up_at: null,
    in_transit_at: null,
    delivered_at: null,
    completed_at: null,
    created_at: new Date(now - 3600000).toISOString(),
    updated_at: new Date(now - 3600000).toISOString(),
  },
  {
    id: 'ord-004',
    order_number: 'ORD1004',
    customer_name: 'Deepika Nair',
    customer_phone: '+91-9912345673',
    pickup_address: 'Pune Industrial Area, Chakan',
    delivery_address: 'Mumbai Logistics Center, Bhiwandi',
    package_type: 'Machinery',
    package_weight: 120,
    priority: 'HIGH',
    delivery_date: new Date(now + 2 * 86400000).toISOString().split('T')[0],
    notes: 'Heavy machinery - forklift required',
    status: 'NEW',
    operator_id: null,
    accepted_at: null,
    picked_up_at: null,
    in_transit_at: null,
    delivered_at: null,
    completed_at: null,
    created_at: new Date(now - 1800000).toISOString(),
    updated_at: new Date(now - 1800000).toISOString(),
  },
  {
    id: 'ord-005',
    order_number: 'ORD1005',
    customer_name: 'Karan Mehta',
    customer_phone: '+91-9912345674',
    pickup_address: 'Delhi Cargo Terminal, Okhla',
    delivery_address: 'Gurugram Warehouse, Sector 18',
    package_type: 'Furniture',
    package_weight: 65,
    priority: 'MEDIUM',
    delivery_date: new Date(now + 3 * 86400000).toISOString().split('T')[0],
    notes: 'Assembly required at destination',
    status: 'NEW',
    operator_id: null,
    accepted_at: null,
    picked_up_at: null,
    in_transit_at: null,
    delivered_at: null,
    completed_at: null,
    created_at: new Date(now - 900000).toISOString(),
    updated_at: new Date(now - 900000).toISOString(),
  },
  {
    id: 'ord-006',
    order_number: 'ORD1006',
    customer_name: 'Ananya Gupta',
    customer_phone: '+91-9912345675',
    pickup_address: 'Bangalore Tech Park, Whitefield',
    delivery_address: 'Mysore Distribution Hub, Hebbal',
    package_type: 'Electronic Equipment',
    package_weight: 25,
    priority: 'HIGH',
    delivery_date: new Date(now - 86400000).toISOString().split('T')[0],
    notes: 'Server equipment - temperature sensitive',
    status: 'COMPLETED',
    operator_id: OP_PRIYA_ID,
    accepted_at: new Date(now - 86400000 + 3600000).toISOString(),
    picked_up_at: new Date(now - 86400000 + 7200000).toISOString(),
    in_transit_at: new Date(now - 86400000 + 10800000).toISOString(),
    delivered_at: new Date(now - 86400000 + 18000000).toISOString(),
    completed_at: new Date(now - 86400000 + 21600000).toISOString(),
    created_at: new Date(now - 2 * 86400000).toISOString(),
    updated_at: new Date(now - 86400000 + 21600000).toISOString(),
  },
];

const SEED_HISTORY: OrderStatusHistory[] = [
  { id: 'h-101', order_id: 'ord-001', status: 'NEW', changed_by: ADMIN_ID, changed_at: new Date(now - 3 * 86400000).toISOString(), notes: 'Order created' },
  { id: 'h-102', order_id: 'ord-001', status: 'ASSIGNED', changed_by: ADMIN_ID, changed_at: new Date(now - 3 * 86400000 + 1800000).toISOString(), notes: 'Assigned to Ayaan Verma' },
  { id: 'h-103', order_id: 'ord-001', status: 'ACCEPTED', changed_by: OP_AYAAN_ID, changed_at: new Date(now - 2 * 86400000 + 3600000).toISOString(), notes: 'Order accepted by operator' },
  { id: 'h-104', order_id: 'ord-001', status: 'PICKED_UP', changed_by: OP_AYAAN_ID, changed_at: new Date(now - 2 * 86400000 + 7200000).toISOString(), notes: 'Package picked up from warehouse' },
  { id: 'h-105', order_id: 'ord-001', status: 'IN_TRANSIT', changed_by: OP_AYAAN_ID, changed_at: new Date(now - 2 * 86400000 + 10800000).toISOString(), notes: 'Transit started' },
  { id: 'h-106', order_id: 'ord-001', status: 'DELIVERED', changed_by: OP_AYAAN_ID, changed_at: new Date(now - 2 * 86400000 + 21600000).toISOString(), notes: 'Delivered to Pune center' },
  { id: 'h-107', order_id: 'ord-001', status: 'COMPLETED', changed_by: OP_AYAAN_ID, changed_at: new Date(now - 2 * 86400000 + 25200000).toISOString(), notes: 'Order completed successfully' },

  { id: 'h-201', order_id: 'ord-002', status: 'NEW', changed_by: ADMIN_ID, changed_at: new Date(now - 8.5 * 3600000).toISOString(), notes: 'Order created' },
  { id: 'h-202', order_id: 'ord-002', status: 'ASSIGNED', changed_by: ADMIN_ID, changed_at: new Date(now - 8 * 3600000).toISOString(), notes: 'Assigned to Rahul Sharma' },
  { id: 'h-203', order_id: 'ord-002', status: 'ACCEPTED', changed_by: OP_RAHUL_ID, changed_at: new Date(now - 5 * 3600000).toISOString(), notes: 'Order accepted by operator' },
  { id: 'h-204', order_id: 'ord-002', status: 'PICKED_UP', changed_by: OP_RAHUL_ID, changed_at: new Date(now - 4 * 3600000).toISOString(), notes: 'Package picked up' },
  { id: 'h-205', order_id: 'ord-002', status: 'IN_TRANSIT', changed_by: OP_RAHUL_ID, changed_at: new Date(now - 3 * 3600000).toISOString(), notes: 'Transit started toward Nashik' },

  { id: 'h-301', order_id: 'ord-003', status: 'NEW', changed_by: ADMIN_ID, changed_at: new Date(now - 1.25 * 3600000).toISOString(), notes: 'Order created' },
  { id: 'h-302', order_id: 'ord-003', status: 'ASSIGNED', changed_by: ADMIN_ID, changed_at: new Date(now - 3600000).toISOString(), notes: 'Assigned to Arjun Patel' },

  { id: 'h-401', order_id: 'ord-004', status: 'NEW', changed_by: ADMIN_ID, changed_at: new Date(now - 1800000).toISOString(), notes: 'Order created' },
  { id: 'h-501', order_id: 'ord-005', status: 'NEW', changed_by: ADMIN_ID, changed_at: new Date(now - 900000).toISOString(), notes: 'Order created' },

  { id: 'h-601', order_id: 'ord-006', status: 'NEW', changed_by: ADMIN_ID, changed_at: new Date(now - 2 * 86400000).toISOString(), notes: 'Order created' },
  { id: 'h-602', order_id: 'ord-006', status: 'ASSIGNED', changed_by: ADMIN_ID, changed_at: new Date(now - 2 * 86400000 + 1200000).toISOString(), notes: 'Assigned to Priya Singh' },
  { id: 'h-603', order_id: 'ord-006', status: 'ACCEPTED', changed_by: OP_PRIYA_ID, changed_at: new Date(now - 86400000 + 3600000).toISOString(), notes: 'Order accepted by operator' },
  { id: 'h-604', order_id: 'ord-006', status: 'PICKED_UP', changed_by: OP_PRIYA_ID, changed_at: new Date(now - 86400000 + 7200000).toISOString(), notes: 'Package picked up' },
  { id: 'h-605', order_id: 'ord-006', status: 'IN_TRANSIT', changed_by: OP_PRIYA_ID, changed_at: new Date(now - 86400000 + 10800000).toISOString(), notes: 'Transit started' },
  { id: 'h-606', order_id: 'ord-006', status: 'DELIVERED', changed_by: OP_PRIYA_ID, changed_at: new Date(now - 86400000 + 18000000).toISOString(), notes: 'Delivered to Mysore hub' },
  { id: 'h-607', order_id: 'ord-006', status: 'COMPLETED', changed_by: OP_PRIYA_ID, changed_at: new Date(now - 86400000 + 21600000).toISOString(), notes: 'Order completed successfully' },
];

const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: 'n-1',
    user_id: OP_RAHUL_ID,
    message: 'New order ORD1002 has been assigned to you.',
    order_id: 'ord-002',
    read: false,
    created_at: new Date(now - 8 * 3600000).toISOString(),
  },
  {
    id: 'n-2',
    user_id: OP_ARJUN_ID,
    message: 'New order ORD1003 has been assigned to you.',
    order_id: 'ord-003',
    read: false,
    created_at: new Date(now - 3600000).toISOString(),
  },
  {
    id: 'n-3',
    user_id: ADMIN_ID,
    message: 'Order ORD1001 was completed by Ayaan Verma.',
    order_id: 'ord-001',
    read: true,
    created_at: new Date(now - 2 * 86400000).toISOString(),
  },
];

interface MockDatabase {
  profiles: Profile[];
  orders: Order[];
  order_status_history: OrderStatusHistory[];
  notifications: Notification[];
}

const STORAGE_KEY = 'logiflow_mock_database_v2';
const SESSION_KEY = 'logiflow_mock_session_v2';

function loadDatabase(): MockDatabase {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  const initial: MockDatabase = {
    profiles: SEED_PROFILES,
    orders: SEED_ORDERS,
    order_status_history: SEED_HISTORY,
    notifications: SEED_NOTIFICATIONS,
  };
  saveDatabase(initial);
  return initial;
}

function saveDatabase(db: MockDatabase) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {}
}

let authListeners: Array<(event: string, session: any) => void> = [];

export function createMockSupabaseClient() {
  const getSessionFromStorage = () => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const setSessionToStorage = (session: any) => {
    try {
      if (session) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch {}
  };

  return {
    auth: {
      async getSession() {
        return { data: { session: getSessionFromStorage() }, error: null };
      },
      onAuthStateChange(callback: (event: string, session: any) => void) {
        authListeners.push(callback);
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                authListeners = authListeners.filter((l) => l !== callback);
              },
            },
          },
        };
      },
      async signInWithPassword({ email, password }: { email: string; password: string }) {
        const normalizedEmail = email.trim().toLowerCase();
        const user = SEED_USERS.find(
          (u) => u.email.toLowerCase() === normalizedEmail || u.name.toLowerCase() === normalizedEmail
        );

        if (!user || user.password !== password) {
          return {
            data: { user: null, session: null },
            error: { message: 'Invalid login credentials. Use demo accounts provided below.' },
          };
        }

        const session = {
          user: {
            id: user.id,
            email: user.email,
            user_metadata: { role: user.role, name: user.name },
          },
          access_token: 'mock-jwt-token-' + user.id,
          expires_at: Math.floor(Date.now() / 1000) + 86400,
        };

        setSessionToStorage(session);
        authListeners.forEach((fn) => fn('SIGNED_IN', session));
        return { data: { user: session.user, session }, error: null };
      },
      async signOut() {
        setSessionToStorage(null);
        authListeners.forEach((fn) => fn('SIGNED_OUT', null));
        return { error: null };
      },
    },

    from(tableName: keyof MockDatabase) {
      const db = loadDatabase();
      let queryTable = [...(db[tableName] || [])] as any[];
      let selectedCols = '*';
      let isSingle = false;
      let isMaybeSingle = false;
      let limitCount: number | null = null;
      const hasError: any = null;

      const enrichItem = (item: any) => {
        if (!item) return null;
        const copy = { ...item };
        if (tableName === 'orders' && selectedCols.includes('operator')) {
          copy.operator = db.profiles.find((p) => p.id === copy.operator_id) || null;
        }
        if (tableName === 'order_status_history' && selectedCols.includes('changed_by_profile')) {
          copy.changed_by_profile = db.profiles.find((p) => p.id === copy.changed_by) || null;
        }
        return copy;
      };

      const execute = async () => {
        if (hasError) return { data: null, error: hasError };
        let results = queryTable.map(enrichItem);

        if (limitCount !== null) {
          results = results.slice(0, limitCount);
        }

        if (isSingle) {
          if (results.length === 0) {
            return { data: null, error: { message: 'Row not found' } };
          }
          return { data: results[0], error: null };
        }

        if (isMaybeSingle) {
          return { data: results[0] || null, error: null };
        }

        return { data: results, error: null };
      };

      const chain: any = {
        then(resolve: (val: any) => any, reject?: (err: any) => any) {
          return execute().then(resolve, reject);
        },
        select(cols: string = '*') {
          selectedCols = cols;
          return chain;
        },
        eq(col: string, val: any) {
          queryTable = queryTable.filter((item) => item[col] === val);
          return chain;
        },
        in(col: string, vals: any[]) {
          queryTable = queryTable.filter((item) => vals.includes(item[col]));
          return chain;
        },
        order(col: string, { ascending = true }: { ascending?: boolean } = {}) {
          queryTable.sort((a, b) => {
            if (a[col] < b[col]) return ascending ? -1 : 1;
            if (a[col] > b[col]) return ascending ? 1 : -1;
            return 0;
          });
          return chain;
        },
        limit(n: number) {
          limitCount = n;
          return chain;
        },
        single() {
          isSingle = true;
          return chain;
        },
        maybeSingle() {
          isMaybeSingle = true;
          return chain;
        },
        insert(data: any) {
          const rows = Array.isArray(data) ? data : [data];
          const newRows = rows.map((r) => {
            const id = r.id || 'id-' + Math.random().toString(36).substr(2, 9);
            const nowStr = new Date().toISOString();
            return {
              ...r,
              id,
              created_at: r.created_at || nowStr,
              updated_at: r.updated_at || nowStr,
            };
          });

          (db[tableName] as any[]).push(...newRows);
          saveDatabase(db);
          queryTable = newRows;
          return chain;
        },
        update(updates: any) {
          return {
            eq(col: string, val: any) {
              const nowStr = new Date().toISOString();
              (db[tableName] as any[]) = (db[tableName] as any[]).map((item) => {
                if (item[col] === val) {
                  return { ...item, ...updates, updated_at: nowStr };
                }
                return item;
              });
              saveDatabase(db);
              return Promise.resolve({ error: null });
            },
          };
        },
      };

      return chain;
    },
  };
}
