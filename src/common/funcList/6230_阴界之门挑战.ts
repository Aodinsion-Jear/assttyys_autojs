import { IFuncOrigin, IFuncOperatorOrigin, IFuncOperator } from '@/interface/IFunc';
import { Script } from '@/system/script';

const left = 0;
const center = 1;
const right = 2;

export class Func6230 implements IFuncOrigin {
	id = 6230;
	name = '阴界之门挑战(寮神社界面)';
	desc = '在寮神社界面点击阴界之门入口(阴界版本图标特征取色),进入界面后攻打,挑战界面点挑战,提示弹窗点确定进入组队界面';
	operator: IFuncOperatorOrigin[] = [{
		// 0 寮神社_阴界之门入口(粉紫图标为阴界版本特征,麒麟版本不匹配) → 点击入口
		desc: [1280, 720,
			[
				[right, 743, 34, 0xddb24a],
				[right, 695, 31, 0x4b2b20],
				[left, 251, 498, 0xf3d2f3],
				[left, 250, 522, 0xe3c3e6],
				[left, 286, 511, 0xe0c8e5],
				[left, 270, 539, 0xab94a3],
				[left, 224, 499, 0xcf93e0],
			]
		],
		oper: [
			[center, 1280, 720, 180, 423, 340, 582, 1200],
		]
	}, {
		// 1 狩猎战_阴界之门界面 → 点击右下角攻打按钮
		desc: [1280, 720,
			[
				[right, 1121, 654, 0x9f367f],
				[right, 1107, 640, 0x211134],
				[right, 1089, 650, 0x74102c],
				[right, 1102, 685, 0x961e92],
				[right, 1130, 684, 0xa126ab],
			]
		],
		oper: [
			[right, 1280, 720, 1051, 598, 1273, 701, 1200],
		]
	}, {
		// 2 阴界之门挑战界面 → 点击左下角挑战
		desc: [1280, 720,
			[
				[center, 339, 609, 0xf3b25e],
				[center, 343, 633, 0xf3b25e],
				[center, 466, 249, 0x170b2a],
				[center, 417, 257, 0x170b2a],
				[center, 377, 233, 0x901a31],
				[left, 296, 131, 0x821424],
				[center, 532, 630, 0xc7bdb4],
			]
		],
		oper: [
			[center, 1280, 720, 314, 597, 466, 649, 1200],
		]
	}, {
		// 3 提示弹窗 → 点击确定按钮进入组队界面
		desc: [1280, 720,
			[
				[center, 469, 421, 0xdf6851],
				[center, 470, 450, 0xdf6851],
				[center, 567, 428, 0xdf6851],
				[right, 709, 419, 0xf3b25e],
				[right, 714, 443, 0xf3b25e],
				[center, 628, 357, 0xcbb59c],
			]
		],
		oper: [
			[center, 1280, 720, 673, 407, 842, 458, 1200],
		]
	}];
	operatorFunc(thisScript: Script, thisOperator: IFuncOperator[]): boolean {
		if (thisScript.oper({
			id: 6230,
			name: '阴界之门挑战_寮神社到组队',
			operator: [thisOperator[0], thisOperator[1], thisOperator[2], thisOperator[3]]
		})) {
			return true;
		}
		return false;
	}
}

export default new Func6230();
