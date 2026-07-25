export type Dietary = 'V' | 'VG' | 'GF' | 'DF';

export const DIETARY_LABELS: Record<Dietary, string> = {
  V: 'Vegetarian',
  VG: 'Vegan',
  GF: 'Gluten-Free',
  DF: 'Dairy-Free',
};

export type MenuItem = {
  id: string;
  title: string;
  desc: string;
  longDesc: string;
  price: number;
  category: string;
  dietary: Dietary[];
  image: string;
  outOfStock?: boolean;
};

export const TASTING_MENU = [
  {
    name: 'Snacks',
    items: [
      {
        title: 'Kinilaw Tart',
        desc: 'Yellowfin tuna, local citrus, burnt coconut, seaweed shell',
      },
      {
        title: 'Mushroom Chawanmushi',
        desc: 'Shiitake, crab roe, calamansi ponzu',
      },
    ],
  },
  {
    name: 'Sea',
    items: [
      { title: 'Aklan Oyster', desc: 'Fermented green mango water, dill oil' },
      { title: 'Grouper', desc: 'Smoked clam sauce, heart of palm, nasturtium' },
    ],
  },
  {
    name: 'Land',
    items: [
      {
        title: 'Inasal Duck',
        desc: 'Aged duck breast, lemongrass glaze, confit leg, charred onion',
      },
      {
        title: 'Wagyu Striploin',
        desc: 'A5 Kagoshima, black garlic pureé, fermented mustard leaves',
      },
    ],
  },
  {
    name: 'Sweet',
    items: [
      { title: 'Palate Cleanser', desc: 'Dalanghita sorbet, mint, gin' },
      {
        title: 'Textures of Coconut',
        desc: 'Toasted coconut mousse, latik crumble, pandan gel',
      },
    ],
  },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'kinilaw',
    title: 'Kinilaw',
    desc: 'Yellowfin, calamansi, burnt coconut, smoked salt',
    longDesc:
      'Yellowfin tuna "cooked" in local citrus, tossed with burnt coconut shavings and a whisper of smoked salt.',
    price: 950,
    category: 'Appetizers',
    dietary: ['GF', 'DF'],
    image: 'https://images.pexels.com/photos/31495671/pexels-photo-31495671.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'heirloom-tomato',
    title: 'Heirloom Tomato',
    desc: 'Stracciatella, basil oil, smoked sea salt',
    longDesc:
      'A rotating selection of heirloom tomatoes from our upland partner farms, torn stracciatella, basil pressed to oil, and a whisper of smoked sea salt.',
    price: 850,
    category: 'Appetizers',
    dietary: ['V', 'GF'],
    image: 'https://images.pexels.com/photos/11725599/pexels-photo-11725599.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'wagyu-tartare',
    title: 'Wagyu Tartare',
    desc: 'Cured egg yolk, adobo flakes, sourdough crisps',
    longDesc:
      'Hand-cut wagyu, folded with a slow-cured egg yolk and crumbled adobo flakes, finished with shards of charred sourdough for contrast in texture.',
    price: 1200,
    category: 'Appetizers',
    dietary: ['GF'],
    image: 'https://images.pexels.com/photos/36523171/pexels-photo-36523171.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'aklan-oyster',
    title: 'Aklan Oyster',
    desc: 'Fermented green mango water, dill oil',
    longDesc:
      'Cold-served Aklan oysters with a bright, fermented green mango mignonette and a thread of dill oil.',
    price: 980,
    category: 'Appetizers',
    dietary: ['GF', 'DF'],
    image: 'https://images.pexels.com/photos/6953375/pexels-photo-6953375.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'seared-scallops',
    title: 'Seared Scallops',
    desc: 'Caviar, brown butter, citrus segments',
    longDesc:
      'Hokkaido scallops seared to a golden crust, finished with black caviar and a nutty brown butter sauce.',
    price: 1400,
    category: 'Appetizers',
    dietary: ['GF'],
    image: 'https://images.pexels.com/photos/4871121/pexels-photo-4871121.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'beef-carpaccio',
    title: 'Beef Carpaccio',
    desc: 'Arugula, shaved parmesan, olive oil',
    longDesc:
      'Thinly sliced tenderloin, dressed with peppery arugula, shaved aged parmesan, and a drizzle of estate olive oil.',
    price: 1100,
    category: 'Appetizers',
    dietary: ['GF'],
    image: 'https://images.pexels.com/photos/20807274/pexels-photo-20807274.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'iberico-secreto',
    title: 'Iberico Pork Secreto',
    desc: 'Charred eggplant pureé, soy-calamansi glaze',
    longDesc:
      'Iberico secreto grilled over charcoal, resting on a silken charred eggplant pureé, finished tableside with a soy-calamansi glaze.',
    price: 2800,
    category: 'Mains',
    dietary: ['GF'],
    image: 'https://images.pexels.com/photos/36051529/pexels-photo-36051529.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'lamb-rack',
    title: 'Herb-Crusted Lamb Rack',
    desc: 'Rosemary jus, root vegetables, shallot confit',
    longDesc:
      'New Zealand lamb rack in a fresh herb crust, finished with a rosemary jus, root vegetables, and shallot confit.',
    price: 2600,
    category: 'Mains',
    dietary: ['GF'],
    image: 'https://images.pexels.com/photos/323682/pexels-photo-323682.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'grouper',
    title: 'Grouper',
    desc: 'Smoked clam sauce, heart of palm, nasturtium',
    longDesc:
      'Pan-seared grouper resting in a smoked clam sauce, with heart of palm and peppery nasturtium leaf.',
    price: 2200,
    category: 'Mains',
    dietary: ['GF'],
    image: 'https://images.pexels.com/photos/29596682/pexels-photo-29596682.png?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'tiger-prawns',
    title: 'Tiger Prawns',
    desc: 'Aligue butter, garlic chips, squid ink tuile',
    longDesc:
      'Whole tiger prawns basted in crab-fat aligue butter, crisp garlic chips, and a squid ink tuile for a savory finish.',
    price: 2500,
    category: 'Mains',
    dietary: ['GF'],
    image: 'https://images.pexels.com/photos/10487767/pexels-photo-10487767.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'mushroom-risotto',
    title: 'Mushroom Risotto',
    desc: 'Wild mushrooms, truffle, aged parmesan',
    longDesc:
      'Slow-stirred carnaroli rice with a trio of wild mushrooms, shaved black truffle, and twenty-four-month aged parmesan.',
    price: 1800,
    category: 'Mains',
    dietary: ['V', 'GF'],
    image: 'https://images.pexels.com/photos/21424385/pexels-photo-21424385.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'inasal-duck',
    title: 'Inasal Duck',
    desc: 'Lemongrass glaze, confit leg, charred onion',
    longDesc:
      'Aged duck breast lacquered in an annatto-lemongrass glaze, served alongside a confit leg and charred spring onion.',
    price: 2400,
    category: 'Mains',
    dietary: ['GF', 'DF'],
    image: 'https://images.pexels.com/photos/29799014/pexels-photo-29799014.jpeg?auto=compress&cs=tinysrgb&w=1200',
    outOfStock: true,
  },
  {
    id: 'ube-textures',
    title: 'Textures of Ube',
    desc: 'Ube mousse, latik crumble, pandan gel',
    longDesc:
      'A study in ube across three textures — silken mousse, toasted coconut latik crumble, and a cool pandan gel.',
    price: 650,
    category: 'Dessert',
    dietary: ['V'],
    image: 'https://images.pexels.com/photos/5638555/pexels-photo-5638555.png?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'coconut-textures',
    title: 'Textures of Coconut',
    desc: 'Toasted coconut mousse, latik crumble, pandan gel',
    longDesc:
      'Toasted coconut mousse layered with a crisp latik crumble and a cool pandan gel, closing the meal on a quiet, milky note.',
    price: 650,
    category: 'Dessert',
    dietary: ['V', 'GF'],
    image: 'https://images.pexels.com/photos/4551125/pexels-photo-4551125.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'dalanghita-sorbet',
    title: 'Dalanghita Sorbet',
    desc: 'Local mandarin, mint, a touch of gin',
    longDesc:
      'Bright dalanghita mandarin sorbet, finished with fresh mint and a restrained pour of gin.',
    price: 450,
    category: 'Dessert',
    dietary: ['VG', 'GF', 'DF'],
    image: 'https://images.pexels.com/photos/13068808/pexels-photo-13068808.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'creme-brulee',
    title: 'Calamansi Crème Brûlée',
    desc: 'Torched sugar crust, fresh berries, mint',
    longDesc:
      'Silken calamansi custard under a torched sugar crust, finished with fresh berries and mint.',
    price: 550,
    category: 'Dessert',
    dietary: ['V', 'GF'],
    image: 'https://images.pexels.com/photos/18976995/pexels-photo-18976995.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'chocolate-fondant',
    title: 'Chocolate Fondant',
    desc: 'Molten dark chocolate, vanilla ice cream, sea salt',
    longDesc:
      'Warm dark chocolate fondant with a molten center, paired with vanilla bean ice cream and a touch of sea salt.',
    price: 600,
    category: 'Dessert',
    dietary: ['V'],
    image: 'https://images.pexels.com/photos/5638516/pexels-photo-5638516.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'basque-cheesecake',
    title: 'Burnt Basque Cheesecake',
    desc: 'Caramelized crust, silken center, sea salt',
    longDesc:
      'Our take on the San Sebastián classic — a deeply caramelized crust giving way to a silken, barely-set center, finished with sea salt.',
    price: 500,
    category: 'Dessert',
    dietary: ['V', 'GF'],
    image: 'https://images.pexels.com/photos/6607325/pexels-photo-6607325.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
];

