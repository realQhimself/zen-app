// 8 classic texts for sutra copying practice

export const SUTRAS = [
  {
    id: 'heart-sutra',
    name: '般若波罗蜜多心经',
    author: '玄奘译',
    text: '观自在菩萨行深般若波罗蜜多时照见五蕴皆空度一切苦厄舍利子色不异空空不异色色即是空空即是色受想行识亦复如是舍利子是诸法空相不生不灭不垢不净不增不减',
    description: '佛教核心经典，阐述空性智慧',
  },
  {
    id: 'diamond-verse',
    name: '金刚经·四句偈',
    author: '鸠摩罗什译',
    text: '一切有为法如梦幻泡影如露亦如电应作如是观',
    description: '金刚经最著名的偈语',
  },
  {
    id: 'platform-verse',
    name: '六祖坛经·名偈',
    author: '惠能',
    text: '菩提本无树明镜亦非台本来无一物何处惹尘埃',
    description: '六祖惠能悟道偈',
  },
  {
    id: 'avalokitesvara',
    name: '观世音菩萨普门品·节选',
    author: '鸠摩罗什译',
    text: '若有无量百千万亿众生受诸苦恼闻是观世音菩萨一心称名观世音菩萨即时观其音声皆得解脱若有持是观世音菩萨名者设入大火火不能烧由是菩萨威神力故',
    description: '法华经中观世音菩萨救苦救难',
  },
  {
    id: 'great-compassion',
    name: '大悲咒',
    author: '伽梵达摩译',
    text: '南无喝啰怛那哆啰夜耶南无阿唎耶婆卢羯帝烁钵啰耶菩提萨埵婆耶摩诃萨埵婆耶摩诃迦卢尼迦耶唵萨皤啰罚曳数怛那怛写南无悉吉栗埵伊蒙阿唎耶婆卢吉帝室佛啰楞驮婆',
    description: '观世音菩萨大慈大悲心咒',
  },
  {
    id: 'three-char',
    name: '三字经·开篇',
    author: '王应麟',
    text: '人之初性本善性相近习相远苟不教性乃迁教之道贵以专昔孟母择邻处子不学断机杼',
    description: '儒家启蒙经典，天人之道',
  },
  {
    id: 'tao-ch1',
    name: '道德经·第一章',
    author: '老子',
    text: '道可道非常道名可名非常名无名天地之始有名万物之母故常无欲以观其妙常有欲以观其徼此两者同出而异名同谓之玄玄之又玄众妙之门',
    description: '道家根本经典，万物之始',
  },
  {
    id: 'diamond-opening',
    name: '金刚经·开篇',
    author: '鸠摩罗什译',
    text: '如是我闻一时佛在舍卫国祇树给孤独园与大比丘众千二百五十人俱',
    description: '金刚经开篇，佛陀说法之缘起',
  },
];

export function getSutraById(id) {
  return SUTRAS.find((s) => s.id === id) || null;
}
