const BASE = import.meta.env.BASE_URL;
const SPRITE = `${BASE}images/garden/new-sprites/`;

export const GARDEN_ITEMS = [
  { id: 'lantern',  name: '禅灯',   cost: 20, image: `${SPRITE}item-lantern-s.png`,  images: { s: `${SPRITE}item-lantern-s.png`, m: `${SPRITE}item-lantern-m.png`, l: `${SPRITE}item-lantern-l.png` }, interaction: 'glow',   link: '/meditation', linkPrompt: '点灯禅修' },
  { id: 'bonsai',   name: '盆栽',   cost: 15, image: `${SPRITE}item-bonsai-s.png`,   images: { s: `${SPRITE}item-bonsai-s.png`,  m: `${SPRITE}item-bonsai-m.png`,  l: `${SPRITE}item-bonsai-l.png`  }, interaction: 'sway',   link: null, linkPrompt: null },
  { id: 'statue',   name: '佛像',   cost: 25, image: `${SPRITE}item-statue-s.png`,   images: { s: `${SPRITE}item-statue-s.png`,  m: `${SPRITE}item-statue-m.png`,  l: `${SPRITE}item-statue-l.png`  }, interaction: 'bow',    link: '/', linkPrompt: '参拜修行' },
  { id: 'pond',     name: '锦鲤池', cost: 20, image: `${SPRITE}item-pond-s.png`,     images: { s: `${SPRITE}item-pond-s.png`,    m: `${SPRITE}item-pond-m.png`,    l: `${SPRITE}item-pond-l.png`    }, interaction: 'ripple', link: '/fish', linkPrompt: '池边敲鱼' },
  { id: 'incense',  name: '香炉',   cost: 15, image: `${SPRITE}item-incense-s.png`,  images: { s: `${SPRITE}item-incense-s.png`, m: `${SPRITE}item-incense-m.png`, l: `${SPRITE}item-incense-l.png` }, interaction: 'smoke',  link: '/sutra', linkPrompt: '焚香抄经' },
];

export const DEFAULT_GARDEN = {
  cycleStartDate: new Date().toISOString().split('T')[0],
  checkIns: [],
  items: [],
};

export const MONK_SPEED = 0.4;
export const INTERACTION_RADIUS = 12;
export const BOUNDS = { minX: 5, maxX: 95, minY: 10, maxY: 85 };
