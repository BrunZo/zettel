import React from "react";
import ZettelDisplay from "../ui/zettel";
import { zettelById } from "./retrieve";

export const Zettel = new Proxy({}, {
    get(_, zettelId: string) {
        return async (props: Partial<Parameters<typeof ZettelDisplay>[0]>) => {
            const zettel = await zettelById(zettelId);
            if (!zettel) {
                return React.createElement('div', null, `Zettel "${zettelId}" not found`);
            }   
            return React.createElement(ZettelDisplay, { ...zettel, ...props});
        };
    }
});