import { ZettelMeta } from "../../lib/types";
import ZettelDisplay from "./zettel";

export default function ZettelGrid({ zettels }: { zettels: ZettelMeta[] }) {
  return (
    <div className='flex flex-col'>
      {zettels.map((zettel) => (
        <ZettelDisplay key={zettel.id} {...zettel} mode="card" />
      ))}
    </div>
  );
}
