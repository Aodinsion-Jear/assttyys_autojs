import { Script } from '@/system/script';
import { IFuncOrigin, IFuncOperatorOrigin, IFuncOperator } from '@/interface/IFunc';

const left = 0; // eslint-disable-line @typescript-eslint/no-unused-vars
const center = 1;
const right = 2;

export class Func013 implements IFuncOrigin {
	id = 13;
	name = '探索_地图进入章节';
	desc = '在探索地图界面展开章节面板，滑动到底部后点击目标章节，进入二级界面后按配置选难度并点击探索';
	config = [{
		desc: '',
		config: [{
			name: 'difficulty',
			desc: '挑战难度',
			type: 'list',
			data: ['普通', '困难'],
			default: '困难',
		}, {
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
				// [0] 滑动起点（列表下方区域）
				[center, 1280, 720, 1076, 439, 1233, 537, 0],
				// [1] 滑动终点（列表上方区域，幅度3倍）
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
		{ // 2: 探索二级界面_普通难度状态
			desc: '探索二级界面_普通',
			oper: [
				// [0] 点击切换到困难难度
				[center, 1280, 720, 22, 326, 173, 358, 1000],
				// [1] 探索按钮（普通状态下直接打）
				[center, 1280, 720, 994, 581, 1087, 678, 1000],
			]
		},
		{ // 3: 探索二级界面_困难难度状态
			desc: '探索二级界面_困难',
			oper: [
				// [0] 探索按钮
				[center, 1280, 720, 1094, 583, 1171, 654, 1000],
			]
		},
	];

	operatorFunc(thisScript: Script, thisOperator: IFuncOperator[]): boolean {
		const thisconf = thisScript.scheme.config[13];
		const difficulty = String(thisconf.difficulty || '困难');

		// --- 状态 C：二级界面_困难 → 点击探索 ---
		if (thisScript.oper({
			id: 13,
			name: '探索二级界面_困难_点击探索',
			operator: [{
				desc: thisOperator[3].desc,
				oper: [thisOperator[3].oper[0]],
			}]
		})) {
			thisScript.global.tsChapterSwipeNum = undefined;
			thisScript.global.tsAttackSwhipeNum = undefined;
			return true;
		}

		// --- 状态 C：二级界面_普通 → 按配置决定行为 ---
		if (thisScript.oper({
			id: 13,
			name: '探索二级界面_普通_判断',
			operator: [{ desc: thisOperator[2].desc, retest: 500 }]
		})) {
			thisScript.global.tsChapterSwipeNum = undefined;
			thisScript.global.tsAttackSwhipeNum = undefined;
			if (difficulty === '困难') {
				// 点击切换到困难
				thisScript.oper({
					id: 13,
					name: '探索二级界面_点击切换困难',
					operator: [{ oper: [thisOperator[2].oper[0]] }]
				});
			} else {
				// 直接点探索（普通）
				thisScript.oper({
					id: 13,
					name: '探索二级界面_普通_点击探索',
					operator: [{ oper: [thisOperator[2].oper[1]] }]
				});
			}
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
				thisScript.myToast(`下滑到底部（${thisScript.global.tsChapterSwipeNum + 1}/${maxSwipes}）`);
				thisScript.regionBezierSwipe(
					thisOperator[0].oper[0],
					thisOperator[0].oper[1],
					[600, 1000],
					300
				);
				thisScript.global.tsChapterSwipeNum++;
				return true;
			} else {
				thisScript.myToast('点击目标章节');
				thisScript.regionClick([thisOperator[0].oper[2]]);
				thisScript.global.tsChapterSwipeNum = undefined;
				return true;
			}
		}

		// --- 状态 A：面板未展开 → 点击展开按钮 ---
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
