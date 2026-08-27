import { IMultiDetectColorsOrigin } from '@/interface/IMultiColor';

/**
 * 庭院皮肤兼容数据规范（新增皮肤前必读）
 *
 * 一、接入流程
 * 1. 复制 yuanJieZhiTing.ts 为新皮肤文件，修改 skinName 并清空数据；
 * 2. 取色（开发分辨率 1280x720，菜单未展开/已展开两种状态分别取）：
 *    - 庭院菜单 detect ×2（未展开、已展开）：取该皮肤独有且静态的 UI 点 6-8 个，
 *      已展开判定需避开会被活动图标替换的区域（参考 sp 天命火铃彦姬版本取点）；
 *    - 找色变体：'庭院_探索灯笼'、'庭院_町中竖牌'、'悬赏_庭院检测悬赏图标'；
 *    - 每个关键 UI 至少取流畅画质，并补一组第二画质（极速/低画质）变体；
 * 3. 在 index.ts 中注册新皮肤模块；
 * 4. 实机验证新皮肤，并回归默认皮肤确认无误命中。
 *
 * 二、锚点原则
 * - 第一原则：取色点落在可点击元素本体上（灯笼/竖牌/悬赏图标本体），锚点即点击点，不写 offset；
 * - offset 仅作兜底：元素本体被动态特效/遮挡无法稳定取色时，锚点取邻近稳定参照物，
 *   offset 与 desc 写在同一变体对象内（禁止并行数组，防止下标错位）；
 * - 带 offset 的变体，参照物须位置固定、皮肤独占，并在注释中说明参照物是什么；
 * - region 只允许最小扩区，禁止扩到近全屏（背景锚点在任何庭院时刻都可能误命中）；
 * - 变体顺序：本体取色变体在前，offset 兜底变体在最后（findMultiColor 按序短路）。
 */

/**
 * 找色变体：追加到 multiFindColors 某个 key 的 desc 中的一组模板
 */
export interface IFindVariant {
	key: string;               // 目标 find key，如 '庭院_探索灯笼'
	desc: [number, number, [number, number, number, number][]];  // 与 multiFindColors origin desc 单元素同构
	skin: string;              // 皮肤名，如 '缘结之庭'，日志/维护用
	quality: string;           // 取色画质（必填）：'流畅' | '极速' | ...
	state?: string;            // 场景标注：'菜单未展开' | '菜单已展开' 等
	offset?: [number, number]; // 兜底：命中锚点后施加的点击偏移（1280x720 像素差）
}

/**
 * 界面判定条目：新增到 multiDetectColors 并挂到 base key 的 fallbacks
 */
export interface IDetectEntry {
	key: string;               // 如 '页面是否为庭院_菜单未展开_缘结之庭'
	desc: IMultiDetectColorsOrigin[string]['desc'];
	attachTo: string[];        // 要挂到哪些 base key 的 fallbacks
}

/**
 * 一个庭院皮肤的全部兼容数据
 */
export interface ICourtSkin {
	skinName: string;
	detects: IDetectEntry[];
	finds: IFindVariant[];
}
