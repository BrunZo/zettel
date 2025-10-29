# zettel
Next.js wrapper to handle the retrieving and rendering of atomic notes.

## How to use
A "zettel" is essentially a wrapper of a React component, but with enhanced rendering options. Each zettel has a unique id which identifies it. A zettel could be either rendered as a link, as a card, or in full. Zettels can be retrieved from glob patterns and filtered by their metadata. This allows quick and flexible setup of note-based websites (such as, my blog, servilleta, etc.).

This module provides the following util methods:
* A ```filterZettels``` method in ```lib/retrieve.tsx```, which returns all zettels matching specifications found under an specific glob pattern.
* A ```zettelById``` method in ```lib/retrieve.tsx```, which returns the first zettel matching the specified ```id```. The ```id```s can be exported on each zettel and are taken as the filename by default.

There's also a proxy which allows to call zettels by a template XML tag instead of retrieving. The syntax is
```
import { Zettel } from `zettel/lib/proxy`

<Zettel.id_of_zettel mode="full" />
```

The module also provides the following components
In ```z```
* A ```Zettel``` component, which is just a wrapper of an arbitrary React component.

In ```collections``` (TODO)
* A ```ZettelList``` component, a vertical concatenation of a list of zettels with enhanced styles (smaller titles, no abstracts)
* A ```ZettelGrid``` components, a grid with zettels displayed in a compact manner.

In ```pages```
* A ```ZettelSearch``` component, a nice dashboard to search and/or filter zettels found under a glob pattern. It uses a ZettelGrid to show results.

In ```math```
* A ```Definition``` and ```Theorem``` components, a nice remark style for showing definitions or theorems.

## Dev notes

All zettels must be found in ```notes/``` on the root directory. Of course this could be changed to a more appropriate name such as ```public/``` if necessary.

As far as I know, there's no way of leaving the path template completely blank. I understand that this is because if the template is blank, then Webpack cannot decide which files should it bundle in compilation time, as an empty template could point to every file in the file system. You might find a "couldn't import module" error if that's the case. Fortunately, Next.js allows to precompile pages showing some specific zettels for performance, which can be easily done by retrieving all zettel ids and adding to ```generateStaticParams()```.

You can check a further example of configuration of a project using zettel in Next.js 16 in [my blog](https://github.com/BrunZo/blog).


