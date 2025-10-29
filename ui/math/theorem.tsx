import React from "react";

export default function Theorem({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="theorem">
            <div>
                <span className="font-semibold">Theorem.</span>
                <span className="ml-2 text-gray-800">{title ? `(${title})` : ""}</span>
            </div>
            <div>
                {children}
            </div>
        </div>
    )
}
