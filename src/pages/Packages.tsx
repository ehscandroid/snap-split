import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Modal } from '../components/Modal'
import PackagesTable from '../components/PackagesTable'
import { PackageIcon } from '../components/icons/PackageIcon'

interface PackageDetail {
  id: number
  name: string
  code: string
}

// TODO: replace with real package data
const MOCK: Record<number, PackageDetail> = {
  1: { id: 1, name: 'Starter Package',    code: 'PKG-001' },
  2: { id: 2, name: 'Pro Package',        code: 'PKG-002' },
  3: { id: 3, name: 'Enterprise Package', code: 'PKG-003' },
  4: { id: 4, name: 'Legacy Package',     code: 'PKG-004' },
}

const Packages = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [detail, setDetail] = useState<PackageDetail | null>(null)

  const id = searchParams.get('id')

  useEffect(() => {
    if (!id) { setDetail(null); return }
    // TODO: replace with real API call — await fetch(`/api/packages/${id}`)
    setDetail(MOCK[Number(id)] ?? null)
  }, [id])

  const openModal = (packageId: number) => {
    setSearchParams({ id: String(packageId) })
  }

  const closeModal = () => {
    setSearchParams({})
  }

  return (
    <>
      <PackagesTable onRowClick={openModal} onAdd={() => console.log('new package')} />

      <Modal
        open={!!detail}
        onClose={closeModal}
        title={detail?.name ?? ''}
        subtitle={detail?.code}
        iconNode={<PackageIcon className="w-10 h-10" />}
        maxWidth="max-w-lg"
      >
        {detail && (
          <div className="px-6 pb-6 text-sm text-gray-400">Content TBD</div>
        )}
      </Modal>
    </>
  )
}

export default Packages
