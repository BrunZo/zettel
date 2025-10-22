import React from "react";
import ZettelDisplay from "./zettel";
import { ZettelMeta } from "../lib/types";

export default async function ZettelList({ zettels }: { zettels: ZettelMeta[] }) {
    return (
        <div>
            {zettels.map((zettel) => <ZettelDisplay key={zettel.id} {...zettel} mode="semi-full" />)}
        </div>
    );
}