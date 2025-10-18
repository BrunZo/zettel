'use client';

import { ZettelMeta } from "../lib/types";
import Zettel from "./zettel";

export default function ZettelGrid({ zettels }: { zettels: ZettelMeta[] }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {zettels.map((zettel) => (
        <Zettel key={zettel.id} {...zettel} mode="card" />
      ))}
    </div>
  );
}
