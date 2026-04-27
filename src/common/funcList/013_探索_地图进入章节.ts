import { Script } from '@/system/script';
import { IFuncOrigin, IFuncOperatorOrigin, IFuncOperator } from '@/interface/IFunc';

const left = 0;
const center = 1;
const right = 2;

export class Func013 implements IFuncOrigin {
	id = 13;
	name = '探索_地图进入章节';
	desc = '在探索地图界面展开章节面板，滑动到底部后点击目标章节，进入二级界面后选困难并点击探索';
	config = [{
		desc: '',
		config: [{
			name: 'maxSwipes',
			desc: '滑动次数（滑动到底部所需次数）',
			type: 'list',
			data: ['5', '8', '10', '15', '20'],
			default: '10',
		}]
	}];
	operator: IFuncOperatorOrigin[] = [
		{ // 0: 探索章节面板已展开
			desc: '探索章节面板已展开',
			oper: [
				// [0] 滑动起点（列表下方区域，从这里往上划，露出更靠下的章节）
				[center, 1280, 720, 1076, 439, 1233, 537, 0],
				// [1] 滑动终点（列表上方区域，幅度为原来3倍）
				[center, 1280, 720, 1076, 139, 1233, 237, 0],
				// [2] 目标章节点击区域（第二十八章固定坐标）
				[center, 1280, 720, 1061, 459, 1262, 550, 1000],
			]
		},
		{ // 1: 探索章节面板未展开（探索地图界面）
			desc: '探索章节面板未展开',
			oper: [
				// [0] 展开按钮点击区域
				[right, 1280, 720, 1243, 122, 1262, 135, 1000],
			]
		},
		{ // 2: 探索二级界面（困难模式下）
			desc: '探索二级界面_困难',
			oper: [
				// [0] 困难难度选择区域
				[left, 1280, 720, 35, 334, 150, 354, 500],
				// [1] 探索按钮区域
				[center, 1280, 720, 1094, 583, 1171, 654, 1000],
			]
		},
	];

	operatorFunc(thisScript: Script, thisOperator: IFuncOperator[]): boolean {
		const thisconf = thisScript.scheme.config[13];

		// --- 状态 C：二级界面（困难）→ 点击探索按钮 ---
		if (thisScript.oper({
			id: 13,
			name: '探索二级界面_点击探索',
			operator: [{
				desc: thisOperator[2].desc,
				oper: [thisOperator[2].oper[1]],
			}]
		})) {
			thisScript.global.tsChapterSwipeNum = undefined;
			thisScript.global.tsAttackSwhipeNum = undefined;
			return true;
		}

		// --- 状态 B：章节面板已展开 → 滑动到底后点击固定章节坐标 ---
		if (thisScript.oper({
			id: 13,
			name: '探索章节面板已展开_判断',
			operator: [{ desc: thisOperator[0].desc, retest: 500 }]
		})) {
			if (thisScript.global.tsChapterSwipeNum === undefined) {
				thisScript.global.tsChapterSwipeNum = 0;
			}
			const maxSwipes = parseInt(String(thisconf.maxSwipes || '10'), 10);

			if (thisScript.global.tsChapterSwipeNum < maxSwipes) {
				// 还未滑完，继续下滑
				thisScript.myToast(`下滑到底部（${thisScript.global.tsChapterSwipeNum + 1}/${maxSwipes}）`);
				thisScript.regionBezierSwipe(
					thisOperator[0].oper[0], // 起点（下方）
					thisOperator[0].oper[1], // 终点（上方，幅度3倍）
					[600, 1000],
					300
				);
				thisScript.global.tsChapterSwipeNum++;
				return true;
			} else {
				// 已滑到底，点击固定章节坐标
				thisScript.myToast('点击目标章节');
				thisScript.regionClick([thisOperator[0].oper[2]]);
				thisScript.global.tsChapterSwipeNum = undefined;
				return true;
			}
		}

		// --- 状态 A：面板未展开（探索地图界面）→ 点击展开按钮 ---
		if (thisScript.oper({
			id: 13,
			name: '探索地图_点击展开章节面板',
			operator: [{
				desc: thisOperator[1].desc,
				oper: [thisOperator[1].oper[0]],
			}]
		})) {
			thisScript.global.tsChapterSwipeNum = undefined;
			return true;
		}

		return false;
	}
}

export default new Func013();
