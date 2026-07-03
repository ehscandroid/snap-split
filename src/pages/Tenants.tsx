import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { ConfirmModal } from '../components/ConfirmModal'
import { SdsPickerModal } from '../components/SdsPickerModal'
import TenantsTable from '../components/TenantsTable'
import { Button } from '../components/Button'
import { UploadChip } from '../components/Status'
import { useTenants } from '../hooks/useTenants'
import { TENANT_PLANS, TENANT_REGIONS, TENANT_STATUSES, type TenantRecord } from '../data/mockTenants'
import { MOCK_SDS, type SdsRecord } from '../data/mockSds'

const inputClass = "w-full px-3.5 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-[15px] font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-300 dark:focus:border-white/20 transition-colors"

type ModalTab = 'basic' | 'sds'

interface SdsLink {
  sds: SdsRecord
  linkId: number
  active: boolean
  updatedAt: string
  isNew: boolean
  // TODO: replace with real upload data once wired to the API
  uploadedAt?: string
  uploadFailed?: boolean
  uploadFailReason?: string
}

// TODO: mock upload state — remove once wired to real API data. Cycles through
// all 4 states (up to date / outdated / never / failed) so any tenant's linked
// SDS rows demonstrate the full set.
const UPLOAD_FAIL_REASONS = ['File too large', 'Invalid format', 'Connection timeout', 'Server error']

const getMockUploadState = (sds: SdsRecord): { uploadedAt?: string; uploadFailed?: boolean; uploadFailReason?: string } => {
  switch (sds.id % 4) {
    case 0: return { uploadedAt: '2026-01-01' } // up to date
    case 1: return { uploadedAt: '2024-01-01' } // outdated
    case 2: return {} // never uploaded
    default: return { uploadFailed: true, uploadFailReason: UPLOAD_FAIL_REASONS[sds.id % UPLOAD_FAIL_REASONS.length] }
  }
}

