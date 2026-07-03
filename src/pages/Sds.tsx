import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useOutletContext } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { SdsIcon } from '../components/icons/SdsIcon'
import { FlagIcon } from '../components/FlagIcon'
import { Status, SdsDateTag } from '../components/Status'
import { FileUpload } from '../components/FormElements'
import { TextButton } from '../components/Button'
import { FieldCard, EditableValue, EditableTextarea, EditableSelect, ChipListField, CountBadge, TenantsField } from '../components/Sds'
import { TenantPickerModal } from '../components/TenantPickerModal'
import { MOCK_SDS, type SdsRecord, type TenantRef } from '../data/mockSds'
import { MOCK_TENANTS } from '../data/mockTenants'

const SIGNAL_WORD_OPTIONS = ['Danger', 'Warning', 'None']

const fields = [
  { label: 'CAS Number',          key: 'casNumber',        compact: true  },
  { label: 'Hazard Class',        key: 'hazardClass',      compact: false },
  { label: 'Molecular Formula',   key: 'molecularFormula', compact: true  },
  { label: 'Flash Point',         key: 'flashPoint',       compact: true  },
  { label: 'Boiling Point',       key: 'boilingPoint',     compact: true  },
  { label: 'Density',             key: 'density',          compact: true  },
  { label: 'Vapor Pressure',      key: 'vaporPressure',    compact: true  },
  { label: 'Solubility',          key: 'solubility',       compact: false },
  { label: 'Auto-Ignition Temp',  key: 'autoIgnitionTemp', compact: true  },
  { label: 'pH Range',            key: 'phRange',          compact: true  },
  { label: 'Storage Temperature', key: 'storageTemp',      compact: true  },
] as const

type FieldKey = typeof fields[number]['key']

const TWO_COL_MIN_WIDTH = 480

