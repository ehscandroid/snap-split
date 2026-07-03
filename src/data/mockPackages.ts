export interface PackageRecord {
  id: number
  name: string
  code: string
  dueDate: string
  items: number
  archived: boolean
  statusBreakdown: Record<number, number>
}

// TODO: replace with real package data
export const MOCK_PACKAGES: PackageRecord[] = [
  { id: 1, name: 'Starter Package',    code: 'PKG-001', dueDate: '2026-07-15', items: 24,  archived: false, statusBreakdown: { 1: 0.05, 5: 0.95 } },
  { id: 2, name: 'Pro Package',        code: 'PKG-002', dueDate: '2026-08-02', items: 58,  archived: false, statusBreakdown: { 0: 0.2, 3: 0.5, 91: 0.3 } },
  { id: 3, name: 'Enterprise Package', code: 'PKG-003', dueDate: '2026-09-20', items: 142, archived: false, statusBreakdown: { 2: 0.15, 5: 0.25, 90: 0.4, 92: 0.2 } },
  { id: 4, name: 'Legacy Package',     code: 'PKG-004', dueDate: '2026-06-15', items: 9,   archived: true,  statusBreakdown: { 91: 1 } },
]
