# CLAUDE.md

阴阳师体验服脚本后端（Auto.js/TypeScript），fork 自 zzliux/assttyys_autojs，由个人维护体服适配。

**完整维护文档在文档仓库 `C:/Users/Administrator/Desktop/DiyAss`**（GitHub: Aodinsion-Jear/Assttyys_code），索引见该仓库 `TYFS_README.md`。本文件只放红线与速查。

## 分支与发布

- `tyfs-custom`：日常开发分支，所有改动提交到这里
- `master`：发布分支，推 `origin/master` 才触发 GitHub Actions 编译上传自有服务器；只推 `tyfs-custom` 不会触发
- 3 个 remote：`origin`（发布用）、`upstream`（原作者，同步用）、`zms`（第三方体服适配参考）

## 红线

1. 每次发布前在 `src/common/version.ts` 末尾追加 `YYYYMMDD_tyfs_序号` 版本记录，否则手机端不弹更新
2. `assttyys_ng.zip` 是构建产物，不要提交；不要 `git add .`，逐个 add 明确文件
3. 同步上游：`git merge upstream/master`，四步流程见 `DiyAss/docs/workflows.md` §5.4；合并后必查 `DiyAss/docs/custom-features.md` §4.14 清单（思金神 key、026 灯笼坐标、029 突破分支等静默失效点）
4. 同步时 `version.ts` 保留双方记录（上游在前、tyfs 在最后）；`package.json` + 两个锁文件必须保持 `github:Aodinsion-Jear/assttyys_ui#main` 指向
5. 推送等影响远程的操作先向用户确认

## 架构速查

- 核心：`src/system/script.ts` 的 `Script` 单例；功能在 `src/common/funcList/NNN_功能名.ts`（前缀数字即 ID，`require.context` 自动注册）
- 方案：`src/common/schemeList.ts`，新 func 不被方案 list 引用就不会执行
- 坐标格式 `[对齐, 1280, 720, x1, y1, x2, y2, 等待ms]`，见 `DiyAss/docs/coordinate-format.md`
- 庭院皮肤适配走 `src/common/courtSkins/` 数据驱动框架，不改 func（见 `DiyAss/COURT_SKIN_GUIDE.md`）
- 前端 UI 打进热更新包本地加载（`src/system/index.ts` 用 `file://dist/index.html`），前端任何改动必须重新发后端版本才生效

## 构建

```bash
npm run build   # 输出 assttyys_ng.zip（本地产物，不提交）
npm run dev     # watch 模式
```

## 体服自定义文档

`DiyAss/docs/custom-changes.md`（§4.0 清单 + 逐项说明）、`DiyAss/docs/custom-features.md`（新增功能、已知缺陷 §4.13、同步检查清单 §4.14、RapidOcr §4.15）。
