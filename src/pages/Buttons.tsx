import { useState } from 'react'
import { Button, TextButton, IconButton, SplitButton, DownloadButton, CheckboxButton } from '../components/Button'
import { Checkbox } from '../components/Checkbox'

const SectionHeader = ({ title, version, date }: { title: string; version: string; date: string }) => (
    <div className="flex items-baseline justify-between border-b border-gray-200 dark:border-gray-700 pb-1 mb-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
        <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">{version} · {date}</span>
    </div>
)

const Buttons = () => {
    const [checked, setChecked] = useState(false)

    return (
        <div className="space-y-8 p-6 max-w-2xl">

            <div>
                <SectionHeader title="Button — variants" version="v1" date="2026-05-08" />
                <div className="flex flex-wrap gap-3">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="danger">Danger</Button>
                    <Button variant="success">Success</Button>
                    <Button variant="warning">Warning</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="outline">Outline</Button>
                </div>
            </div>

            <div>
                <SectionHeader title="Button — sizes" version="v1" date="2026-05-08" />
                <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                </div>
            </div>

            <div>
                <SectionHeader title="Button — loading & disabled" version="v1" date="2026-05-08" />
                <div className="flex flex-wrap gap-3">
                    <Button loading>Loading</Button>
                    <Button disabled>Disabled</Button>
                    <Button variant="danger" loading>Loading Danger</Button>
                </div>
            </div>

            <div>
                <SectionHeader title="Button — with icons" version="v1" date="2026-05-08" />
                <div className="flex flex-wrap gap-3">
                    <Button leftIcon="←">Left Icon</Button>
                    <Button rightIcon="→">Right Icon</Button>
                    <Button leftIcon="★" rightIcon="→">Both Icons</Button>
                </div>
            </div>

            <div>
                <SectionHeader title="TextButton — variants" version="v1" date="2026-05-08" />
                <div className="flex flex-wrap gap-3">
                    <TextButton variant="default">Default</TextButton>
                    <TextButton variant="primary">Primary</TextButton>
                    <TextButton variant="danger">Danger</TextButton>
                    <TextButton disabled>Disabled</TextButton>
                </div>
            </div>

            <div>
                <SectionHeader title="IconButton — variants & sizes" version="v1" date="2026-05-08" />
                <div className="flex flex-wrap items-center gap-3">
                    <IconButton icon="⚙" variant="default" size="sm" />
                    <IconButton icon="⚙" variant="default" size="md" />
                    <IconButton icon="⚙" variant="default" size="lg" />
                    <IconButton icon="★" variant="primary" />
                    <IconButton icon="✕" variant="danger" />
                    <IconButton icon="☰" variant="ghost" />
                </div>
            </div>

            <div>
                <SectionHeader title="CheckboxButton" version="v1" date="2026-05-08" />
                <div className="flex flex-wrap gap-3">
                    <CheckboxButton label="Default unchecked" onChange={() => {}} />
                    <CheckboxButton label="Default checked" checked onChange={() => {}} />
                    <CheckboxButton label="Primary unchecked" variant="primary" onChange={() => {}} />
                    <CheckboxButton label="Primary checked" variant="primary" checked onChange={() => {}} />
                    <CheckboxButton label="Controlled" checked={checked} onChange={setChecked} />
                    <CheckboxButton label="Disabled" disabled onChange={() => {}} />
                </div>
            </div>

            <div>
                <SectionHeader title="SplitButton — variants" version="v1" date="2026-05-08" />
                <div className="flex flex-wrap gap-3">
                    <SplitButton
                        label="Save"
                        variant="primary"
                        options={[
                            { label: 'Save as Draft', icon: '📝', onClick: () => {} },
                            { label: 'Save & Publish', icon: '🚀', onClick: () => {} },
                            { label: 'Save & Close', icon: '✖️', onClick: () => {} },
                        ]}
                        onClick={() => {}}
                    />
                    <SplitButton
                        label="Export"
                        variant="secondary"
                        options={[
                            { label: 'Export as PDF', icon: '📕', onClick: () => {} },
                            { label: 'Export as CSV', icon: '📊', onClick: () => {} },
                        ]}
                        onClick={() => {}}
                    />
                    <SplitButton
                        label="Delete"
                        variant="danger"
                        options={[
                            { label: 'Delete All', onClick: () => {} },
                            { label: 'Delete Selected', onClick: () => {} },
                        ]}
                        onClick={() => {}}
                    />
                </div>
            </div>

            <div>
                <SectionHeader title="SplitButton — sizes" version="v1" date="2026-05-08" />
                <div className="flex flex-wrap items-center gap-3">
                    <SplitButton
                        label="Small"
                        size="sm"
                        options={[{ label: 'Option', onClick: () => {} }]}
                        onClick={() => {}}
                    />
                    <SplitButton
                        label="Medium"
                        size="md"
                        options={[{ label: 'Option', onClick: () => {} }]}
                        onClick={() => {}}
                    />
                    <SplitButton
                        label="Large"
                        size="lg"
                        options={[{ label: 'Option', onClick: () => {} }]}
                        onClick={() => {}}
                    />
                </div>
            </div>

            <div>
                <SectionHeader title="Checkbox — states" version="v1" date="2026-06-16" />
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <Checkbox state="unchecked" />
                        <span className="text-xs text-gray-400">Unchecked</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Checkbox state="checked" />
                        <span className="text-xs text-gray-400">Checked</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Checkbox state="error" />
                        <span className="text-xs text-gray-400">Error</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Checkbox state="progress" />
                        <span className="text-xs text-gray-400">Progress</span>
                    </div>
                </div>
            </div>

            <div>
                <SectionHeader title="DownloadButton" version="v1" date="2026-05-08" />
                <div className="flex flex-wrap gap-3">
                    <DownloadButton label="Download File" downloadingText="Downloading..." duration={2000} onClick={() => {}} />
                    <DownloadButton label="Export PDF" downloadingText="Exporting..." duration={3000} onClick={() => {}} />
                </div>
            </div>

        </div>
    )
}

export default Buttons
