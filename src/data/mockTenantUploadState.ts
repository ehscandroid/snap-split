// TODO: mock per-tenant upload state — remove once wired to real API data
const UPLOAD_FAIL_REASONS = ['File too large', 'Invalid format', 'Connection timeout', 'Server error']

export interface MockTenantUploadState {
  uploadedAt?: string
  uploadFailed?: boolean
  uploadFailReason?: string
}

const hashString = (value: string): number => {
  let hash = 0
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) | 0
  return Math.abs(hash)
}

export const getMockTenantUploadState = (tenantId: string): MockTenantUploadState => {
  switch (hashString(tenantId) % 4) {
    case 0: return { uploadedAt: '2026-01-01' } // up to date
    case 1: return { uploadedAt: '2024-01-01' } // outdated
    case 2: return {} // never uploaded
    default: return { uploadFailed: true, uploadFailReason: UPLOAD_FAIL_REASONS[tenantId % UPLOAD_FAIL_REASONS.length] }
  }
}
