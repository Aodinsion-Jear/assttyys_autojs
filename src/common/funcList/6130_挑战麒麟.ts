import { IFuncOrigin, IFuncOperatorOrigin, IFuncOperator } from '@/interface/IFunc';
import { Script } from '@/system/script';
import { OcrResult } from '@/system/Ocr/IOcr';

const left = 0;
const center = 1;
const right = 2;

// operatorFunc 以 call(null) 调用，辅助逻辑放在模块级。
function handlePriorityPage(thisScript: Script, thisOperator: IFuncOperator[]): boolean {
	if (thisScript.oper({ name: '检测_麒麟已被击杀', operator: [thisOperator[3]] })) {
		thisScript.myToast('麒麟已被击杀，点击返回并停止脚本');
		sleep(2000);
		thisScript.stop();
		return true;
	}
	return !!thisScript.oper({ id: 6130, name: '麒麟_未借协战确认继续', operator: [thisOperator[4]] });
}

function isSelectionPage(thisScript: Script, thisOperator: IFuncOperator[]): boolean {
	return !!thisScript.oper({ name: '检测_麒麟星级选择', operator: [{ desc: thisOperator[0].desc }] });
}

function challenge(thisScript: Script, thisOperator: IFuncOperator[]): boolean {
	return !!thisScript.oper({ id: 6130, name: '麒麟_点击挑战', operator: [thisOperator[2]] });
}

function getSelectionRegion(thisScript: Script): number[] {
	const hp = thisScript.helperBridge.getHelper(1280, 720);
	const sp = hp.GetPoint(1025, 329, right);
	const ep = hp.GetPoint(1047, 408, right);
	// GetBitmap 返回的副本用完即释放；尺寸取实际横屏截图，不用 device 的竖屏尺寸。
	const bmp = thisScript.helperBridge.helper.GetBitmap();
	let width: number;
	let height: number;
	try {
		width = bmp.getWidth();
		height = bmp.getHeight();
	} finally {
		bmp.recycle();
	}
	const x1 = Math.floor(sp.x);
	const y1 = Math.floor(sp.y);
	const x2 = Math.ceil(ep.x);
	const y2 = Math.ceil(ep.y);
	if (x1 < 0 || y1 < 0 || x2 > width || y2 > height || x2 <= x1 || y2 <= y1) {
		throw new Error('六星标签 OCR 区域超出截图或尺寸无效');
	}
	// 标签基准宽仅 22，MLKit 要求实际裁剪宽高至少 32 像素。
	const w = Math.max(32, x2 - x1);
	const h = Math.max(32, y2 - y1);
	if (w > width || h > height) throw new Error('截图尺寸不足以识别六星标签');
	const x = Math.max(0, Math.min(width - w, x1 - Math.floor((w - (x2 - x1)) / 2)));
	const y = Math.max(0, Math.min(height - h, y1 - Math.floor((h - (y2 - y1)) / 2)));
	return [x, y, x + w, y + h];
}

function hasSelectionText(results: OcrResult[]): boolean {
	const labels = results.map(item => item.label.replace(/\s/g, ''));
	if (labels.some(label => label.includes('当前选择'))) return true;
	// 兼容竖排被拆成多个文字框；没有有效位置时不猜测字符顺序。
	if (!results.length || results.some(item => !item.points || !item.points.length ||
		item.points.some(point => !Number.isFinite(point.x) || !Number.isFinite(point.y)))) return false;
	const ordered = results.slice().sort((a, b) => {
		return Math.min(...a.points.map(point => point.y)) - Math.min(...b.points.map(point => point.y));
	});
	const text = ordered.map(item => item.label.replace(/\s/g, '')).join('');
	console.log(`6130 六星标签拼接结果: ${text}`);
	return text.includes('当前选择');
}

