/**
 * 多点找色 desc 单组模板的元数据（庭院皮肤兼容用，见 src/common/courtSkins/）
 * 作为 desc 元素的可选第 4 个元素存在，与 desc 同对象共存，增删变体不会错位
 */
export interface IFindDescMeta {
	skin?: string;      // 皮肤名，如 '缘结之庭'，日志/维护用
	quality?: string;   // 取色画质：'流畅' | '极速' | ...
	state?: string;     // 场景标注：'菜单未展开' | '菜单已展开' 等
	offset?: [number, number];  // 兜底：命中锚点后施加的点击偏移（1280x720 像素差），仅元素本体无法稳定取色时使用
}

export interface IMultiFindColorsOrigin {
	[key: string]: {
		region: [number, number, number, number, number, number, number];
		similar?: number;
		desc: [number, number,
			[number, number, number, number][],
			IFindDescMeta?
		][];
	}
}

export interface IMultiFindColors {
	[key: string]: {
		region: [number, number, number, number, number, number, number];
		similar?: number;
		desc: [
			[number, number, number, number][]
		][];
		// 与 desc 同下标的元数据（origin desc 第 4 元素透传，offset 已按运行分辨率缩放）
		metas?: (IFindDescMeta | null)[];
	}
}

export interface IMultiDetectColorsOrigin {
	[key: string]: {
		// similar?: number;  目前暂时用不上

		// desc不像多点找色做成集合，只保留一个，毕竟针对不同界面的处理方式肯定是不一样的
		desc: [number, number,
			[number, number, number, number][]
		]
		fallbacks?: string[]
	}
}

export interface IMultiDetectColors {
	[key: string]: {
		// similar?: number;  目前暂时用不上
		desc: [number, number, number, number][]
		fallbacks?: string[]
	}
}
