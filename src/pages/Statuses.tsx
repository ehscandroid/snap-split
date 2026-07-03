import { useState } from 'react'
import {
  Status,
  StatusProgress,
  DueDateChip,
  SdsDateTag,
  DateTag,
  UploadChip,
  TenantChip,
  TenantChipCompact,
  StatusChipSquare,
  StatusChipMuted,
  StatusChipOutline,
} from '../components/Status'

const daysFromNow = (days: number): Date => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}

const yearsFromNow = (years: number): Date => {
  const date = new Date()
  date.setFullYear(date.getFullYear() + years)
  return date
}

const SectionHeader = ({ title, version, date }: { title: string; version: string; date: string }) => (
  <div className="flex items-baseline justify-between border-b border-gray-200 dark:border-gray-700 pb-1 mb-3">
    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
    <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">{version} · {date}</span>
  </div>
)

const STATUS_CODES = [0, 1, 2, 3, 4, 5, 90, 91, 92, 98, 99]

const Statuses = () => {
  const [selectedTenants, setSelectedTenants] = useState<Set<number>>(new Set([1]))

  const toggleTenant = (id: number) => {
    setSelectedTenants((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-8 p-6 max-w-2xl">
      <div>
        <SectionHeader title="Status — chip (radius 8)" version="v1" date="2026-07-02" />
        <div className="flex flex-wrap gap-3">
          {STATUS_CODES.map((code) => (
            <StatusChipSquare key={code} code={code} />
          ))}
        </div>
      </div>

      <div>
        <SectionHeader title="Status — muted palette" version="v1" date="2026-07-02" />
        <div className="flex flex-wrap gap-3">
          {STATUS_CODES.map((code) => (
            <StatusChipMuted key={code} code={code} />
          ))}
        </div>
      </div>

      <div>
        <SectionHeader title="Status — outline palette" version="v1" date="2026-07-02" />
        <div className="flex flex-wrap gap-3">
          {STATUS_CODES.map((code) => (
            <StatusChipOutline key={code} code={code} />
          ))}
        </div>
      </div>

      <div>
        <SectionHeader title="Status — circle" version="v1" date="2026-06-30" />
        <div className="flex flex-wrap gap-3">
          {STATUS_CODES.map((code) => (
            <Status key={code} code={code} form="circle" />
          ))}
        </div>
      </div>

      <div>
        <SectionHeader title="Status — dot" version="v1" date="2026-06-30" />
        <div className="flex flex-wrap gap-3">
          {STATUS_CODES.map((code) => (
            <Status key={code} code={code} form="dot" />
          ))}
        </div>
      </div>

      <div>
        <SectionHeader title="Status — chip with percent fill" version="v1" date="2026-07-02" />
        <div className="flex flex-wrap gap-3">
          <StatusChipSquare code={2} percent={0.45} />
          <StatusChipSquare code={3} percent={0.3} />
          <StatusChipSquare code={5} percent={0.6} />
          <StatusChipSquare code={91} percent={0.9} />
        </div>
      </div>

      <div>
        <SectionHeader title="Status — circle with percent fill" version="v1" date="2026-06-30" />
        <div className="flex flex-wrap gap-3">
          <Status code={2} form="circle" percent={0.45} />
          <Status code={3} form="circle" percent={0.3} />
          <Status code={5} form="circle" percent={0.6} />
          <Status code={91} form="circle" percent={0.9} />
        </div>
      </div>

      <div>
        <SectionHeader title="Status — chip with title override" version="v1" date="2026-06-30" />
        <div className="flex flex-wrap gap-3">
          <Status code={98} form="chip" title="missing weight" />
          <Status code={98} form="chip" title="duplicate entry" />
          <Status code={98} form="chip" title="needs review" />
        </div>
      </div>

      <div>
        <SectionHeader title="Status — progress" version="v1" date="2026-06-30" />
        <div className="space-y-4">
          <StatusProgress data={{ 1: 0.05, 5: 0.95 }} />
          <StatusProgress data={{ 0: 0.2, 3: 0.5, 91: 0.3 }} />
          <StatusProgress data={{ 2: 0.15, 5: 0.25, 90: 0.4, 92: 0.2 }} />
          <StatusProgress data={{ 98: 0.1, 99: 0.1, 4: 0.3, 91: 0.5 }} />
          <StatusProgress data={{ 91: 1 }} />
        </div>
      </div>

      <div>
        <SectionHeader title="Status — due date chip" version="v1" date="2026-06-30" />
        <div className="flex flex-wrap gap-3">
          <DueDateChip date={daysFromNow(14)} />
          <DueDateChip date={daysFromNow(1)} />
          <DueDateChip date={daysFromNow(0)} />
          <DueDateChip date={daysFromNow(-3)} />
          <DueDateChip date={daysFromNow(-7)} />
          <DueDateChip date={daysFromNow(-21)} />
        </div>
      </div>

      <div>
        <SectionHeader title="Status — SDS date tag" version="v1" date="2026-06-30" />
        <div className="flex flex-wrap gap-3">
          <SdsDateTag date={yearsFromNow(0)} />
          <SdsDateTag date={yearsFromNow(-1)} />
          <SdsDateTag date={yearsFromNow(-2)} />
          <SdsDateTag date={daysFromNow(-731)} />
          <SdsDateTag date={yearsFromNow(-5)} />
        </div>
      </div>

      <div>
        <SectionHeader title="Status — basic date tag" version="v1" date="2026-07-03" />
        <div className="flex flex-wrap gap-3">
          <DateTag date={daysFromNow(0)} />
          <DateTag date={daysFromNow(-14)} />
          <DateTag date={yearsFromNow(-1)} />
          <DateTag date={daysFromNow(0)} tone="progress" />
          <DateTag date={daysFromNow(-5)} tone="progress" />
          <DateTag date={daysFromNow(3)} tone="progress" />
        </div>
      </div>

      <div>
        <SectionHeader title="Status — upload chip" version="v1" date="2026-07-03" />
        <div className="flex flex-wrap gap-3">
          <UploadChip uploadedAt={daysFromNow(-30)} latestAvailableAt={daysFromNow(-2)} />
          <UploadChip latestAvailableAt={daysFromNow(-1)} />
          <UploadChip uploadedAt={daysFromNow(-5)} latestAvailableAt={daysFromNow(-10)} />
          <UploadChip uploadedAt={daysFromNow(-5)} latestAvailableAt={daysFromNow(-10)} failed />
          <UploadChip uploadedAt={daysFromNow(-5)} latestAvailableAt={daysFromNow(-10)} failed reason="File too large" />
          <UploadChip uploadedAt={daysFromNow(-5)} latestAvailableAt={daysFromNow(-10)} failed reason="Invalid format" />
          <UploadChip uploadedAt={daysFromNow(-5)} latestAvailableAt={daysFromNow(-10)} failed reason="Connection timeout" />
        </div>
      </div>

      <div>
        <SectionHeader title="Status — tenant chip" version="v1" date="2026-07-03" />
        <div className="flex flex-wrap gap-3">
          <TenantChip tenantId={1} tenantName="Acme Corp" uploadedAt={daysFromNow(-30)} latestAvailableAt={daysFromNow(-2)} selected={selectedTenants.has(1)} onSelect={() => toggleTenant(1)} />
          <TenantChip tenantId={2} tenantName="Globex Inc" latestAvailableAt={daysFromNow(-1)} selected={selectedTenants.has(2)} onSelect={() => toggleTenant(2)} />
          <TenantChip tenantId={3} tenantName="Initech" uploadedAt={daysFromNow(-5)} latestAvailableAt={daysFromNow(-10)} selected={selectedTenants.has(3)} onSelect={() => toggleTenant(3)} />
          <TenantChip tenantId={4} tenantName="Umbrella Ltd" uploadedAt={daysFromNow(-5)} latestAvailableAt={daysFromNow(-10)} failed reason="File too large" selected={selectedTenants.has(4)} onSelect={() => toggleTenant(4)} />
          <TenantChip tenantId={5} tenantName="Hooli" uploadedAt={daysFromNow(-5)} latestAvailableAt={daysFromNow(-10)} failed reason="Connection timeout" selected={selectedTenants.has(5)} onSelect={() => toggleTenant(5)} />
        </div>
      </div>

      <div>
        <SectionHeader title="Status — tenant chip (compact)" version="v1" date="2026-07-03" />
        <div className="flex flex-wrap gap-3">
          <TenantChipCompact tenantId={1} tenantName="Acme Corp" uploadedAt={daysFromNow(-30)} latestAvailableAt={daysFromNow(-2)} />
          <TenantChipCompact tenantId={2} tenantName="Globex Inc" latestAvailableAt={daysFromNow(-1)} />
          <TenantChipCompact tenantId={3} tenantName="Initech" uploadedAt={daysFromNow(-5)} latestAvailableAt={daysFromNow(-10)} />
          <TenantChipCompact tenantId={4} tenantName="Umbrella Ltd" uploadedAt={daysFromNow(-5)} latestAvailableAt={daysFromNow(-10)} failed />
        </div>
      </div>
    </div>
  )
}

export default Statuses
