export interface TenantRecord {
  id: string
  name: string
  email: string
  customer: string
  remark: string
  filter: string
  status: number
  createdAt: string
  noUpdateFields: string[]
  noImportFields: string[]
}

export const TENANT_STATUSES: Record<number, { title: string; color: string }> = {
  0: { title: 'Active',    color: 'green'  },
  1: { title: 'Trial',     color: 'blue'   },
  2: { title: 'Suspended', color: 'red'    },
  3: { title: 'Pending',   color: 'yellow' },
}

export const DEFAULT_TENANT_FILTER = JSON.stringify({ region: 'EU', category: 'flammable', extended: true })

// TODO: replace with real tenant data
export const MOCK_TENANTS: TenantRecord[] = [
  { id: 'a1b1c1d1-0001-4000-8000-000000000001', name: 'Acme Corp',      email: 'admin@acme.com',     customer: 'Acme Corp',      remark: '',                        filter: DEFAULT_TENANT_FILTER, status: 0, createdAt: '2023-01-12', noUpdateFields: [], noImportFields: [] },
  { id: 'a1b1c1d1-0002-4000-8000-000000000002', name: 'Globex Inc',     email: 'it@globex.com',      customer: 'Globex Inc',     remark: '',                        filter: DEFAULT_TENANT_FILTER, status: 1, createdAt: '2024-03-05', noUpdateFields: [], noImportFields: [] },
  { id: 'a1b1c1d1-0003-4000-8000-000000000003', name: 'Initech',        email: 'ops@initech.com',    customer: 'Initech',        remark: 'Trial extended once',     filter: DEFAULT_TENANT_FILTER, status: 3, createdAt: '2024-06-18', noUpdateFields: [], noImportFields: [] },
  { id: 'a1b1c1d1-0004-4000-8000-000000000004', name: 'Umbrella Ltd',   email: 'admin@umbrella.com', customer: 'Umbrella Ltd',   remark: 'Suspended for non-payment', filter: DEFAULT_TENANT_FILTER, status: 2, createdAt: '2022-11-30', noUpdateFields: [], noImportFields: [] },
  { id: 'a1b1c1d1-0005-4000-8000-000000000005', name: 'Hooli',          email: 'dev@hooli.com',      customer: 'Hooli',          remark: '',                        filter: DEFAULT_TENANT_FILTER, status: 0, createdAt: '2023-08-22', noUpdateFields: [], noImportFields: [] },
  { id: 'a1b1c1d1-0006-4000-8000-000000000006', name: 'Pied Piper',     email: 'richard@pp.com',     customer: 'Pied Piper',     remark: '',                        filter: DEFAULT_TENANT_FILTER, status: 1, createdAt: '2024-09-01', noUpdateFields: [], noImportFields: [] },
  { id: 'a1b1c1d1-0007-4000-8000-000000000007', name: 'Dunder Mifflin', email: 'michael@dm.com',     customer: 'Dunder Mifflin', remark: '',                        filter: DEFAULT_TENANT_FILTER, status: 0, createdAt: '2023-04-17', noUpdateFields: [], noImportFields: [] },
  { id: 'a1b1c1d1-0008-4000-8000-000000000008', name: 'Vandelay Ind.',  email: 'art@vandelay.com',   customer: 'Vandelay Ind.',  remark: '',                        filter: DEFAULT_TENANT_FILTER, status: 3, createdAt: '2024-10-03', noUpdateFields: [], noImportFields: [] },
]
