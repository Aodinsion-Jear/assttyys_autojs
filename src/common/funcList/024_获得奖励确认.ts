import { IFuncOrigin, IFuncOperatorOrigin } from '@/interface/IFunc';

// const normal = -1; //定义常量
const left = 0;
const center = 1;
const right = 2;

export class Func024 implements IFuncOrigin {
	id = 24;
	name = '获得奖励确认';
	operator: IFuncOperatorOrigin[] = [{ // 奖励只有1排
		desc: [1280, 720,
			[
				[center, 424, 328, 0xbfa88f],
				[center, 408, 237, 0x382a1c],
				[center, 869, 327, 0xb79e86],
				[center, 926, 386, 0x825e34],
				[center, 371, 395, 0x8b673e]
			]
		],
		oper: [
			[left, 1280, 720, 69, 171, 170, 452, 500]
		]
	}, { // 奖励有2排
		desc: [1280, 720,
			[
				[center, 401, 210, 0x39291d],
				[center, 828, 208, 0x3c2a20],
				[center, 917, 418, 0x8e6a41],
				[center, 370, 430, 0x8d6940],
				[center, 619, 254, 0xcbb59e]]
		],
		oper: [
			[left, 1280, 720, 69, 171, 170, 452, 500]
		]
	}, { // 奖励一排且只有5个的时候
		desc: [1280, 720,
			[
				[center, 379, 241, 0x38291d],
				[center, 897, 242, 0x382a1d],
				[center, 959, 237, 0x5e3d22],
				[center, 922, 426, 0x88653c],
				[center, 364, 419, 0x8d693f],
				[center, 671, 239, 0xeadca5],
				[center, 863, 435, 0xbaa289],
			]
		],
		oper: [
			[center, 1280, 720, 1042, 176, 1187, 585, 500],
		]
	}, { // 雪御前boss
		desc: [1280, 720,
			[
				[center, 1220, 38, 0xe8d3d0],
				[center, 1212, 31, 0xe9d4d1],
				[center, 1229, 33, 0xe7d3ce],
				[center, 1221, 26, 0xa66090],
				[center, 1222, 54, 0xad5796],
			]
		],
		oper: [
			[center, 1280, 720, 1215, 32, 1230, 50, 1000],
		]
	}, { // 思金神活动获得奖励
		desc: [1280, 720,
			[
				[left, 45, 46, 0x30343c],
				[left, 71, 48, 0x343841],
				[left, 100, 50, 0x363c45],
				[left, 42, 75, 0x383d46],
				[left, 73, 75, 0x373d47],
				[left, 99, 76, 0x343a43],
				[right, 1182, 263, 0x292b36],
				[right, 1187, 300, 0x735a3c],
				[right, 1183, 350, 0x303136],
				[right, 1208, 271, 0x1d1e24],
				[right, 1213, 304, 0x2e2e31],
				[right, 1212, 341, 0x292d36],
			]
		],
		oper: [
			[center, 1280, 720, 850, 580, 1255, 703, 1000],
		]
	}]
}