const Sds = () => {
  const { detailWidth } = useOutletContext<{ detailWidth: number }>()
  const [searchParams] = useSearchParams()
  const [detail, setDetail] = useState<SdsRecord | null>(null)
  const [loading, setLoading] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [formValues, setFormValues] = useState<Record<FieldKey, string>>({} as Record<FieldKey, string>)
  const [packages, setPackages] = useState<string[]>([])
  const [tenants, setTenants] = useState<TenantRef[]>([])
  const [notes, setNotes] = useState('')
  const [signalWord, setSignalWord] = useState('')
  const [tenantPickerOpen, setTenantPickerOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const id = searchParams.get('id')

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => setScrolled(el.scrollTop > 0)
    el.addEventListener('scroll', onScroll)
    onScroll()
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!id) { setDetail(null); return }

    const load = async () => {
      setLoading(true)
      try {
        // TODO: replace with real API call — await fetch(`/api/sds/${id}`)
        await new Promise((r) => setTimeout(r, 150))
        const found = MOCK_SDS.find((row) => row.id === Number(id)) ?? null
        setDetail(found)
        if (found) {
          setFormValues(Object.fromEntries(fields.map(({ key }) => [key, found[key]])) as Record<FieldKey, string>)
          setPackages(found.packages)
          setTenants(found.tenants)
          setNotes(found.notes)
          setSignalWord(found.signalWord)
        }
      } catch (err) {
        console.error('Error loading SDS detail:', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  if (!id) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400 dark:text-gray-500">
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-sm">Select an SDS to view details</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
        <span className="text-sm">Loading...</span>
      </div>
    )
  }

  if (!detail) return null

  return (
    <div className="h-full flex flex-col overflow-hidden">

      {/* Sticky header */}
      <div
        className="flex-shrink-0 px-5 py-4 bg-white dark:bg-[#1e1e1e] sticky top-0 z-10 transition-shadow duration-200"
        style={{ boxShadow: scrolled ? '0 2px 10px rgba(0,0,0,0.1)' : 'none' }}
      >
        <div className="flex items-center gap-4 w-full">
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center">
              <SdsIcon className="w-8 h-8" />
            </div>
            <Status
              code={1}
              form="dot"
              className="absolute -bottom-[3px] -right-[3px] w-[15px] h-[15px] ring-2 ring-white dark:ring-[#1e1e1e]"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[21px] font-bold text-[#0f172a] dark:text-gray-100 tracking-[-0.02em] truncate">
              {detail.name}
            </h1>
            <div className="flex items-center gap-2 mt-[7px] min-w-0">
              <p className="text-[14px] leading-[1.55] text-[#64748b] dark:text-gray-400 truncate">
                {`CAS ${detail.casNumber} · SDS #${detail.id}`}
              </p>
              <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] leading-none text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-white/5">
                {`Updated ${detail.lastUpdated}`}
              </span>
            </div>
          </div>
          <SdsDateTag date={detail.revisionDate} className="flex-shrink-0" />
          <FlagIcon
            countryCode="de"
            className="text-2xl rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.15)] flex-shrink-0"
          />
          <button
            type="button"
            onClick={() => setEditMode((prev) => !prev)}
            title={editMode ? 'Switch to preview' : 'Switch to edit'}
            className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <Icon icon={editMode ? 'mdi:eye-outline' : 'mdi:pencil-outline'} width={18} height={18} />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-auto p-6 space-y-6">

        <div className={`grid gap-1 ${detailWidth >= TWO_COL_MIN_WIDTH ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {fields.map(({ label, key, compact }) => (
            <FieldCard key={key} label={label} editable={editMode} className={compact ? '' : 'col-span-full'}>
              <EditableValue
                value={formValues[key] ?? ''}
                onChange={(val) => setFormValues((prev) => ({ ...prev, [key]: val }))}
                editable={editMode}
              />
            </FieldCard>
          ))}
          <FieldCard label="Packages" editable={editMode} trailing={<CountBadge count={packages.length} />} className="col-span-full">
            <ChipListField
              items={packages}
              itemKey={(pkg) => pkg}
              renderItem={(pkg) => pkg}
              editable={editMode}
              onRemove={(pkg) => setPackages((prev) => prev.filter((p) => p !== pkg))}
              onAdd={() => console.log('add package')}
            />
          </FieldCard>
          <TenantsField
            tenants={tenants}
            latestAvailableAt={detail.revisionDate}
            onOpenPicker={() => setTenantPickerOpen(true)}
            className="col-span-full"
          />
          <FieldCard label="Signal Word" editable={editMode} className="col-span-full">
            <EditableSelect value={signalWord} onChange={setSignalWord} editable={editMode} options={SIGNAL_WORD_OPTIONS} modalTitle="Select Signal Word" />
          </FieldCard>
          <FieldCard label="Notes" editable={editMode} className="col-span-full">
            <EditableTextarea value={notes} onChange={setNotes} editable={editMode} />
          </FieldCard>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Safety Data Sheet</p>
            <TextButton onClick={() => console.log('load 12 more')} className="!px-0 !py-0 text-xs">Load 12 more</TextButton>
          </div>
          <FileUpload
            title={`${detail.name}_SDS.pdf`}
            subtitle="PDF Document"
            size="1.2 MB"
            date={detail.revisionDate}
            icon="📄"
            onDelete={editMode ? () => console.log('delete SDS file') : undefined}
          />
        </div>

        <div>
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Hazard Statements</p>
          <div className="space-y-2">
            {['H225 — Highly flammable liquid and vapour', 'H302 — Harmful if swallowed', 'H319 — Causes serious eye irritation', 'H336 — May cause drowsiness or dizziness'].map((h) => (
              <div key={h} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                {h}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Precautionary Statements</p>
          <div className="space-y-2">
            {['P210 — Keep away from heat, sparks and open flames', 'P233 — Keep container tightly closed', 'P240 — Ground and bond container and receiving equipment', 'P241 — Use explosion-proof equipment', 'P242 — Use non-sparking tools', 'P243 — Take precautionary measures against static discharge'].map((p) => (
              <div key={p} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
                {p}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">First Aid Measures</p>
          <div className="space-y-3">
            {[
              { route: 'Inhalation', text: 'Remove person to fresh air and keep comfortable for breathing. Call a POISON CENTER if not feeling well.' },
              { route: 'Skin contact', text: 'Wash with plenty of water. If skin irritation occurs, get medical advice.' },
              { route: 'Eye contact', text: 'Rinse cautiously with water for several minutes. Remove contact lenses if present. Continue rinsing.' },
              { route: 'Ingestion', text: 'Rinse mouth. Do NOT induce vomiting. Immediately call a POISON CENTER.' },
            ].map(({ route, text }) => (
              <div key={route} className="bg-gray-50 dark:bg-white/5 rounded-lg px-4 py-3">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{route}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{text}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <TenantPickerModal
        open={tenantPickerOpen}
        onClose={() => setTenantPickerOpen(false)}
        onAdd={(added) => setTenants((prev) => [...prev, ...added.map((t) => ({ id: t.id, name: t.name }))])}
        documentName={detail.name}
        documentCasNumber={detail.casNumber}
        documentRevisionDate={detail.revisionDate}
        connectedTenants={MOCK_TENANTS.filter((t) => tenants.some((existing) => existing.id === t.id))}
        availableTenants={MOCK_TENANTS.filter((t) => !tenants.some((existing) => existing.id === t.id))}
      />
    </div>
  )
}

export default Sds
