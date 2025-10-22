import React from "react";
import Zettel from "../ui/zettel";
import { zettelById } from "./retrieve";

export const Zettels = new Proxy({}, {
    get(_, zettelId: string) {
        return async (props: Partial<Parameters<typeof Zettel>[0]>) => {
            const zettel = await zettelById(zettelId);
            if (!zettel) {
                return React.createElement('div', null, `Zettel "${zettelId}" not found`);
            }   
            return React.createElement(Zettel, { ...zettel, ...props});
        };
    }
});
