export interface SdsItem {
  id: number
  name: string
  casNumber: string
  hazardClass: string
  status: number
  manufacturer: string
  signalWord: string
  storageClass: string
  quantity: number
  location: string
  revisionDate: string
  packages: string[]
}

export interface SdsPackage {
  id: number
  name: string
  description: string
}
