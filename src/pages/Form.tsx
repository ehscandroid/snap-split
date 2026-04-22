import { useState } from 'react';

import { Button, TextButton, IconButton, SplitButton, DownloadButton, CheckboxButton } from '../components/Button';
import {
    TextInput,
    FloatingInput,
    InlineInput,
    DatePicker,
    NumberPicker,
    DropdownSelect,
    ColorPicker,
    TimePicker,
    GrowingTextarea,
    ToggleSwitch,
    FileUpload,
    HintText,
    ImageSlider,
    SegmentedControl,
    Title,
    SectionTitle,
    CardTitle,
    Label,
    PanelHeader,
    NavHeader,
    DetailHeader,

} from '../components/FormElements';

import { DateTimeDisplay } from '../components/FormElements/DateTimePicker';

import { QualityTags } from '../components/QualityTags';

import { RadioList } from '../components/FormElements/RadioList';

type FormData = {
    chemicalName: string;
    email: string;
    casNumber: string;
    formula: string;
    website: string;
    expiryDate: string;
    quantity: number;
    category: string;
    hazardColor: string;
    expiryTime: string;
    notes: string;
    isHazardous: boolean;
    viewMode: string;
};

const categoryOptions = ['Solvents', 'Acids', 'Bases', 'Salts'];

const imageUrls = [
    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400',
    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400',
    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400',
];

const viewContent = {
    Day: 'Daily view content',
    Week: 'Weekly view content',
    Month: 'Monthly view content',
};

