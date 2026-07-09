import { useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import { Button } from './Button'
import { UploadChip } from './Status'
import { TagField } from './TagField'
import { TagPickerModal } from './TagPickerModal'
import { SectionTitle, HintField } from './FormElements'
import { SdsPickerModal } from './SdsPickerModal'
import { useTenants } from '../hooks/useTenants'
import { DEFAULT_TENANT_FILTER } from '../data/mockTenants'
import { MOCK_SDS, type SdsRecord } from '../data/mockSds'

const inputClass = "w-full px-3.5 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-[15px] font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-300 dark:focus:border-white/20 transition-colors"
const numberInputClass = `${inputClass} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`

// TODO: replace with real field options once wired to the API
const NO_UPDATE_FIELD_OPTIONS = ['Revision Date', 'Language', 'Region', 'Signal Word', 'Physical State']
const NO_IMPORT_FIELD_OPTIONS = ['UN Number', 'CAS Number', 'Supplier Name', 'Hazard Statements']

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

const SIMULATED_DELAY_MS = 300

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const fetchTenantSdsLinks = async (tenantId: string): Promise<SdsLink[]> => {
  // TODO: replace with real API call — await fetch(`/api/tenants/${tenantId}/sds`)
  await delay(SIMULATED_DELAY_MS)
  return MOCK_SDS
    .filter((sds) => sds.tenants.some((t) => t.id === tenantId))
    .map((sds) => ({
      sds,
      linkId: sds.id + 100,
      active: sds.status !== 92 && sds.status !== 99,
      updatedAt: sds.revisionDate,
      isNew: false,
      ...getMockUploadState(sds),
    }))
}

interface TenantFormData {
  name: string
  customer: string
  remark: string
  filter: string
  folderId: number
  maxFiles: number
  noUpdateFields: string[]
  noImportFields: string[]
  username: string
  password: string
}

const EMPTY_FORM_DATA: TenantFormData = {
  name: '',
  customer: '',
  remark: '',
  filter: DEFAULT_TENANT_FILTER,
  folderId: 0,
  maxFiles: 0,
  noUpdateFields: [],
  noImportFields: [],
  username: '',
  password: '',
}

interface TenantModalProps {
  tenantId?: string
  onClose: () => void
  onDeleteRequest: () => void
  onSaved: (newId: string) => void
}

export const TenantModal: React.FC<TenantModalProps> = ({ tenantId, onClose, onDeleteRequest, onSaved }) => {
  const { tenants, updateTenant, addTenant } = useTenants()
  const isCreating = !tenantId
  const detail = tenantId ? tenants.find((row) => row.id === tenantId) : undefined

  const [activeTab, setActiveTab] = useState<ModalTab>('basic')
  const [addSdsOpen, setAddSdsOpen] = useState(false)
  const [noUpdateFieldsPickerOpen, setNoUpdateFieldsPickerOpen] = useState(false)
  const [noImportFieldsPickerOpen, setNoImportFieldsPickerOpen] = useState(false)
  const [links, setLinks] = useState<SdsLink[]>([])
  const [linksLoading, setLinksLoading] = useState(false)
  const [selectedLinks, setSelectedLinks] = useState<Set<number>>(new Set())
  const [formData, setFormData] = useState<TenantFormData>(EMPTY_FORM_DATA)
  const [connectionSaved, setConnectionSaved] = useState(false)
  const [connectionPasswordPlaceholder, setConnectionPasswordPlaceholder] = useState(() => crypto.randomUUID())
  const filterRef = useRef<HTMLTextAreaElement>(null)

  const updateForm = (patch: Partial<TenantFormData>) => setFormData((prev) => ({ ...prev, ...patch }))

  const availableSds = MOCK_SDS.filter((sds) => !links.some((link) => link.sds.id === sds.id))
  const isFilterValid = (() => {
    try {
      return typeof JSON.parse(formData.filter) === 'object'
    } catch {
      return false
    }
  })()

  useEffect(() => {
    const textarea = filterRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [formData.filter])

  useEffect(() => {
    console.log('detail', detail)
  }, [detail])

  useEffect(() => {
    if (isCreating) {
      setFormData(EMPTY_FORM_DATA)
      setConnectionSaved(false)
      setConnectionPasswordPlaceholder(crypto.randomUUID())
      setActiveTab('basic')
      setLinks([])
      setSelectedLinks(new Set())
      return
    }
    if (!detail) return
    setFormData({
      ...EMPTY_FORM_DATA,
      name: detail.name,
      customer: detail.customer,
      remark: detail.remark,
      filter: detail.filter,
      noUpdateFields: detail.noUpdateFields,
      noImportFields: detail.noImportFields,
    })
    setConnectionSaved(false)
    setConnectionPasswordPlaceholder(crypto.randomUUID())
    setLinks([])
    setSelectedLinks(new Set())
  }, [isCreating, detail?.id])

  const changeTab = (tab: ModalTab) => {
    setActiveTab(tab)
    setAddSdsOpen(false)
    setSelectedLinks(new Set())
    if (tab === 'sds' && detail) {
      setLinksLoading(true)
      fetchTenantSdsLinks(detail.id).then((fetched) => {
        setLinks(fetched)
        setLinksLoading(false)
      })
    }
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

  const handleDownloadNow = () => {
    // TODO: wire to real download-to-content-portal endpoint
    console.log('download SDS to content portal for tenant', detail?.id, formData.filter)
  }

  const handleSaveConnection = () => {
    if (!formData.username || !formData.password) return
    // TODO: wire to real connection endpoint
    setConnectionSaved(true)
  }

  const handleSave = () => {
    if (!isFilterValid) return
    if (isCreating) {
      const newId = addTenant({ ...formData, email: '', status: 0, createdAt: new Date().toISOString().slice(0, 10) })
      onSaved(newId)
    } else if (detail) {
      updateTenant(detail.id, formData)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white dark:bg-[#1e1e1e] rounded-2xl w-full max-w-2xl mx-4 shadow-2xl border border-[#eef1f5] dark:border-white/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-4 px-6 h-[84px]">
          <div className="w-11 h-11 rounded-xl bg-[#f1f4f8] dark:bg-white/5 flex items-center justify-center flex-shrink-0">
            <Icon icon="mdi:domain" width={22} height={22} className="text-[#475569] dark:text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[17px] font-bold text-[#0f172a] dark:text-gray-100 truncate">
              {isCreating ? 'New Tenant' : detail?.name}
            </h2>
            {!isCreating && (
              <p className="text-[13px] text-[#64748b] dark:text-gray-400 mt-0.5 truncate">{detail?.customer}</p>
            )}
          </div>
          {!isCreating && (
            <button
              onClick={() => changeTab(activeTab === 'basic' ? 'sds' : 'basic')}
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
            onClick={onClose}
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
              <div className="w-full flex-shrink-0 px-6 py-6 flex flex-col gap-5 h-[560px] overflow-y-auto">
                {isCreating && (
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1.5">
                      Tenant Name <span className="text-red-500">*</span>
                    </label>
                    <input type="text" value={formData.name} onChange={(e) => updateForm({ name: e.target.value })} className={inputClass} />
                  </div>
                )}
                {isCreating && (
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1.5">Customer</label>
                    <input type="text" value={formData.customer} onChange={(e) => updateForm({ customer: e.target.value })} className={inputClass} />
                  </div>
                )}
                <SectionTitle bordered={false}>Upload to Customer tenant</SectionTitle>
                <HintField>You can upload SDS Data automatically to customer tenant.</HintField>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1.5">No-Update-Fields</label>
                    <TagField
                      value={formData.noUpdateFields}
                      onEdit={() => setNoUpdateFieldsPickerOpen(true)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1.5">No-Import-Fields</label>
                    <TagField
                      value={formData.noImportFields}
                      onEdit={() => setNoImportFieldsPickerOpen(true)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1.5">FolderID</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.folderId}
                    onChange={(e) => updateForm({ folderId: Number(e.target.value) })}
                    className={numberInputClass}
                  />
                </div>

                <SectionTitle bordered={false}>Connection</SectionTitle>
                <HintField>You need to have a valid connection key.</HintField>
                {connectionSaved ? (
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1.5">Connection Key</label>
                    <input type="text" value="*******" readOnly className={`${inputClass} opacity-60 cursor-not-allowed`} />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1.5">
                        Username <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => updateForm({ username: e.target.value })}
                        onBlur={handleSaveConnection}
                        placeholder="Content-Services"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1.5">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => updateForm({ password: e.target.value })}
                        onBlur={handleSaveConnection}
                        placeholder={connectionPasswordPlaceholder}
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}

                <SectionTitle
                  bordered={false}
                  action={
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadNow}
                      className="!border !border-white/10 !bg-[#2a2a2a] !text-gray-100 hover:!bg-[#333333]"
                    >
                      <Icon icon="mdi:tray-arrow-down" width={16} height={16} />
                      Download Now
                    </Button>
                  }
                >
                  Download Customer SDS
                </SectionTitle>
                <HintField>
                  Download SDS to the content portal from the customer tenant. Each SDS will create a new data record.
                  Use Filter to determine which files will be downloaded.
                </HintField>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm text-gray-500 dark:text-gray-400">Filter</label>
                    <span className={`flex items-center gap-1 text-xs font-medium ${isFilterValid ? 'text-gray-400 dark:text-gray-500' : 'text-red-500'}`}>
                      <Icon icon={isFilterValid ? 'mdi:check-circle-outline' : 'mdi:alert-circle-outline'} width={14} height={14} />
                      {isFilterValid ? 'Valid JSON' : 'Invalid JSON'}
                    </span>
                  </div>
                  <textarea
                    ref={filterRef}
                    value={formData.filter}
                    onChange={(e) => updateForm({ filter: e.target.value })}
                    rows={1}
                    spellCheck={false}
                    className={`${inputClass} font-mono text-[13px] text-gray-400 dark:text-gray-500 resize-none overflow-hidden ${!isFilterValid ? 'border-red-300 dark:border-red-500/50 focus:border-red-400 dark:focus:border-red-500/70' : ''}`}
                  />
                </div>

                <SectionTitle bordered={false}>Additional Information</SectionTitle>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1.5">Max Files</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.maxFiles}
                    onChange={(e) => updateForm({ maxFiles: Number(e.target.value) })}
                    className={numberInputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1.5">Remark</label>
                  <input type="text" value={formData.remark} onChange={(e) => updateForm({ remark: e.target.value })} className={inputClass} />
                </div>
              </div>

              {/* Connected SDS pane */}
              <div className="w-full flex-shrink-0 h-[560px] overflow-y-auto pl-3 pr-6">
                {linksLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-sm text-gray-400 dark:text-gray-500">Loading…</p>
                  </div>
                ) : links.length === 0 ? (
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
          <div className="flex items-center justify-between px-6 h-[72px] border-t border-gray-100 dark:border-white/10">
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
                    onClick={onDeleteRequest}
                    title="Delete tenant"
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <Icon icon="mdi:trash-can-outline" width={18} height={18} />
                  </button>
                ) : <span />}
                <Button variant="primary" onClick={handleSave} disabled={!isFilterValid}>
                  Save
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <SdsPickerModal
        open={addSdsOpen}
        onClose={() => setAddSdsOpen(false)}
        onAdd={addSds}
        options={availableSds}
      />

      <TagPickerModal
        open={noUpdateFieldsPickerOpen}
        title="No-Update-Fields"
        options={NO_UPDATE_FIELD_OPTIONS}
        selected={formData.noUpdateFields}
        onClose={() => setNoUpdateFieldsPickerOpen(false)}
        onSave={(tags) => updateForm({ noUpdateFields: tags })}
      />

      <TagPickerModal
        open={noImportFieldsPickerOpen}
        title="No-Import-Fields"
        options={NO_IMPORT_FIELD_OPTIONS}
        selected={formData.noImportFields}
        onClose={() => setNoImportFieldsPickerOpen(false)}
        onSave={(tags) => updateForm({ noImportFields: tags })}
      />
    </div>
  )
}

export default TenantModal
