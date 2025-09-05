import { en } from "./en"
import { hi } from "./hi"
import { te } from "./te"
import { bn } from "./bn"
import { mr } from "./mr"
import { ta } from "./ta"
import { ur } from "./ur"

// Import additional language files as needed
// import { gu } from './gu';
// import { kn } from './kn';
// import { ml } from './ml';

export const translations = {
  en,
  hi,
  te,
  bn,
  mr,
  ta,
  ur,
  // Add more languages as they are implemented
  // gu,
  // kn,
  // ml,
}

export type TranslationsType = typeof en
