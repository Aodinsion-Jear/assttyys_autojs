export interface IMultiFindColorsOrigin {
	[key: string]: {
		region: [number, number, number, number, number, number, number];
		similar?: number;
		// 第i组desc命中后对返回锚点施加的偏移（1280x720下的像素差值），
		// 用于取色点不在可点击区域的场景（如缘结之庭复用庭院背景取色定位UI）
		pointOffsets?: ([number, number] | null)[];
		desc: [number, number,
			[number, number, number, number][]
		][];
	}
}

export interface IMultiFindColors {
	[key: string]: {
		region: [number, number, number, number, number, number, number];
		similar?: number;
		pointOffsets?: ([number, number] | null)[];
		desc: [
			[number, number, number, number][]
		][];
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
