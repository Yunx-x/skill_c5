export const badStr = [
    "诛仙",
    "宣传",
    "国际",
    "广告",
    "http",
    ".com",
    "QQ",
    "职业",
    ".us",
    "zhuxian",
    "白嫖",
    "五代",
    "完美",
    "公益",
    "仿官",
    "微变",
    "超变",
    "网址",
    "耐玩",
    "法服",
    "官服",
];


/**
 * 腰带可用的蕴灵符
 */
export const beltStone = [311000, 311001]

/**
 * 一键十连蕴灵凭证
 */
export const ok10UpgradeItem = 340058


/**
 * 一星Boss
 */
export const star1Boss = [
    632,//蛙王
    633,//悍匪
    634,//神火教长老
    635,//金刚
    636,//神火魔祖
    637,//巨熊妖
    638,//噬血恶僧
    639,//骷髅将军
    640,//渔人蛛
    641,//海盗船长
    642,//犀甲之王
    643,//死泽鱼妖
    644,//万虫之母
    645,//死泽厉鬼
    647,//血狮
    648,//玄冥幽鬼
    681,//洪荒兽王
    5596,//鱼人王
    5597,//巫族长老
    10491,//不死天尸
    10492,//八荒火龙
]

export const star2Boss = [
    10669,//昆仑奴
    10670,//法莲王
    10671,//归蝶王
    10672,//天忍王
    10673,//魔獒
    10674,//樱木王
    10675,//阴阳王
    10676,//风火王
    10677,//安土王
    10678,//玄天上将
    10679,//浑沌
    10680,//开明兽
    11563,//冰姹玄女
    13575,//金铃夫人
    13576,//黑心老人
    13578,//万剑一
    13579,//普智
]

export const star3Boss = [
    22106,//邪恶先锋·涛
    22107,//邪恶先锋·凯
    22251,//背叛者·瞳
    22252,//背叛者·娟
    22253,//背叛者·宇
    35236,//冥界·天狼
    35238,//冥界·血狮
    35239,//冥界·古猿
    35240,//冥界·玄鸟
    35241,//冥界·圣使
    35242,//冥界·饕餮
    35243,//冥界·兽神
]

export const star4Boss = [
    400019,//镜·朱颜
    400020,//花·绛妃
    400021,//水·鲤仙
    400022,//月·素娥
    400023,//空·铠鬼
]

export const star5Boss = [
    66999,//烛龙·九阴
    400041,//灵魄·盘古
    400042,//灵魄·女娲
    400043,//混蛋·黑心老G
]

export const star6Boss = [
    400046,//鸿钧神猴·无支祁
    400047,//混沌主宰
    400048,//异界守护者
]

export const starWeek8Boss = [
    400002,//万霆
    400003,//川壅
    400005,//月神·望舒
    400044,//蚩尤
    400045,//魔尊
]

export const siXiang1Boss = [
    53676,
    53681,
    53686,
    53934,
    54017,
]

export const siXiang2Boss = [
    53677,
    53682,
    53687,
    54098,
    54730,
]

export const siXiang3Boss = [
    53678,
    53683,
    53688,
    54099,
    54731,
]

export const siXiang4Boss = [
    53679,
    53684,
    53689,
    54100,
    54732,
]

export const siXiang5Boss = [
    53680,
    53685,
    53690,
    54101,
    54733,
]

export const chunJieBoss = [
    400055,//相柳
]

export const kongSangBoss = [
    100782,
    100788,
    100789,
    100790,
    100791,
    100792,
    100793,
    100794,
    100795,
    100796,
]

export const kongSangLastBoss = [
    100797,
    100798
]

//困兽城死亡记录
type DeathInfo = { time: number; count: number; };

//key-玩家id，value-死亡记录
export const kongShouCityDeathRecord = new Map<number, DeathInfo>


//检测控制任务
export const cashTaskId = 61047
//发放任务完成物品
export const cashTaskItem = 340067
//map。元宝数量，任务id
export const cashTaskMap = new Map<number, number>
cashTaskMap.set(100000, 61048)
cashTaskMap.set(300000, 61049)
cashTaskMap.set(500000, 61050)
cashTaskMap.set(1000000, 61051)
cashTaskMap.set(1500000, 61052)
cashTaskMap.set(3000000, 61053)


//任务活跃度table
export const taskLivenessTable = new Map<number, string>
taskLivenessTable.set(61003,"2-1")//每日一挂
taskLivenessTable.set(61022,"3-1")//手可摘星辰
taskLivenessTable.set(61023,"3-1")//化气为豆
taskLivenessTable.set(61024,"3-1")//天书奇谭
taskLivenessTable.set(61040,"3-3")//雪浪宝藏
taskLivenessTable.set(61070,"2-2")//一星挑战
taskLivenessTable.set(61110,"3-2")//二星挑战
taskLivenessTable.set(61150,"4-2")//三星挑战
taskLivenessTable.set(61200,"5-2")//四星挑战
taskLivenessTable.set(61220,"6-2")//五星挑战
taskLivenessTable.set(11264,"5-1")//钓鱼
taskLivenessTable.set(61250,"5-1")//征讨·无支祁
taskLivenessTable.set(61251,"5-1")//征讨·混沌主宰
taskLivenessTable.set(61252,"5-1")//征讨·异界守护者
taskLivenessTable.set(38880,"3-1")//青云
taskLivenessTable.set(38878,"3-1")//天墟
taskLivenessTable.set(29736,"3-1")//十神
taskLivenessTable.set(36902,"3-1")//五毒
taskLivenessTable.set(61253,"5-1")//周常·万霆
taskLivenessTable.set(61254,"5-1")//周常·川壅
taskLivenessTable.set(61255,"5-1")//周常·蚩尤
taskLivenessTable.set(61256,"5-1")//周常·月神
taskLivenessTable.set(61257,"5-1")//周常·魔尊
taskLivenessTable.set(61258,"5-1")//周常·困兽城主

//地图活跃度table
export const mapLivenessTable = new Map<number, string>
mapLivenessTable.set(536,"3-1")//四象
mapLivenessTable.set(542,"4-5")//财神
mapLivenessTable.set(528,"3-1")//云渺
mapLivenessTable.set(443,"3-1")//南土
mapLivenessTable.set(599,"3-1")//空桑
mapLivenessTable.set(500,"3-1")//兽神

//特殊活跃度table
export const specialLivenessTable = new Map<number, string>
specialLivenessTable.set(5001,"2-1")
specialLivenessTable.set(5002,"3-1")
specialLivenessTable.set(5003,"4-1")
specialLivenessTable.set(5004,"5-1")
specialLivenessTable.set(5005,"6-1")
specialLivenessTable.set(5006,"3-5")
specialLivenessTable.set(5007,"2-5")
specialLivenessTable.set(5008,"5-1")
specialLivenessTable.set(5009,"2-1")
