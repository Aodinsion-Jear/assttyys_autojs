import { nlpSimilarity } from '@/common/toolAuto';
import drawFloaty from '../drawFloaty';
import { IOcr, IOcrDetector, OcrResult } from './IOcr';

/**
 * RapidOcr：离线 OCR 扩展（onnxruntime + PP-OCRv5 mobile 模型）。
 * 以 Auto.js 插件 APK 形式分发（包名 com.tyys.rapidocr，与 MLKit 插件同模式），
 * 用户按 CPU 架构下载安装 APK 后，脚本通过 $plugins.load 加载。
 * 插件工程见 C:/Users/Administrator/rapidocr_plugin，构建产物为按 ABI 分包的 APK。
 */
class RapidOcrDetector implements IOcrDetector {
	// IOcrDetector 接口要求的占位字段，与 plugin 指向同一对象
	instance = null;
	// $plugins.load 返回的插件 JS 包装对象（插件 assets/plugin-rapidocr/index.js 导出）
	plugin = null;
	initResult: boolean = false;

	constructor(plugin) {
		this.plugin = plugin;
		this.instance = plugin;
		this.initResult = plugin.init();
		if (!this.initResult) {
			console.error(`RapidOcr init 失败: ${plugin.getLastError()}`);
		}
		events.on('exit', () => {
			this.destroy(); // 释放 session，否则下次无法 init
		});
	}

	loadImage(bitmap) {
		if (this.initResult === true) {
			const result = this.plugin.ocr(bitmap);
			return JSON.parse(result);
		} else {
			return null;
		}
	}

	destroy() {
		if (this.plugin) {
			this.plugin.destroy();
		}
	}
}

export class RapidOcr implements IOcr {
	detector: RapidOcrDetector;
	typeName: string = 'RapidOcr';

	static packageName: string = 'com.tyys.rapidocr';

	// 插件 APK versionCode 最低要求（2 起为插件模式，1 是 zip 时代的调试包）
	static minPluginVersion: number = 2;

	// 下载地址：rapidocr_plugin_<abi>.apk 需手动上传到服务器
	static get downloadBaseUrl(): string {
		return 'https://asttyys.gzlyyds.cn/assttyys';
	}

	/**
	 * 设备首选 ABI（SUPPORTED_ABIS 按优先级排列），映射到分包 APK 文件名
	 */
	static get deviceAbi(): string {
		const supported = android.os.Build.SUPPORTED_ABIS as string[];
		for (const abi of ['arm64-v8a', 'armeabi-v7a', 'x86_64']) {
			if (supported.includes(abi)) {
				return abi;
			}
		}
		return supported[0] || 'arm64-v8a';
	}

	/**
	 * 获取ocr是否安装
	 */
	isInstalled(): boolean {
		try {
			const plg = $plugins.load(RapidOcr.packageName);
			const ver = plg.getPluginVersion();
			if (ver < RapidOcr.minPluginVersion) {
				console.error(`RapidOcr 插件版本过低: ${ver}，请安装新版插件`);
				return false;
			}
		} catch (e) {
			console.error(e);
			return false;
		}
		return true;
	}

	/**
	 * 安装：从服务器下载对应架构的插件 APK 并拉起系统安装器（约 30MB）。
	 * 与 MlkitOcr 一致：安装由用户在系统安装器中手动完成，
	 * 完成后重新打开开关，isInstalled() 通过即为成功。
	 */
	install(option) {
		// 已安装直接成功
		if (this.isInstalled()) {
			option.successCallback();
			return;
		}
		const abi = RapidOcr.deviceAbi;
		dialogs.confirm('提示', `大约消耗30Mb，是否下载OCR扩展（RapidOcr，${abi}）？下载后请手动安装，装完重新打开本开关。`, function (cr) {
			if (cr) {
				threads.start(function () {
					try {
						toastLog('下载中，请稍后...');
						const url = `${RapidOcr.downloadBaseUrl}/rapidocr_plugin_${abi}.apk`;
						const apkPath = context.getExternalFilesDir(null).getAbsolutePath() + `/rapidocr_plugin_${abi}.apk`;
						const r = http.get(url);
						// @ts-expect-error d.ts文件问题
						if (r.statusCode !== 200) {
							toastLog('下载失败');
							option.failCallback();
							return;
						}
						// @ts-expect-error d.ts文件问题
						files.writeBytes(apkPath, r.body.bytes());
						toastLog('下载完成，请安装');
						try {
							app.viewFile(apkPath);
						} catch (e) {
							console.error(e);
							$app.openUrl(`${RapidOcr.downloadBaseUrl}/rapidocr_plugin_${abi}.apk`);
						}
					} catch (e) {
						toast(e);
						console.error($debug.getStackTrace(e));
					}
					// 安装动作由用户在系统安装器中完成，本次开关按失败处理，装完重开即可
					option.failCallback();
				});
			} else {
				option.failCallback();
			}
		});
	}