export const BEVERAGE_MENU = [
  {
    category: 'Signatures',
    items: [
      { title: 'The Manila Sunset', desc: 'Don Papa rum, blood orange, bitters', price: '₱750' },
      { title: 'Calamansi Sour', desc: 'Gin, local citrus, egg white, floral mist', price: '₱650' },
      { title: 'Barako Espresso Martini', desc: 'Batangas barako coffee, vodka, cacao bitters', price: '₱780' },
      { title: 'Sampaguita Fizz', desc: 'Sampaguita cordial, yuzu, soda, dry vermouth', price: '₱620' },
    ],
  },
  {
    category: 'Wine Pairing',
    items: [
      { title: 'Standard Pairing', desc: '5 glasses selected by our sommelier', price: '₱3,500' },
      { title: 'Premium Pairing', desc: '5 glasses of rare vintages', price: '₱6,000' },
    ],
  },
  {
    category: 'Non-Alcoholic',
    items: [
      { title: 'Dalandan Spritz', desc: 'Local orange, soda, rosemary', price: '₱380' },
      { title: 'Iced Salabat', desc: 'Ginger tea, honey, calamansi', price: '₱320' },
    ],
  },
];

export const MENU_CATEGORIES = Array.from(
  new Set(MENU_ITEMS.map((item) => item.category)),
);

export const PRICE_RANGES = [
  { id: 'under-1000', label: 'Under ₱1,000', test: (p: number) => p < 1000 },
  { id: '1000-2000', label: '₱1,000–2,000', test: (p: number) => p >= 1000 && p <= 2000 },
  { id: 'over-2000', label: '₱2,000+', test: (p: number) => p > 2000 },
];
