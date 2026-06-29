import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DetailHeader } from '../components/FormElements'

interface SdsDetail {
  id: number
  name: string
  casNumber: string
  hazardClass: string
  molecularFormula: string
  flashPoint: string
  boilingPoint: string
  density: string
  vaporPressure: string
  solubility: string
  autoIgnitionTemp: string
  phRange: string
  storageTemp: string
  status: string
}

const MOCK: Record<number, SdsDetail> = {
  1: { id: 1, name: 'Ethanol', casNumber: '64-17-5', hazardClass: 'Flammable Liquids', molecularFormula: 'C₂H₅OH', flashPoint: '13 °C', boilingPoint: '78.4 °C', density: '0.789 g/cm³', vaporPressure: '5.95 kPa (20 °C)', solubility: 'Miscible with water', autoIgnitionTemp: '365 °C', phRange: '7.33', storageTemp: '< 25 °C', status: 'Active' },
  2: { id: 2, name: 'Acetone', casNumber: '67-64-1', hazardClass: 'Flammable Liquids', molecularFormula: 'C₃H₆O', flashPoint: '−20 °C', boilingPoint: '56.05 °C', density: '0.791 g/cm³', vaporPressure: '24.0 kPa (20 °C)', solubility: 'Miscible with water', autoIgnitionTemp: '465 °C', phRange: '7.0', storageTemp: '< 20 °C', status: 'Draft' },
  3: { id: 3, name: 'Hydrochloric Acid', casNumber: '7647-01-0', hazardClass: 'Corrosive', molecularFormula: 'HCl', flashPoint: 'N/A', boilingPoint: '−85.05 °C', density: '1.18 g/cm³ (37%)', vaporPressure: '84 hPa (20 °C)', solubility: 'Fully miscible', autoIgnitionTemp: 'N/A', phRange: '< 1', storageTemp: '15–25 °C', status: 'Active' },
  4: { id: 4, name: 'Sodium Hydroxide', casNumber: '1310-73-2', hazardClass: 'Corrosive', molecularFormula: 'NaOH', flashPoint: 'N/A', boilingPoint: '1388 °C', density: '2.13 g/cm³', vaporPressure: '< 0.1 hPa', solubility: '111 g/100 mL', autoIgnitionTemp: 'N/A', phRange: '13–14', storageTemp: 'Dry, < 30 °C', status: 'Archived' },
  5: { id: 5, name: 'Methanol', casNumber: '67-56-1', hazardClass: 'Toxic / Flammable', molecularFormula: 'CH₃OH', flashPoint: '11 °C', boilingPoint: '64.7 °C', density: '0.792 g/cm³', vaporPressure: '13.0 kPa (20 °C)', solubility: 'Miscible with water', autoIgnitionTemp: '385 °C', phRange: '7.4', storageTemp: '< 25 °C', status: 'Review' },
  6: { id: 6, name: 'Toluene', casNumber: '108-88-3', hazardClass: 'Flammable Liquids', molecularFormula: 'C₇H₈', flashPoint: '4 °C', boilingPoint: '110.6 °C', density: '0.867 g/cm³', vaporPressure: '3.79 kPa (20 °C)', solubility: '0.52 g/L in water', autoIgnitionTemp: '480 °C', phRange: 'N/A', storageTemp: '< 25 °C', status: 'Active' },
  7: { id: 7, name: 'Benzene', casNumber: '71-43-2', hazardClass: 'Carcinogen', molecularFormula: 'C₆H₆', flashPoint: '−11 °C', boilingPoint: '80.1 °C', density: '0.879 g/cm³', vaporPressure: '10 kPa (20 °C)', solubility: '1.8 g/L in water', autoIgnitionTemp: '498 °C', phRange: 'N/A', storageTemp: '< 20 °C', status: 'Draft' },
  8: { id: 8, name: 'Sulfuric Acid', casNumber: '7664-93-9', hazardClass: 'Corrosive', molecularFormula: 'H₂SO₄', flashPoint: 'N/A', boilingPoint: '337 °C', density: '1.84 g/cm³', vaporPressure: '< 0.3 hPa', solubility: 'Miscible with water', autoIgnitionTemp: 'N/A', phRange: '< 1', storageTemp: '15–25 °C', status: 'Active' },
}

const fields = [
  { label: 'CAS Number',          key: 'casNumber'        },
  { label: 'Hazard Class',        key: 'hazardClass'      },
  { label: 'Molecular Formula',   key: 'molecularFormula' },
  { label: 'Flash Point',         key: 'flashPoint'       },
  { label: 'Boiling Point',       key: 'boilingPoint'     },
  { label: 'Density',             key: 'density'          },
  { label: 'Vapor Pressure',      key: 'vaporPressure'    },
  { label: 'Solubility',          key: 'solubility'       },
  { label: 'Auto-Ignition Temp',  key: 'autoIgnitionTemp' },
  { label: 'pH Range',            key: 'phRange'          },
  { label: 'Storage Temperature', key: 'storageTemp'      },
] as const

const Sds = () => {
  const [searchParams] = useSearchParams()
  const [detail, setDetail] = useState<SdsDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [scrolled, setScrolled] = useState(false)
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
        setDetail(MOCK[Number(id)] ?? null)
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
        <DetailHeader
          icon="mdi:file-document-outline"
          title={detail.name}
          subtitle={`CAS ${detail.casNumber} · SDS #${detail.id}`}
          tag={detail.status}
          status="success"
        />
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-auto p-6 space-y-6">

        <div className="grid grid-cols-2 gap-3">
          {fields.map(({ label, key }) => (
            <div key={key} className="bg-gray-50 dark:bg-white/5 rounded-lg px-4 py-3">
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{label}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{detail[key]}</p>
            </div>
          ))}
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
    </div>
  )
}

export default Sds
