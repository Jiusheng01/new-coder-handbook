"""接收 CI 静态包，完整校验后原子切换 Nginx 的 current 链接。"""
import argparse
import fcntl
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import sys
import tarfile
import tempfile
import uuid


def read_revision(command):
    match = re.fullmatch(r'publish ([0-9a-f]{40})', command)
    if not match:
        raise ValueError('SSH 命令必须为 publish <40 位 Git commit>')
    return match.group(1)


def validate_members(archive):
    members = archive.getmembers()
    names = set()
    for member in members:
        path = PurePosixPath(member.name)
        if path.is_absolute() or '..' in path.parts:
            raise ValueError('发布包包含越界路径')
        if not path.parts or path.parts[0] not in ('index.html', 'assets'):
            raise ValueError('发布包只能包含 index.html 与 assets/')
        if not (member.isfile() or member.isdir()):
            raise ValueError('发布包不允许链接或特殊文件')
        if member.name in names:
            raise ValueError('发布包包含重复路径')
        names.add(member.name)
    return members


def unpack_release(stream, target, revision):
    # 先完整接收，避免网络中断导致 current 指向半份文件。
    with tempfile.TemporaryFile() as package:
        shutil.copyfileobj(stream, package)
        package.seek(0)
        with tarfile.open(fileobj=package, mode='r:gz') as archive:
            members = validate_members(archive)
            archive.extractall(target, members=members, filter='data')
    if not (target / 'index.html').is_file():
        raise ValueError('发布包缺少 index.html')
    manifest = json.loads((target / 'assets/release.json').read_text())
    if manifest != {'commit': revision}:
        raise ValueError('发布包 commit 与 SSH 发布命令不一致')
    for path in target.rglob('*'):
        path.chmod(0o755 if path.is_dir() else 0o644)
    target.chmod(0o755)


def publish(stream, site_root, revision):
    releases = site_root / 'releases'
    releases.mkdir(exist_ok=True)
    with (site_root / '.publish.lock').open('a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        target = Path(tempfile.mkdtemp(prefix=revision + '-', dir=releases))
        link = site_root / ('.current-' + uuid.uuid4().hex)
        try:
            unpack_release(stream, target, revision)
            link.symlink_to(target)
            os.replace(link, site_root / 'current')
        except BaseException:
            link.unlink(missing_ok=True)
            shutil.rmtree(target)
            raise
    print(f'手册已发布：{revision} → {target.name}')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--site-root', type=Path, required=True)
    options = parser.parse_args()
    revision = read_revision(os.environ.get('SSH_ORIGINAL_COMMAND', ''))
    publish(sys.stdin.buffer, options.site_root, revision)


if __name__ == '__main__':
    main()
