"""生成 GitHub Pages 使用的纯静态手册发布目录。"""
import argparse
import json
from pathlib import Path
import re
import shutil

SOURCE_ROOT = Path(__file__).resolve().parents[1]
ANALYTICS_SCRIPT = '  <script defer src="assets/handbook-analytics.js"></script>\n'


def package_pages(output, revision):
    if not re.fullmatch(r'[0-9a-f]{40}', revision):
        raise ValueError('发布版本必须是完整的 Git commit SHA')
    html = (SOURCE_ROOT / 'index.html').read_text(encoding='utf-8')
    if html.count(ANALYTICS_SCRIPT) != 1:
        raise ValueError('页面统计脚本入口已变更，请同步更新 GitHub Pages 打包配置')
    output.mkdir(parents=True, exist_ok=False)
    # Pages 不运行服务端接口，发布时明确移除统计模块及其页面入口。
    shutil.copytree(SOURCE_ROOT / 'assets', output / 'assets',
                    ignore=shutil.ignore_patterns('handbook-analytics.js', 'release.json'))
    (output / 'index.html').write_text(html.replace(ANALYTICS_SCRIPT, ''), encoding='utf-8')
    (output / 'assets/release.json').write_text(
        json.dumps({'commit': revision}) + '\n', encoding='utf-8')
    print(f'GitHub Pages 静态发布包已生成，版本：{revision}')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('output', type=Path)
    parser.add_argument('revision')
    options = parser.parse_args()
    package_pages(options.output, options.revision)


if __name__ == '__main__':
    main()
