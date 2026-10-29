"""逐文件核对公网版本与本次提交。"""
import argparse
from pathlib import Path
import urllib.request

REQUEST_TIMEOUT_SECONDS = 30


def verify_file(origin, path):
    relative = path.as_posix()
    with urllib.request.urlopen(origin + '/' + relative, timeout=REQUEST_TIMEOUT_SECONDS) as response:
        if response.read() != path.read_bytes():
            raise ValueError(f'线上文件与本次提交不一致：{relative}')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('origin')
    options = parser.parse_args()
    origin = options.origin.rstrip('/')
    files = [Path('index.html'), *sorted(path for path in Path('assets').rglob('*') if path.is_file())]
    for path in files:
        verify_file(origin, path)
    print(f'公网部署核对通过：{len(files)} 个文件内容一致。')


if __name__ == '__main__':
    main()
