import { Palette, Check } from 'lucide-react';
import React from 'react'

const ColorPicker = ({ value, onChange }) => {
    const colors = [
        { name: "Blue", value: "#007bff" },
        { name: "Crimson", value: "#dc3545" },
        { name: "Orange", value: "#fd7e14" },
        { name: "Green", value: "#28a745" },
        { name: "Indigo", value: "#6610f2" },
        { name: "Teal", value: "#20c997" },
        { name: "Gray", value: "#6c757d" },
        { name: "Dark", value: "#343a40" },
        { name: "Maroon", value: "#800000" },
        { name: "Navy", value: "#000080" },
    ]

    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className='relative'>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='w-8 h-8 rounded-full border flex items-center justify-center'
            >
                <Palette size={16} />
            </button>

            {isOpen && (
                <div className='absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-20'>

                    <div className='grid grid-cols-4 gap-4'>
                        {colors.map((color) => (
                            <div
                                key={color.name}
                                onClick={() => onChange(color.value)}
                                className='flex flex-col items-center text-center cursor-pointer'
                            >

                                {/* COLOR */}
                                <div
                                    className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center'
                                    style={{ backgroundColor: color.value }}
                                >
                                    {value === color.value && (
                                        <Check className="size-4 text-white" />
                                    )}
                                </div>

                                {/* LABEL */}
                                <p className='text-[11px] text-gray-600 mt-1 leading-tight break-words'>
                                    {color.name}
                                </p>

                            </div>
                        ))}
                    </div>

                </div>
            )}
        </div>
    )
}

export default ColorPicker