	prepare() {
		const plg = $plugins.load(RapidOcr.packageName);
		this.detector = new RapidOcrDetector(plg);
		return this.detector;
	}

	findTextByOcr(detector: RapidOcrDetector, getBmpFunc: Function, text: string, timeout: number, region: number[], textMatchMode: string) {
		const startTime = new Date().getTime();
		// eslint-disable-next-line no-constant-condition
		while (true) {
			console.time('ocr.detect');
			let bmp = getBmpFunc();
			if (region) {
				const newBmp = android.graphics.Bitmap.createBitmap(bmp, region[0], region[1], region[2] - region[0], region[3] - region[1]);
				bmp.recycle();
				bmp = newBmp;
			}
			const rs = detector.loadImage(bmp);
			bmp.recycle()
			console.timeEnd('ocr.detect');

			if (rs == null) {
				return [];
			}

			if (region) {
				rs.forEach(item => {
					item.points.forEach(point => {
						point.x += region[0];
						point.y += region[1];
					})
				});
			}

			const res = this.findTextByOcrResult(text, rs, textMatchMode);

			if (res.length > 0) {
				console.log('识别结果', JSON.stringify(rs));
				return res;
			}
			console.log(`RapidOcr 区域识别无匹配（共 ${rs.length} 条原始结果）`, JSON.stringify(rs));
			if (new Date().getTime() - startTime > timeout) {
				return [];
			}
			// 循环延时作为sleep，防止一直在执行ocr导致cpu占用过高，与findTextWithCompareColor的做法保持一致
			sleep(200);
		}
	}

	findText(getBmpFunc: Function, text: string, timeout: number, region: number[], textMatchMode: string): OcrResult[] {
		return this.findTextByOcr(this.detector, getBmpFunc, text, timeout, region, textMatchMode);
	}

	findTextByOcrResult(text: string, ocrResult: OcrResult[], textMatchMode: string, similarityRatio?: number): OcrResult[] {
		let res = [];
		let toDraw = [];
		if (textMatchMode === '包含') {
			const reg = new RegExp(text);
			res = ocrResult.filter(item => reg.test(item.label));
			toDraw = ocrResult.map(item => ({
				region: [item.points[0].x, item.points[0].y, item.points[2].x, item.points[2].y],
				color: reg.test(item.label) ? 'green' : 'red',
				text: item.label + ':' + item.confidence
			}));
		} else /* if (textMatchMode === '模糊') */{
			res = ocrResult.filter(item => {
				item.similar = nlpSimilarity(item.label, text);
				return (item.similar as number) >= (similarityRatio || .7)
			});
			res.sort((a, b) => (b.similar || 0) - (a.similar || 0));
			toDraw = ocrResult.map(item => ({
				region: [item.points[0].x, item.points[0].y, item.points[2].x, item.points[2].y],
				color: item.similar as number >= (similarityRatio || .7) ? 'green' : 'red',
				text: item.label + ':' + item.confidence
			}));
		}
		// 开了绘制有可能绘制内容也被ocr给识别了
		if (drawFloaty.instacne) {
			drawFloaty.draw(toDraw, 200);
		}
		return res;
	}
}

export const rapidOcr = new RapidOcr();
