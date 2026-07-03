export interface TenantRecord {
  id: number
  name: string
  email: string
  plan: string
  status: number
  createdAt: string
  seats: number
  region: string
}

export const TENANT_STATUSES: Record<number, { title: string; color: string }> = {
  0: { title: 'Active',    color: 'green'  },
  1: { title: 'Trial',     color: 'blue'   },
  2: { title: 'Suspended', color: 'red'    },
  3: { title: 'Pending',   color: 'yellow' },
}

export const TENANT_PLANS = ['Starter', 'Pro', 'Enterprise']
export const TENANT_REGIONS = ['US', 'EU', 'APAC']

// TODO: replace with real tenant data
export const MOCK_TENANTS: TenantRecord[] = [
  { id: 1, name: 'Acme Corp',      email: 'admin@acme.com',     plan: 'Enterprise', status: 0, createdAt: '2023-01-12', seats: 120, region: 'EU'   },
  { id: 2, name: 'Globex Inc',     email: 'it@globex.com',      plan: 'Pro',        status: 1, createdAt: '2024-03-05', seats: 25,  region: 'US'   },
  { id: 3, name: 'Initech',        email: 'ops@initech.com',    plan: 'Starter',    status: 3, createdAt: '2024-06-18', seats: 5,   region: 'US'   },
  { id: 4, name: 'Umbrella Ltd',   email: 'admin@umbrella.com', plan: 'Enterprise', status: 2, createdAt: '2022-11-30', seats: 200, region: 'EU'   },
  { id: 5, name: 'Hooli',          email: 'dev@hooli.com',      plan: 'Pro',        status: 0, createdAt: '2023-08-22', seats: 40,  region: 'US'   },
  { id: 6, name: 'Pied Piper',     email: 'richard@pp.com',     plan: 'Starter',    status: 1, createdAt: '2024-09-01', seats: 8,   region: 'US'   },
  { id: 7, name: 'Dunder Mifflin', email: 'michael@dm.com',     plan: 'Pro',        status: 0, createdAt: '2023-04-17', seats: 30,  region: 'EU'   },
  { id: 8, name: 'Vandelay Ind.',  email: 'art@vandelay.com',   plan: 'Enterprise', status: 3, createdAt: '2024-10-03', seats: 75,  region: 'APAC' },
]
