import { Disaster, DisasterType, Comment, CommentTag } from '../types';

export const DISASTER_TYPE_DETAILS: { [key in DisasterType]: { color: string, iconUrl: string } } = {
  // Updated earthquake icon and color for better visibility on the dark map.
  [DisasterType.Earthquake]: { color: "bg-orange-500", iconUrl: "https://img.icons8.com/?size=48&id=dJuRZQappxT9&format=png&color=000000" },
  [DisasterType.Typhoon]: { color: "bg-blue-500", iconUrl: "https://img.icons8.com/color/48/tornado.png" },
  [DisasterType.Landslide]: { color: "bg-orange-700", iconUrl: "https://img.icons8.com/?size=48&id=OedcKsGgfldo&format=png&color=000000" },
  [DisasterType.Fire]: { color: "bg-red-600", iconUrl: "https://img.icons8.com/color/48/fire-element--v1.png" },
  [DisasterType.Flood]: { color: "bg-cyan-500", iconUrl: "https://img.icons8.com/color/48/flood.png" },
  [DisasterType.Accident]: { color: "bg-yellow-500", iconUrl: "https://img.icons8.com/?size=48&id=11995&format=png&color=000000" }
};

export const DISASTERS: Disaster[] = [
  {
    id: 1,
    name: "921大地震",
    type: DisasterType.Earthquake,
    date: "1999-09-21",
    location: [23.853, 120.826],
    description: "芮氏規模7.3的強烈地震，震央位於南投集集，造成全台嚴重傷亡與財產損失，是台灣近代史上最嚴重的自然災害之一。",
    casualties: "2,415人死亡，29人失蹤，11,305人受傷",
    stories: [
      { title: "歷史回憶", url: "https://www.twreporter.org/a/921-earthquake-20th-historical-voice" },
      { title: "心理重建", url: "https://www.twreporter.org/a/921-earthquake-20th-disaster-mental-health-system" },
      { title: "系列報導", url: "https://ourisland.pts.org.tw/content/8274" }
    ]
  },
  {
    id: 2,
    name: "莫拉克風災 (八八風災)",
    type: DisasterType.Typhoon,
    date: "2009-08-08",
    location: [22.990, 120.218],
    description: "莫拉克颱風帶來的破紀錄降雨，引發大規模水災與土石流，重創南台灣，尤其是高雄甲仙小林村幾乎滅村。",
    casualties: "681人死亡，18人失蹤",
    stories: [
      { title: "災害成因分析", url: "https://www.twreporter.org/a/bookreview-typhoon-morakot-xiaolin-village-disaster-causes"},
      { title: "災後重建", url: "https://ourisland.pts.org.tw/content/4980"},
      { title: "小林十年", url: "https://www.twreporter.org/a/typhoon-morakot-10-years-xiaolin-village-relocation"}
    ]
  },
  {
    id: 3,
    name: "高雄氣爆事件",
    type: DisasterType.Fire,
    date: "2014-07-31",
    location: [22.618, 120.309],
    description: "因地下管線丙烯洩漏，引發連環爆炸，高雄市前鎮區與苓雅區多條街道被炸毀，造成嚴重傷亡。",
    casualties: "32人死亡，321人受傷",
    stories: [
      { title: "災害回顧", url: "https://www.gvm.com.tw/article/44256"},
      { title: "人物特寫", url: "https://www.google.com/url?sa=t&source=web&cd=&ved=2ahUKEwjazsfglZGQAxXwcvUHHRlrL94QFnoECFoQAQ&url=https%3A%2F%2Ftakao.kcg.gov.tw%2Farticle%2F623&usg=AOvVaw1mqMSgRqOhKka3LcagkDxJ&opi=89978449"}
    ]
  },
  {
    id: 4,
    name: "2018年普悠瑪列車出軌事件",
    type: DisasterType.Accident,
    date: "2018-10-21",
    location: [24.625, 121.815],
    description: "普悠瑪6432次列車在宜蘭新馬車站附近發生出軌事故，造成嚴重傷亡，是台鐵近代最嚴重的事故之一。",
    casualties: "18人死亡，215人受傷",
    stories: [
      { title: "倖存者回憶錄", url: "https://www.twreporter.org/a/taiwan-train-railway-puyuma-accident-healing" },
      { title: "台鐵困境", url: "https://www.cw.com.tw/special/2439"}
    ]
  },
   {
    id: 5,
    name: "2016年台南大地震",
    type: DisasterType.Earthquake,
    date: "2016-02-06",
    location: [22.93, 120.26],
    description: "芮氏規模6.6的地震，震央在高雄美濃，但對台南造成嚴重災情，維冠金龍大樓倒塌事件最為慘重。",
    casualties: "117人死亡, 551人受傷",
    stories: [
      { title: "倖存者特寫", url: "https://www.twreporter.org/a/0206earthquake-shelter"},
      { title: "倒塌原因", url: "https://ourisland.pts.org.tw/content/2445"}
    ]
  }
];

export const COMMENTS_DATA: { [key: number]: Comment[] } = {
  1: [
    { id: 101, author: '歷史見證者', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', timestamp: '3 年前', text: '那晚的搖晃永生難忘，天亮後看到的世界完全變了樣。希望大家永遠記得教訓。', likedBy: ['防災小達人', '新生代'], tag: CommentTag.Experience, replies: [{ id: 1011, author: '新生代', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e', timestamp: '1 年前', text: '謝謝前輩分享，我們雖然沒經歷過，但課本上的文字遠不如您的親身感受來得震撼。', likedBy: [], tag: CommentTag.Reflection}] },
    { id: 102, author: '防災小達人', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f', timestamp: '1 年前', text: '提醒大家，家中一定要準備緊急避難包，並且要跟家人約定好集合地點！', likedBy: [], tag: CommentTag.Suggestion },
  ],
  2: [
    { id: 201, author: '南部鄉親', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a', timestamp: '2 年前', text: '雨下了好幾天都沒停，從沒想過水會淹這麼高。小林村的悲劇真的太痛心了。', likedBy: [], tag: CommentTag.Experience },
  ],
  3: [
    { id: 301, author: '高雄人', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704b', timestamp: '5 個月前', text: '那天晚上還以為是打雷，沒想到是爆炸... 街道被炸開的畫面到現在還會做惡夢。', likedBy: [], tag: CommentTag.Experience },
  ]
};