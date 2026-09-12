import { IFuncOrigin, IFuncOperatorOrigin, IFuncOperator } from '@/interface/IFunc';
import { Script } from '@/system/script';

const left = 0;
const center = 1;
const right = 2;

// 超时状态（模块级，operatorFunc 以 call(null) 调用，不能用 this）
// idle: 尚未识别到任何阴门界面; active: 已识别并开始操作; done: 已进组队界面移交6231
let yinmenState: 'idle' | 'active' | 'done' = 'idle';
let yinmenEnterTime = 0;
const YINMEN_TIMEOUT = 30000; // 30s 内未识别到任何相关界面则停止脚本

export class Func6121 implements IFuncOrigin {
	id = 6121;
	name = '阴门挑战';
	desc = '阴界之门地图点击阴门图标，挑战界面点击挑战(弹窗点确认)，进入组队界面后移交6231；30s未识别到任何相关界面则停止脚本';
	operator: IFuncOperatorOrigin[] = [{
		// 0 阴界之门地图界面 → 点击阴界之门图标
		desc: [1280, 720,
			[
				[right, 1109, 641, 0x2b153f],
				[right, 1089, 648, 0x300812],
				[right, 1087, 670, 0x552a30],
				[right, 1124, 657, 0x8d2a6e],
				[right, 1141, 678, 0x3b132a],
				[left, 44, 39, 0xf3e8a7],
				[left, 66, 39, 0xb3834d],
			]
		],
		oper: [
			[right, 1280, 720, 1072, 609, 1273, 694, 1000]
		]
	}, {
		// 1 阴界之门挑战界面 → 点击挑战按钮
		desc: [1280, 720,
			[
				[left, 302, 141, 0x841a24],
				[left, 260, 187, 0xba473d],
				[center, 354, 336, 0x6a102a],
				[center, 409, 408, 0xf7eff5],
				[center, 459, 464, 0x641687],
				[center, 509, 455, 0x120f0e],
				[center, 353, 624, 0xf3b25e],
			]
		],
		oper: [
			[left, 1280, 720, 313, 597, 473, 643, 1000]
		]
	}, {
		// 2 弹窗 → 点击确认按钮
		desc: [1280, 720,
			[
				[center, 458, 417, 0xdf6851],
				[center, 485, 418, 0xdf6851],
				[center, 533, 380, 0xcbb59c],
				[right, 708, 427, 0xf3b25e],
				[right, 733, 430, 0x403527],
				[right, 815, 432, 0xf3b25e],
				[right, 781, 445, 0xf3b25e],
			]
		],
		oper: [
			[right, 1280, 720, 678, 412, 835, 454, 1000]
		]
	}, {
		// 3 检测已进入组队界面(与6231同一取色) → 移交6231
		desc: [1280, 720,
			[
				[right, 803, 56, 0xfce9d1],
				[right, 831, 58, 0xfadabf],
				[right, 1164, 46, 0xcfa578],
				[right, 1238, 42, 0xcba275],
				[right, 1210, 615, 0xf1de93],
				[right, 1210, 655, 0x35281c],
				[left, 60, 552, 0xf9f3e0],
				[left, 61, 647, 0xf7f6df],
			]
		]
	}, {
		// 4 检测阴界之门已挑战(挑战界面按钮置灰状态) → 停止脚本
		desc: [1280, 720,
			[
				[left, 291, 109, 0x761a36],
				[left, 291, 350, 0x211137],
				[center, 362, 325, 0x230b0f],
				[center, 340, 452, 0x272323],
				[center, 362, 622, 0xa89f97],
				[center, 368, 618, 0xc7bdb4],
				[right, 681, 172, 0xd9b62e],
			]
		]
	}];
	operatorFunc(thisScript: Script, thisOperator: IFuncOperator[]): boolean {
		const now = Date.now();
		if (!yinmenEnterTime) {
			yinmenEnterTime = now;
		}

		// 已挑战(按钮置灰)优先判定，防止置灰界面被挑战取色误匹配导致误点
		if (thisScript.oper({
			name: '检测_阴界之门已挑战',
			operator: [{
				desc: thisOperator[4].desc
			}]
		})) {
			thisScript.myToast('阴界之门今日已挑战，脚本停止');
			thisScript.stop();
			sleep(2000);
			return false;
		}

		// 弹窗优先匹配，避免弹窗遮挡时误点挑战界面
		if (thisScript.oper({
			id: 6121,
			name: '阴门挑战_操作',
			operator: [thisOperator[2], thisOperator[1], thisOperator[0]]
		})) {
			yinmenState = 'active';
			yinmenEnterTime = now;
			return true;
		}

		// 已进入组队界面，移交6231，不再计时
		if (thisScript.oper({
			name: '检测_已进入阴门组队界面',
			operator: [{
				desc: thisOperator[3].desc
			}]
		})) {
			yinmenState = 'done';
			return false;
		}

		// 移交后(战斗中/结算中)不再做超时判定；idle/active 阶段 30s 无识别则停止
		if (yinmenState !== 'done' && now - yinmenEnterTime > YINMEN_TIMEOUT) {
			thisScript.myToast('阴门挑战: 30s内未识别到任何相关界面，脚本停止');
			thisScript.stop();
			sleep(2000);
			return false;
		}

		return false;
	}
}

export default new Func6121();