const Tenants = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { tenants, updateTenant, addTenant, deleteTenant } = useTenants()
  const [isCreating, setIsCreating] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<ModalTab>('basic')
  const [addSdsOpen, setAddSdsOpen] = useState(false)
  const [links, setLinks] = useState<SdsLink[]>([])
  const [selectedLinks, setSelectedLinks] = useState<Set<number>>(new Set())
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [plan, setPlan] = useState(TENANT_PLANS[0])
  const [status, setStatus] = useState(0)
  const [seats, setSeats] = useState(0)
  const [region, setRegion] = useState(TENANT_REGIONS[0])

  const id = searchParams.get('id')
  const detail: TenantRecord | undefined = tenants.find((row) => row.id === Number(id))
  const isOpen = isCreating || !!detail
  const availableSds = MOCK_SDS.filter((sds) => !links.some((link) => link.sds.id === sds.id))

  useEffect(() => {
    if (!detail) return
    setName(detail.name)
    setEmail(detail.email)
    setPlan(detail.plan)
    setStatus(detail.status)
    setSeats(detail.seats)
    setRegion(detail.region)
    setLinks(
      MOCK_SDS
        .filter((sds) => sds.tenants.some((t) => t.id === detail.id))
        .map((sds) => ({
          sds,
          linkId: sds.id + 100,
          active: sds.status !== 92 && sds.status !== 99,
          updatedAt: sds.revisionDate,
          isNew: false,
          ...getMockUploadState(sds),
        }))
    )
    setSelectedLinks(new Set())
  }, [detail?.id])

  const closeModal = () => {
    setIsCreating(false)
    setActiveTab('basic')
    setAddSdsOpen(false)
    setSearchParams({})
  }

  const addSds = (sdsToAdd: SdsRecord[]) => {
    setLinks((prev) => [
      ...prev,
      ...sdsToAdd.map((sds) => ({ sds, linkId: sds.id + 100, active: true, updatedAt: new Date().toISOString().slice(0, 10), isNew: true })),
    ])
    setAddSdsOpen(false)
  }

  const toggleLinkSelect = (sdsId: number) => {
    setSelectedLinks((prev) => {
      const next = new Set(prev)
      next.has(sdsId) ? next.delete(sdsId) : next.add(sdsId)
      return next
    })
  }

  const toggleLinkActive = (sdsId: number) => {
    setLinks((prev) => prev.map((link) => (link.sds.id === sdsId && link.isNew ? { ...link, active: !link.active } : link)))
  }

  const setLinkId = (sdsId: number, value: string) => {
    const num = Number(value)
    if (Number.isNaN(num)) return
    setLinks((prev) => prev.map((link) => (link.sds.id === sdsId && link.isNew ? { ...link, linkId: num } : link)))
  }

  const removeSelectedLinks = () => {
    setLinks((prev) => prev.filter((link) => !selectedLinks.has(link.sds.id)))
    setSelectedLinks(new Set())
  }

  const handleUpload = () => {
    // TODO: wire to real upload endpoint
    console.log('upload SDS document for tenant', detail?.id)
  }

  const openModal = (tenantId: number) => {
    setSearchParams({ id: String(tenantId) })
  }

  const openCreateModal = () => {
    setName('')
    setEmail('')
    setPlan(TENANT_PLANS[0])
    setStatus(0)
    setSeats(0)
    setRegion(TENANT_REGIONS[0])
    setActiveTab('basic')
    setIsCreating(true)
  }

  const handleSave = () => {
    if (isCreating) {
      addTenant({ name, email, plan, status, seats, region, createdAt: new Date().toISOString().slice(0, 10) })
    } else if (detail) {
      updateTenant(detail.id, { name, email, plan, status, seats, region })
    }
    closeModal()
  }

  const handleDelete = () => {
    if (!detail) return
    deleteTenant(detail.id)
    setConfirmDeleteOpen(false)
    closeModal()
  }

  return (
    <>
      <TenantsTable onRowClick={openModal} onAdd={openCreateModal} />

      {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={closeModal}>
        <div
          className="bg-white dark:bg-[#1e1e1e] rounded-2xl w-full max-w-2xl mx-4 shadow-2xl border border-[#eef1f5] dark:border-white/10 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-4 px-6 py-5">
            <div className="w-11 h-11 rounded-xl bg-[#f1f4f8] dark:bg-white/5 flex items-center justify-center flex-shrink-0">
              <Icon icon="mdi:domain" width={22} height={22} className="text-[#475569] dark:text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[17px] font-bold text-[#0f172a] dark:text-gray-100 truncate">
                {isCreating ? 'New Tenant' : detail?.name}
              </h2>
              {!isCreating && (
                <p className="text-[13px] text-[#64748b] dark:text-gray-400 mt-0.5 truncate">{detail?.email}</p>
              )}
            </div>
            {!isCreating && (
              <button
                onClick={() => { setActiveTab(activeTab === 'basic' ? 'sds' : 'basic'); setAddSdsOpen(false); setSelectedLinks(new Set()) }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors flex-shrink-0"
              >
                {activeTab === 'sds' && <Icon icon="mdi:arrow-left" width={14} height={14} />}
                {activeTab === 'basic'
                  ? `SDS${links.length ? ` (${links.length})` : ''}`
                  : 'Basic Data'}
                {activeTab === 'basic' && <Icon icon="mdi:arrow-right" width={14} height={14} />}
              </button>
            )}
            <button
              onClick={closeModal}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#94a3b8] hover:text-[#475569] hover:bg-[#f1f4f8] dark:hover:bg-white/5 transition-colors flex-shrink-0"
            >
              <Icon icon="mdi:close" width={18} height={18} />
            </button>
          </div>

          <div className="border-t border-gray-100 dark:border-white/10">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${(isCreating ? 0 : activeTab === 'sds' ? 1 : 0) * 100}%)` }}
              >
                {/* Basic Data pane */}
                <div className="w-full flex-shrink-0 px-6 py-6 flex flex-col gap-5 h-[360px] overflow-y-auto">
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1.5">
                      Tenant Name <span className="text-red-500">*</span>
                    </label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1.5">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1.5">Plan</label>
                      <select value={plan} onChange={(e) => setPlan(e.target.value)} className={inputClass}>
                        {TENANT_PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1.5">Status</label>
                      <select value={status} onChange={(e) => setStatus(Number(e.target.value))} className={inputClass}>
                        {Object.entries(TENANT_STATUSES).map(([code, s]) => (
                          <option key={code} value={code}>{s.title}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1.5">Region</label>
                      <select value={region} onChange={(e) => setRegion(e.target.value)} className={inputClass}>
                        {TENANT_REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1.5">Seats</label>
                      <input
                        type="number"
                        min={0}
                        value={seats}
                        onChange={(e) => setSeats(Number(e.target.value))}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* Connected SDS pane */}
                <div className="w-full flex-shrink-0 h-[360px] overflow-y-auto pl-3 pr-6">
                  {links.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-sm text-gray-400 dark:text-gray-500">No connected SDS records</p>
                    </div>
                  ) : (
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="w-10 px-3 h-9 text-left sticky top-0 bg-white dark:bg-[#1e1e1e]" />
                          <th className="h-9 px-2 text-left text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider sticky top-0 bg-white dark:bg-[#1e1e1e]">
                            Substance
                          </th>
                          <th className="h-9 px-2 text-left text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider sticky top-0 bg-white dark:bg-[#1e1e1e] w-20">
                            ID
                          </th>
                          <th className="h-9 px-2 text-left text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider sticky top-0 bg-white dark:bg-[#1e1e1e] w-16">
                            Active
                          </th>
                          <th className="h-9 px-2 text-left text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider sticky top-0 bg-white dark:bg-[#1e1e1e] w-40">
                            Uploaded
                          </th>
                        </tr>
                        <tr><td colSpan={5} className="h-px bg-gray-100 dark:bg-white/5 p-0 sticky top-9" /></tr>
                      </thead>
                      <tbody>
                        {links.map((link) => {
                          const isSelected = selectedLinks.has(link.sds.id)
                          const locked = !link.isNew
                          return (
                            <tr key={link.sds.id} className="border-b border-gray-100 dark:border-white/5">
                              <td className="w-10 px-3 py-2.5 align-middle">
                                {locked ? (
                                  <Icon icon="mdi:lock-outline" width={15} height={15} className="text-gray-300 dark:text-gray-600" />
                                ) : (
                                  <svg
                                    className="w-5 h-5 cursor-pointer transition-colors"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                    onClick={() => toggleLinkSelect(link.sds.id)}
                                  >
                                    <rect x="3" y="3" width="18" height="18" rx="2" className={isSelected ? '' : 'fill-none stroke-gray-300 hover:stroke-gray-400'} style={isSelected ? { fill: 'var(--accent)', stroke: 'var(--accent)' } : {}} />
                                    {isSelected && <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" stroke="white" strokeWidth="2.5" />}
                                  </svg>
                                )}
                              </td>
                              <td className="px-2 py-2.5 align-middle">
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{link.sds.name}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">{link.sds.casNumber}</p>
                              </td>
                              <td className="px-2 py-2.5 align-middle">
                                <input
                                  type="number"
                                  value={link.linkId}
                                  disabled={locked}
                                  onChange={(e) => setLinkId(link.sds.id, e.target.value)}
                                  className="w-16 px-2 py-1.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-gray-300 dark:focus:border-white/20 disabled:opacity-60 disabled:cursor-not-allowed"
                                />
                              </td>
                              <td className="px-2 py-2.5 align-middle">
                                <svg
                                  className={`w-5 h-5 transition-colors ${locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                  onClick={() => toggleLinkActive(link.sds.id)}
                                >
                                  <rect x="3" y="3" width="18" height="18" rx="2" className={link.active ? '' : 'fill-none stroke-gray-300 hover:stroke-gray-400'} style={link.active ? { fill: '#10b981', stroke: '#10b981' } : {}} />
                                  {link.active && <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" stroke="white" strokeWidth="2.5" />}
                                </svg>
                              </td>
                              <td className="px-2 py-2.5 align-middle">
                                <UploadChip
                                  uploadedAt={link.uploadedAt}
                                  latestAvailableAt={link.sds.revisionDate}
                                  failed={link.uploadFailed}
                                  reason={link.uploadFailReason}
                                />
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-white/10">
              {activeTab === 'sds' && !isCreating ? (
                <>
                  <Button variant="outline" onClick={() => setAddSdsOpen(true)}>
                    <Icon icon="mdi:plus" width={16} height={16} />
                    Add
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={removeSelectedLinks} disabled={selectedLinks.size === 0}>
                      <Icon icon="mdi:trash-can-outline" width={16} height={16} />
                      Remove
                    </Button>
                    <Button variant="success" onClick={handleUpload}>
                      <Icon icon="mdi:upload-outline" width={16} height={16} />
                      Upload
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {!isCreating ? (
                    <button
                      onClick={() => setConfirmDeleteOpen(true)}
                      title="Delete tenant"
                      className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <Icon icon="mdi:trash-can-outline" width={18} height={18} />
                    </button>
                  ) : <span />}
                  <Button variant="primary" onClick={handleSave}>
                    Save
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      )}

      <ConfirmModal
        open={confirmDeleteOpen}
        title="Delete tenant?"
        description={detail ? `"${detail.name}" will be permanently removed.` : undefined}
        onConfirm={handleDelete}
        onClose={() => setConfirmDeleteOpen(false)}
      />

      <SdsPickerModal
        open={addSdsOpen}
        onClose={() => setAddSdsOpen(false)}
        onAdd={addSds}
        options={availableSds}
      />
    </>
  )
}

export default Tenants
