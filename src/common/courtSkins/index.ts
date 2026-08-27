import { ICourtSkin, IDetectEntry, IFindVariant } from './types';
import yuanJieZhiTing from './yuanJieZhiTing';

// 注册的庭院皮肤模块，新增皮肤在此追加 import 并加入数组
const courtSkins: ICourtSkin[] = [
	yuanJieZhiTing,	// 缘结之庭
];

// 聚合所有皮肤的判定条目与找色变体（es5 环境无 flatMap，用 reduce 展开）
export const skinDetects: IDetectEntry[] = courtSkins.reduce((ret, skin) => ret.concat(skin.detects), [] as IDetectEntry[]);
export const skinFinds: IFindVariant[] = courtSkins.reduce((ret, skin) => ret.concat(skin.finds), [] as IFindVariant[]);