const Form = () => {
    const [formData, setFormData] = useState<FormData>({
        chemicalName: '',
        email: '',
        casNumber: '',
        formula: '',
        website: '',
        expiryDate: '',
        quantity: 0,
        category: '',
        hazardColor: '',
        expiryTime: '',
        notes: '',
        isHazardous: false,
        viewMode: 'Day',
    });

    const handleChange = (field: keyof FormData, value: string | number | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const [value, setValue] = useState("");

    return (
        <>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Form Radio</h3>
        <div className="space-y-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <RadioList
                options={[
                    { value: 'a', label: 'Option A' },
                    { value: 'b', label: 'Option B' },
                    { value: 'c', label: 'Option C' },
                ]}
                value={value}
                onChange={(val) => setValue(val)}
                label="Select an option"
            />
            </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Quality Tags</h3>
            <QualityTags value={3} max={5} size={30} className="mb-4" />

                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">DateTimeDisplay</h3>
            <div className="max-w-md space-y-6">
                <DateTimeDisplay
                    label="Start Date"
                    format='de'
                    value={"2026-04-17T14:30"}
                />
            </div>
            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">0. Title - Basic variants</h3>
                <div className="space-y-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <Title>Default Title</Title>
                    <Title variant="h2" size="lg">Large H2 Title</Title>
                    <Title variant="h4" size="sm">Small H4 Title</Title>
                    <Title variant="h1" align="center">Centered H1 Title</Title>
                    <Title variant="h3" align="right">Right Aligned H3</Title>
                </div>
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">0b. Title - With icon & badge</h3>
                <div className="space-y-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <Title icon="line-md:folder" badge="12">With Icon & Badge</Title>
                    <Title icon="line-md:document" badge="New" badgeColor="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        With Colored Badge
                    </Title>
                </div>
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">0c. Title - With subtitle</h3>
                <div className="space-y-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <Title icon="line-md:info" subtitle="Additional information here">
                        With Subtitle
                    </Title>
                    <Title variant="h2" icon="line-md:alert-circle" subtitle="Please review carefully">
                        Important Notice
                    </Title>
                </div>
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">0d. Title - With action</h3>
                <div className="space-y-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <Title action={<button className="text-sm text-blue-500 hover:text-blue-600">Edit</button>}>
                        Title with Action
                    </Title>
                    <Title icon="line-md:save" action={<Button size="sm">Save</Button>}>
                        With Button Action
                    </Title>
                </div>
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">0e. SectionTitle</h3>
                <div className="space-y-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <SectionTitle>Basic Section Title</SectionTitle>
                    <SectionTitle description="This describes the section below">With Description</SectionTitle>
                    <SectionTitle icon="line-md:folder" description="Manage your files here">
                        With Icon & Description
                    </SectionTitle>
                    <SectionTitle action={<Button size="sm">Add New</Button>} description="Click to add a new item">
                        With Action Button
                    </SectionTitle>
                    <SectionTitle icon="line-md:star" bordered={false}>No Border</SectionTitle>
                </div>
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">0f. CardTitle</h3>
                <div className="space-y-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <CardTitle>Card Title Only</CardTitle>
                    <CardTitle subtitle="Card subtitle text">With Subtitle</CardTitle>
                    <CardTitle image="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=100" subtitle="Image + subtitle">
                        With Image
                    </CardTitle>
                    <CardTitle subtitle="Manage settings" action={<button className="text-blue-500 text-sm">Settings</button>}>
                        With Action
                    </CardTitle>
                </div>
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">0g. Label</h3>
                <div className="space-y-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <Label>Basic Label</Label>
                    <Label required>Required Label</Label>
                    <Label optional>Optional Label</Label>
                    <Label hint="This is a helpful hint">With Hint</Label>
                    <Label error="This field is required">With Error</Label>
                    <Label required hint="Email address for notifications" error="Please enter a valid email">
                        Combined States
                    </Label>
                    <Label disabled>Disabled Label</Label>
                </div>
            </div>


            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">1. Label on top (outlined)</h3>
                <TextInput
                    label="Chemical Name"
                    value={formData.chemicalName}
                    onChange={(val) => handleChange('chemicalName', val)}
                    placeholder="Enter chemical name"
                    type="text"
                    maxLength={100}
                    autoComplete="off"
                    required
                />
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">1b. Label on top (underlined)</h3>
                <TextInput
                    label="Email Address"
                    value={formData.email}
                    onChange={(val) => handleChange('email', val)}
                    placeholder="Enter email"
                    type="email"
                    variant="underlined"
                    maxLength={50}
                    autoComplete="email"
                />
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">2. Floating label</h3>
                <FloatingInput
                    label="CAS Number"
                    value={formData.casNumber}
                    onChange={(val) => handleChange('casNumber', val)}
                    type="text"
                    maxLength={20}
                    required
                />
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">3. Title on left</h3>
                <InlineInput
                    label="Formula"
                    value={formData.formula}
                    onChange={(val) => handleChange('formula', val)}
                    placeholder="Enter formula"
                    type="text"
                    autoComplete="off"
                />
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">3b. Title on left (underlined)</h3>
                <InlineInput
                    label="Website"
                    value={formData.website}
                    onChange={(val) => handleChange('website', val)}
                    placeholder="https://"
                    type="url"
                    variant="underlined"
                />
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">4. Date Picker</h3>
                <DatePicker
                    label="Expiry Date"
                    value={formData.expiryDate}
                    onChange={(val) => handleChange('expiryDate', val)}
                    modalTitle="Select Expiry Date"
                    required
                    placeholder="Select date"
                />
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">5. Number Picker</h3>
                <NumberPicker
                    label="Quantity"
                    value={formData.quantity}
                    onChange={(val) => handleChange('quantity', val)}
                    modalTitle="Enter Quantity"
                    min={0}
                    max={1000}
                    step={10}
                    required
                />
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">6. Dropdown Select</h3>
                <DropdownSelect
                    label="Category"
                    value={formData.category}
                    onChange={(val) => handleChange('category', val)}
                    options={categoryOptions}
                    modalTitle="Select Category"
                    required
                />
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">7. Color Picker</h3>
                <ColorPicker
                    label="Color"
                    value={formData.hazardColor}
                    onChange={(val) => handleChange('hazardColor', val)}
                    modalTitle="Select Hazard Color"
                />
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">8. Time Picker</h3>
                <TimePicker
                    label="Time"
                    value={formData.expiryTime}
                    onChange={(val) => handleChange('expiryTime', val)}
                    modalTitle="Select Time"
                    required
                />
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">9. Growing Textarea</h3>
                <GrowingTextarea value={formData.notes} onChange={(val) => handleChange('notes', val)} placeholder="Enter notes..." />
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">10. Toggle Switch</h3>
                <ToggleSwitch label="Hazardous Material" value={formData.isHazardous} onChange={(val) => handleChange('isHazardous', val)} />
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">11. File Upload</h3>
                <FileUpload
                    title="Safety_Data_Sheet_v2.pdf"
                    subtitle="PDF Document"
                    size="2.4 MB"
                    date="Jan 15, 2025"
                    icon="📄"
                />
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">12a. Hint Text (icon)</h3>
                <HintText message="This chemical requires special handling. Always wear protective equipment when handling." />
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">12b. Hint Text (line)</h3>
                <HintText message="This chemical requires special handling. Always wear protective equipment when handling." variant="line" />
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">13. Image Slider</h3>
                <ImageSlider images={imageUrls} />
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">14. Segmented Control</h3>
                <SegmentedControl
                    options={[
                        { value: 'Day', label: 'Day' },
                        { value: 'Week', label: 'Week' },
                        { value: 'Month', label: 'Month' },
                    ]}
                    value={formData.viewMode}
                    onChange={(val) => handleChange('viewMode', val)}
                    content={viewContent}
                />
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">15. PanelHeader</h3>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <PanelHeader
                        icon="line-md:folder"
                        title="Project Files"
                        subtitle="12 items, 3.4 MB total"
                        badge="12"
                        action={{ icon: 'line-md:plus', label: 'Add', onClick: () => { } }}
                    />
                </div>
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">15b. PanelHeader - Tag variant</h3>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <PanelHeader
                        icon="line-md:document"
                        title="Document"
                        subtitle="Last edited 2 hours ago"
                        action={{ icon: 'line-md:download', label: 'Download', variant: 'tag' }}
                    />
                </div>
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">15c. PanelHeader - Custom colors</h3>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <PanelHeader
                        icon="line-md:alert"
                        title="Warning"
                        subtitle="This action cannot be undone"
                        badge="!"
                        badgeColor="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        action={{ icon: 'line-md:close', label: 'Dismiss', color: 'bg-red-500 text-white hover:bg-red-600' }}
                    />
                </div>
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">16. NavHeader</h3>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <NavHeader
                        title="John Doe"
                        subtitle="Software Engineer"
                        avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
                        actions={[
                            { icon: 'line-md:mail', onClick: () => { } },
                            { icon: 'line-md:cog', onClick: () => { } },
                        ]}
                    />
                </div>
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">16b. NavHeader - With icon</h3>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <NavHeader
                        title="Settings"
                        subtitle="Manage your account"
                        icon="line-md:cog"
                        actions={[
                            { icon: 'line-md:search', label: 'Search', onClick: () => { } },
                            { icon: 'line-md:close', label: 'Close', onClick: () => { } },
                        ]}
                    />
                </div>
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">17. DetailHeader</h3>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <DetailHeader
                        icon="line-md:document"
                        title="Safety Data Sheet"
                        subtitle="SDS-2024-001 • Version 3.2"
                        tag="Active"
                        status="success"
                        buttonRow={<Button size="sm">Edit</Button>}
                    />
                </div>
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">17b. DetailHeader - Button Row</h3>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <DetailHeader
                        icon="line-md:folder"
                        title="Project Folder"
                        subtitle="Contains 24 items"
                        buttonRow={
                            <>
                                <Button size="sm" variant="secondary">Share</Button>
                                <Button size="sm">Open</Button>
                            </>
                        }
                    />
                </div>
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">17b. DetailHeader - Status variants</h3>
                <div className="space-y-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <DetailHeader
                        icon="line-md:alert-circle"
                        title="Pending Review"
                        status="warning"
                    />
                    <DetailHeader
                        icon="line-md:close-circle"
                        title="Action Required"
                        status="error"
                    />
                    <DetailHeader
                        icon="line-md:info-circle"
                        title="Information"
                        status="info"
                    />
                </div>
            </div>

        </>
    )


}

export default Form;