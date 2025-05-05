import React, { useState, useEffect } from "react";


function OrderModal({ isOpen, onClose, type, miniDetail, onOrderSubmit }) {
    const [formData, setFormData] = useState({});
    const [totalCost, setTotalCost] = useState(0);

    // Define different content based on the modal type

    const modalContent = {
        store: {
            title: "Store Order",
            fields: [
                { label: "Quantity", type: "number", name: "quantity" },
                { label: "Order Date", type: "date", name: "dueDate" },
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
                { label: "Preferred Contact Methos", type: "select", name: "contactMethod", options: ["Email", "Phone", "In-Person"] },
            ]
        },
    };

    const content = modalContent[type] || modalContent.store; // Default to store if type is not recognized

    // Reset form data when modal opens or type changes:
    useEffect(() => {
        setFormData({});
        setTotalCost(0);
    }, [isOpen, type]);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };
        setFormData(newFormData);

        // Calculate total cost if quantity and price are available
        if ((type === 'store' || type === 'delivery') && name === 'quantity' && miniDetail?.current_price) {
            const quantity = parseInt(value, 10) || 0;
            const price = parseFloat(miniDetail.current_price) || 0;
            setTotalCost((quantity * price).toFixed(2));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        onOrderSubmit(type, formData); // Pass type and data back to parent
        onClose(); // Close the modal
    };

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
                                        value={formData[field.name] || ''}
                                        onChange={handleInputChange}
                                        rows="3"
                                    />
                                ) : field.type === 'select' ? (
                                    <select
                                        name={field.name}
                                        className="w-full p-2 rounded bg-gray-700 text-[var(--color-off-white)]"
                                        value={formData[field.name] || ''}
                                        onChange={handleInputChange}
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
                                        value={formData[field.name] || ''}
                                        onChange={handleInputChange}
                                        min={field.type === 'number' ? 1 : undefined}
                                    />
                                )}
                            </div>
                        ))}
                        {/* Display Total Cost for relevant types */}
                        {(type === 'store' || type === 'delivery') && miniDetail?.current_price && (
                            <div className="mt-4 text-[var(--color-off-white)]">
                                <strong>Total Cost: ${totalCost}</strong> (Based on current price: ${miniDetail.current_price})
                            </div>
                        )}
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