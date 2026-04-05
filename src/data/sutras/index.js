import heartSutra from './heart-sutra.json';
import diamondVerse from './diamond-verse.json';
import platformVerse from './platform-verse.json';
import avalokitesvara from './avalokitesvara.json';
import greatCompassion from './great-compassion.json';
import threeChar from './three-char.json';
import taoCh1 from './tao-ch1.json';
import diamondOpening from './diamond-opening.json';

export const SUTRAS = [
  heartSutra,
  diamondVerse,
  platformVerse,
  avalokitesvara,
  greatCompassion,
  threeChar,
  taoCh1,
  diamondOpening,
];

export function getSutraById(id) {
  return SUTRAS.find((s) => s.id === id) || null;
}
