import { Chip } from '../components/Chip/Chip'
import { PackageIcon } from '../components/icons/PackageIcon'

const SectionHeader = ({ title, version, date }: { title: string; version: string; date: string }) => (
  <div className="flex items-baseline justify-between border-b border-gray-200 dark:border-gray-700 pb-1 mb-3">
    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
    <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">{version} · {date}</span>
  </div>
)

const GroupLabel = ({ dotColor, children }: { dotColor: string; children: React.ReactNode }) => (
  <div className="flex items-center gap-2 mb-2 text-xs text-gray-500 dark:text-gray-400">
    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: dotColor }} />
    {children}
  </div>
)

const Chips = () => {
  return (
    <div className="space-y-8 p-6 max-w-2xl">
      <div>
        <SectionHeader title="Chip family" version="v1" date="2026-07-02" />

        <div className="space-y-6">
          <div>
            <GroupLabel dotColor="#2dd4bf">Package · a grouping of SDS documents</GroupLabel>
            <div className="flex flex-wrap gap-2">
              <Chip iconNode={<PackageIcon className="w-3.5 h-3.5" />} label="Q3 Reagents" count={12} onRemove={() => {}} />
              <Chip iconNode={<PackageIcon className="w-3.5 h-3.5" />} label="Lab A intake" count={47} onRemove={() => {}} />
              <Chip iconNode={<PackageIcon className="w-3.5 h-3.5" />} label="Recalled lot 88B" count={3} onRemove={() => {}} />
              <Chip iconNode={<PackageIcon className="w-3.5 h-3.5" />} label="Uncounted intake" onRemove={() => {}} />
            </div>
          </div>

          <div>
            <GroupLabel dotColor="#94a3b8">Filter · attribute:value</GroupLabel>
            <div className="flex flex-wrap gap-2">
              <Chip icon="mdi:alert-outline" label="Hazard class" value="Flammable" onRemove={() => {}} />
              <Chip icon="mdi:target" label="Status" value="Expired" onRemove={() => {}} />
              <Chip icon="mdi:factory" label="Manufacturer" value="Sigma-Aldrich" onRemove={() => {}} />
              <Chip icon="mdi:information-outline" label="Signal word" value="Danger" onRemove={() => {}} />
            </div>
          </div>

          <div className="flex flex-wrap gap-8">
            <div>
              <GroupLabel dotColor="#818cf8">Tenant</GroupLabel>
              <div className="flex flex-wrap gap-2">
                <Chip icon="mdi:domain" label="Tenant" value="Northwind Labs" onRemove={() => {}} />
              </div>
            </div>

            <div>
              <GroupLabel dotColor="#fb923c">Customer</GroupLabel>
              <div className="flex flex-wrap gap-2">
                <Chip icon="mdi:account-outline" label="Customer" value="BASF SE" onRemove={() => {}} />
              </div>
            </div>
          </div>

          <div>
            <GroupLabel dotColor="#e879f9">Read-only · no dismiss</GroupLabel>
            <div className="flex flex-wrap gap-2">
              <Chip icon="mdi:alert-outline" label="Hazard class" value="Flammable" />
              <Chip icon="mdi:domain" label="Tenant" value="Northwind Labs" />
              <Chip iconNode={<PackageIcon className="w-3.5 h-3.5" />} label="Q3 Reagents" count={12} />
              <Chip iconNode={<PackageIcon className="w-3.5 h-3.5" />} label="Uncounted intake" />
            </div>
          </div>

          <div>
            <GroupLabel dotColor="#38bdf8">List view · large, for picker modals</GroupLabel>
            <div className="flex flex-col gap-2 max-w-sm">
              <Chip
                size="lg"
                iconNode={<PackageIcon className="w-6 h-6" />}
                label="Q3 Reagents"
                description="Reagents restocked for Q1 lab operations"
                count={12}
              />
              <Chip
                size="lg"
                iconNode={<PackageIcon className="w-6 h-6" />}
                label="Lab A intake"
                description="General inventory refresh across storage units"
                active
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chips
