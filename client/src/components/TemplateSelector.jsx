import { Layout, Check } from 'lucide-react'
import React, { useState } from 'react'


const TemplateSelector = ({ selectedTemplate, onChange }) => {
    const [isOpen, setIsOpen] = useState(false)

    const templates = [
        {
            id: "classic",
            name: "Classic",
            preview: "A clean, traditional resume format with clear sections and professional typography"
        },
        {
            id: "modern",
            name: "Modern",
            preview: "Sleek design with contemporary fonts, bold headings, and a layout that emphasizes key information"
        },
        {
            id: "minimal-image",
            name: "Minimal Image",
            preview: "A clean, minimalist design with a focus on text and a subtle image element"
        },
        {
            id: "minimal",
            name: "Minimal",
            preview: "A simple, elegant design with ample white space and a focus on content over decoration"
        }
    ]

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-2 border rounded-lg text-left flex items-center gap-2"
            >
                <Layout size={16} />
                <span className='max-sm:hidden' >Template</span>
            </button>

            {isOpen && (
                <div className='absolute top-full left-0 mt-2 w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-lg p-3 space-y-3 z-20'>

                    {templates.map((template) => (
                        <div
                            key={template.id}
                            onClick={() => {
                                onChange(template.id)
                                setIsOpen(false)
                            }}
                            className={`relative p-4 rounded-lg border cursor-pointer transition-all ${selectedTemplate === template.id
                                    ? "bg-blue-100 border-blue-400"
                                    : "bg-white border-gray-200 hover:border-gray-300"
                                }`}
                        >
                            {/* Title */}
                            <p className="font-medium text-gray-900">{template.name}</p>

                            {/* Description */}
                            <p className="text-sm text-gray-500 mt-1">
                                {template.preview}
                            </p>

                            {/* Check icon */}
                            {selectedTemplate === template.id && (
                                <div className="absolute right-3 top-3">
                                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                </div>
            )}

            <div className='space-y-1 mt-2'>
                <h4 className='font-medium text-gray-800'>
                    {templates.find(t => t.id === selectedTemplate)?.name}
                </h4>
                <div className='mt-2 p-2 bg-blue-100 rounded text-xs '>
                    {templates.find(t => t.id === selectedTemplate)?.preview}
                </div>
            </div>

        </div>
    )
}

export default TemplateSelector