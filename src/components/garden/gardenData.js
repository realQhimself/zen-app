const BASE = import.meta.env.BASE_URL;

export const GARDEN_ITEMS = [
  { id: 'lantern',  name: '禅灯',   cost: 20, image: `${BASE}images/garden/item-lantern.png`,  interaction: 'glow',   link: '/meditation', linkPrompt: '点灯禅修' },
  { id: 'bonsai',   name: '盆栽',   cost: 15, image: `${BASE}images/garden/item-bonsai.png`,   interaction: 'sway',   link: null, linkPrompt: null },
  { id: 'statue',   name: '佛像',   cost: 25, image: `${BASE}images/garden/item-statue.png`,   interaction: 'bow',    link: '/', linkPrompt: '参拜修行' },
  { id: 'pond',     name: '锦鲤池', cost: 20, image: `${BASE}images/garden/item-pond.png`,     interaction: 'ripple', link: '/fish', linkPrompt: '池边敲鱼' },
  { id: 'incense',  name: '香炉',   cost: 15, image: `${BASE}images/garden/item-incense.png`,  interaction: 'smoke',  link: '/sutra', linkPrompt: '焚香抄经' },
];

export const DEFAULT_GARDEN = {
  cycleStartDate: new Date().toISOString().split('T')[0],
  checkIns: [],
  items: [],
};

export const MONK_SPEED = 0.4;
export const INTERACTION_RADIUS = 12;
export const BOUNDS = { minX: 5, maxX: 95, minY: 10, maxY: 85 };
