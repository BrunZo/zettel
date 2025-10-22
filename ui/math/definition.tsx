import React from "react";

export default function Definition({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="definition">
            <div>
                <span className="font-semibold">Definition.</span>
                <span className="ml-2 text-gray-800">{title ? `(${title})` : ""}</span>
            </div>
            <div>
                {children}
            </div>
        </div>
    )
}