function selectSixStar(thisScript: Script, thisOperator: IFuncOperator[]): boolean {
	for (let attempt = 1; attempt <= 3; attempt++) {
		thisScript.keepScreen(false);
		if (handlePriorityPage(thisScript, thisOperator)) return true;
		if (!isSelectionPage(thisScript, thisOperator)) {
			if (challenge(thisScript, thisOperator)) return true;
			sleep(500);
			continue;
		}
		thisScript.oper({ id: 6130, name: '麒麟_选择六星', operator: [thisOperator[0]] });
		thisScript.keepScreen(false);
		if (handlePriorityPage(thisScript, thisOperator)) return true;
		if (!isSelectionPage(thisScript, thisOperator)) {
			if (challenge(thisScript, thisOperator)) return true;
			continue;
		}
		let selected = false;
		let ocrError = '';
		try {
			if (!thisScript.getOcrDetector()) throw new Error('OCR 扩展未安装或初始化失败');
			const region = getSelectionRegion(thisScript);
			const results = thisScript.findText('.+', 0, region, '包含') || [];
			console.log(`6130 六星 OCR 第 ${attempt}/3 次，区域: ${region.join(',')}，结果: ${JSON.stringify(results)}`);
			selected = hasSelectionText(results);
		} catch (e) {
			ocrError = String(e);
		}
		if (ocrError) {
			console.error(`6130 六星 OCR 失败: ${ocrError}`);
			thisScript.myToast('六星选择 OCR 不可用或识别异常，停止脚本，请检查 OCR 扩展及日志');
			thisScript.stop();
			return true;
		}
		// findText 会更新截图，在该截图上复核页面，避免把旧识别结果用于新界面。
		if (handlePriorityPage(thisScript, thisOperator)) return true;
		if (!isSelectionPage(thisScript, thisOperator)) {
			if (challenge(thisScript, thisOperator)) return true;
			continue;
		}
		if (selected) {
			thisScript.oper({ id: 6130, name: '麒麟_OCR确认六星后开启', operator: [thisOperator[1]] });
			return true;
		}
	}
	thisScript.myToast('3 次未能确认六星“当前选择”，停止脚本，请检查界面及 OCR 日志');
	thisScript.stop();
	// 不放行同方案后面的 601/507，避免绕过 OCR 直接开启。
	return true;
}

export class Func6130 implements IFuncOrigin {
	id = 6130;
	name = '挑战麒麟';
	desc = '在狩猎战界面选择六星麒麟，OCR确认当前选择后发起挑战（需OCR扩展）';
	operator: IFuncOperatorOrigin[] = [{
		// 0 星级选择界面 → 点击六星麒麟
		desc: [1280, 720, [
			[left, 82, 648, 0xaf7945],
			[left, 75, 667, 0xac7643],
			[right, 1173, 621, 0xe5dac3],
			[right, 1167, 596, 0x482d20],
			[left, 142, 663, 0xd8d8d8],
			[left, 43, 47, 0xf0d691],
			[left, 102, 54, 0x9e6e40],
		]],
		oper: [[right, 1280, 720, 1031, 329, 1145, 435, 1000]]
	}, {
		// 1 仅由六星 OCR 确认成功分支调用，不参与独立界面匹配
		oper: [[right, 1280, 720, 1148, 586, 1219, 669, 1000]]
	}, {
		// 2 挑战麒麟界面 → 点击挑战
		desc: [1280, 720, [
			[left, 39, 33, 0xf3e1a0],
			[left, 56, 39, 0x9f6c3c],
			[left, 112, 33, 0xeedda6],
			[right, 1177, 599, 0xe6dbc5],
			[right, 1077, 662, 0x554838],
			[right, 1065, 662, 0xbaafaf],
			[left, 74, 659, 0xa87540],
		]],
		oper: [[right, 1280, 720, 1136, 586, 1216, 671, 1000]]
	}, {
		// 3 检测麒麟已被击杀 → 点击返回并停止脚本
		desc: [1280, 720, [
			[left, 67, 655, 0xdcb576],
			[left, 143, 661, 0x868686],
			[left, 228, 657, 0xed4b36],
			[left, 296, 655, 0xb73a1a],
			[right, 1177, 599, 0xdcdcdc],
			[right, 1183, 645, 0xd8d8d8],
			[right, 856, 564, 0xbe1010],
		]],
		oper: [[left, 1280, 720, 98, 19, 137, 60, 2000]]
	}, {
		// 4 未借协战式神提示 → 点击确定继续挑战
		desc: [1280, 720, [
			[center, 479, 430, 0xdf6851],
			[center, 476, 445, 0xdf6851],
			[right, 645, 423, 0xcbb59c],
			[right, 713, 421, 0xf3b25e],
			[right, 722, 441, 0xf3b25e],
			[center, 483, 434, 0xdf6851],
			[center, 580, 440, 0xdf6851],
			[right, 709, 436, 0xf3b25e],
		]],
		oper: [[center, 1280, 720, 675, 410, 840, 454, 1000]]
	}];
	operatorFunc(thisScript: Script, thisOperator: IFuncOperator[]): boolean {
		if (handlePriorityPage(thisScript, thisOperator)) return true;
		if (isSelectionPage(thisScript, thisOperator)) return selectSixStar(thisScript, thisOperator);
		return challenge(thisScript, thisOperator);
	}
}

export default new Func6130();
