export interface DramaEntry {
  id: string;
  userId?: string;
  title: string;
  poster: string;
  rating: number;
  tags: string[];
  actors: string[];
  platform: string;
  summary: string;
  reflection: string;
  date: string;
  releaseDate: string;
  watchCount: number;
  firstEncounter?: string;
  completionDate?: string;
  status: 'completed' | 'watching' | 'planned';
  isMustWatch?: boolean;
}

export const MOCK_ENTRIES: DramaEntry[] = [
  {
    id: '1',
    title: '漫长的季节',
    poster: 'https://picsum.photos/seed/longseason/600/900',
    rating: 5,
    tags: ['犯罪', '家庭', '悬疑'],
    actors: ['范伟', '秦昊', '陈明昊'],
    platform: '腾讯视频',
    summary: '小城桦林，出租车司机王响和妹夫龚彪在调查套牌车的过程中，意外发现了与二十年前碎尸案有关的线索。',
    reflection: '过去就像是一幅慢慢褪色的风景……但有些画面依然鲜活。',
    date: '2023年10月24日',
    releaseDate: '2023-04-22',
    watchCount: 2,
    firstEncounter: '2023-04-10',
    completionDate: '2023-05-15',
    status: 'completed',
    isMustWatch: true,
  },
  {
    id: '2',
    title: '狂飙',
    poster: 'https://picsum.photos/seed/knockout/600/900',
    rating: 4,
    tags: ['犯罪', '动作', '惊悚'],
    actors: ['张译', '张颂文', '李一桐'],
    platform: '爱奇艺',
    summary: '讲述了以一线刑警安欣为代表的正义力量，与黑恶势力展开的长达二十年的生死搏斗。',
    reflection: '一个关于变迁城市中权力与道德的扣人心弦的故事。',
    date: '2023年2月15日',
    releaseDate: '2023-01-14',
    watchCount: 1,
    status: 'completed',
  },
  {
    id: '3',
    title: '延禧攻略',
    poster: 'https://picsum.photos/seed/yanxi/600/900',
    rating: 5,
    tags: ['古装', '爱情', '宫廷'],
    actors: ['吴谨言', '秦岚', '聂远'],
    platform: '爱奇艺',
    summary: '少女魏璎珞为寻求长姐死亡真相，进入紫禁城成为宫女，凭借勇往直前的勇气和机敏灵活的头脑，化解宫廷重重困难。',
    reflection: '精致的设计，以及更精致的计谋。',
    date: '2018年8月20日',
    releaseDate: '2018-07-19',
    watchCount: 3,
    status: 'completed',
  },
  {
    id: '4',
    title: '庆余年',
    poster: 'https://picsum.photos/seed/joy/600/900',
    rating: 4,
    tags: ['古装', '喜剧', '奇幻'],
    actors: ['张若昀', '李沁', '陈道明'],
    platform: '腾讯视频',
    summary: '一个有着神秘身世的少年范闲，自海边小城初出庐，历经家族、江湖、庙堂的种种考验、锤炼的故事。',
    reflection: '现代智慧与古代权谋的独特结合。',
    date: '2019年12月10日',
    releaseDate: '2019-11-26',
    watchCount: 2,
    status: 'completed',
    isMustWatch: true,
  },
  {
    id: '5',
    title: '琅琊榜',
    poster: 'https://picsum.photos/seed/nirvana/600/900',
    rating: 5,
    tags: ['古装', '政治', '剧情'],
    actors: ['胡歌', '刘涛', '王凯'],
    platform: '北京卫视',
    summary: '以平反冤案、扶持明君、振兴山河为主线，讲述了“麒麟才子”梅长苏才冠绝伦、以病弱之躯拨开重重迷雾、智博奸佞的故事。',
    reflection: '一部关于谋略与忠诚的杰作。',
    date: '2015年9月19日',
    releaseDate: '2015-09-19',
    watchCount: 5,
    status: 'completed',
    isMustWatch: true,
  },
  {
    id: '6',
    title: '陈情令',
    poster: 'https://picsum.photos/seed/untamed/600/900',
    rating: 4,
    tags: ['奇幻', '冒险', '武侠'],
    actors: ['肖战', '王一博', '孟子义'],
    platform: '腾讯视频',
    summary: '以五大家族为背景，讲述了云梦江氏故人之子魏无羡和姑苏蓝氏含光君蓝忘机重遇，携手探寻往事真相，守护百姓和平安乐的故事。',
    reflection: '一段关于友谊与正义的美丽旅程。',
    date: '2019年6月27日',
    releaseDate: '2019-06-27',
    watchCount: 2,
    status: 'completed',
  },
  {
    id: '7',
    title: '繁花',
    poster: 'https://picsum.photos/seed/blossoms/600/900',
    rating: 5,
    tags: ['剧情', '上海黑帮', '90年代复古'],
    actors: ['胡歌', '马伊琍', '唐嫣'],
    platform: '腾讯视频',
    summary: '九十年代初，煌煌大名，处处机会，人人争先。阿宝在爷叔的指点下，在和平饭店站稳脚跟，成为叱咤风云的宝总。',
    reflection: '那个时代的上海，就像是一场永不落幕的舞会。金碧辉煌的至真园，阿宝在人潮中那一眼回眸...',
    date: '2023年12月28日',
    releaseDate: '2023-12-27',
    watchCount: 1,
    firstEncounter: '2023-04-10',
    completionDate: '2023-12-28',
    status: 'completed',
  }
];
