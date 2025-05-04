import React, { useState, useEffect } from "react";


function OrderModal({ isOpen, onClose, type, miniDetail }) {
    if (!isOpen) return null;

    // Define different content based on the modal type

    const modalContent = {
        store: {
            title: "Store Order",
            fields: [
                { label: "Quantity", type: "number", name: "quantity" },
                { label: "Due Date", type: "date", name: "dueDate" },
                { label: "Notes", type: "textarea", name: "notes" },
            ]
        },
        delivery: {
            title: "Delivery Order",
            fields: [
                { label: "Custormer Name", type: "text", name: "customerName" },
                { label: "Quantity", type: "number", name: "quantity" },
                { label: "Delivery Address", type: "textarea", name: "address" },
                { label: "Delivery Date", type: "date", name: "deliveryDate" },
            ]
        },
        supplier: {
            title: "Contact Supplier",
            fields: [
                { label: "Subject", type: "text", name: "subject" },
                { label: "Message", type: "textarea", name: "message" },
                { label: "Preferred Contact Methos", type: "Select", name: "contactMethod", options: ["Email", "Phone", "In-Person"] },
            ]
        },
    };

    const content = modalContent[type] || modalContent.store; // Default to store if type is not recognized

    return (
        <div className="fixed inset-0 bg-black opacity-90 flex items-center justify-center z-50">
            <div className="bg-[var(--color-dark-grey)] rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center border-b border-[var(--color-imperial-gold)] pb-4">
                    {/* Card Title */}
                    <h2 className="text-2xl text-[var(--color-off-white)]">{content.title}</h2>
                    <button onClick={onClose} className="text-[var(--color-off-white)] hover:text-[var(--color-neon-green)]">X</button>
                </div>
                {/* Card body */}
                <div className="mt-4">
                    <form action="" className="space-y-4">
                        {content.fields.map((field) => (
                            <div key={field.name} className="space-y-2">
                                <label htmlFor="" className="block text-[var(--color-off-white)]">
                                    {field.label}
                                </label>
                                {field.type === 'textarea' ? (
                                    <textarea
                                        name={field.name}
                                        className="w-full p-2 rounded bg-gray-700 text-[var(--color-off-white)]"
                                        rows="3"
                                    />
                                ) : field.type === 'select' ? (
                                    <select
                                        name={field.name}
                                        className="w-full p-2 rounded bg-gray-700 text-[var(--color-off-white)]"
                                    >
                                        {field.options.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        className="w-full p-2 rounded bg-gray-700 text-[var(--color-off-white)]"
                                    />
                                )}
                            </div>
                        ))}
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded bg-gray-600 text-[var(--color-off-white)] hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 rounded bg-[var(--color-imperial-gold)] text-[var(--color-dark-grey)] hover:bg-[var(--color-neon-green)]"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default OrderModal;