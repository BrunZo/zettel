# zettel
Next.js wrapper to handle the retrieving and rendering of atomic notes.

## How to use
A "zettel" is essentially a wrapper of a React component, but with enhanced rendering options. Each zettel has a unique id which identifies it. A zettel could be either rendered as a link, as a card, or in full. Zettels can be retrieved from glob patterns and filtered by their metadata. This allows quick and flexible setup of note-based websites (such as, my blog, servilleta, etc.).

This module provides
* A ```filterZettels``` method in ```lib/retrieve.tsx```, which returns all zettels matching specifications found under an specific glob pattern.
* A ```Zettel``` and ```ZettelGrid``` components, which take a zettel or a list of zettels, respectively.
* A ```ZettelSearch``` component, which provides a nice dashboard to search and/or filter zettels found under a glob pattern. 
