"""真实临时目录验证发布成功、坏包隔离及 SSH 命令约束。"""
import importlib.util
import io
import json
from pathlib import Path
import tarfile
import tempfile
import unittest

SPEC = importlib.util.spec_from_file_location('publish', Path(__file__).parents[1] / 'deploy/publish.py')
PUBLISH = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(PUBLISH)
REVISION = 'a' * 40


def package(extra=None, revision=REVISION):
    files = {
        'index.html': b'<html>new handbook</html>',
        'assets/release.json': json.dumps({'commit': revision}).encode(),
        'assets/handbook.js': b'const title = "handbook";',
        **(extra or {}),
    }
    output = io.BytesIO()
    with tarfile.open(fileobj=output, mode='w:gz') as archive:
        for name, content in files.items():
            entry = tarfile.TarInfo(name)
            entry.size = len(content)
            archive.addfile(entry, io.BytesIO(content))
    output.seek(0)
    return output


class PublishTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name)
        self.previous = self.root / 'releases/previous'
        self.previous.mkdir(parents=True)
        (self.previous / 'index.html').write_text('previous')
        (self.previous / 'removed.js').write_text('old asset')
        (self.root / 'current').symlink_to(self.previous)

    def assert_previous_preserved(self):
        self.assertEqual((self.root / 'current').resolve(), self.previous)
        self.assertEqual((self.previous / 'index.html').read_text(), 'previous')
        self.assertEqual(list((self.root / 'releases').iterdir()), [self.previous])

    def test_complete_release_replaces_current_and_keeps_history(self):
        PUBLISH.publish(package(), self.root, REVISION)
        current = self.root / 'current'
        self.assertIn('new handbook', (current / 'index.html').read_text())
        self.assertFalse((current / 'removed.js').exists())
        self.assertTrue((self.previous / 'index.html').exists())
        self.assertEqual((current / 'index.html').stat().st_mode & 0o777, 0o644)

    def test_mismatched_commit_does_not_switch(self):
        with self.assertRaisesRegex(ValueError, 'commit'):
            PUBLISH.publish(package(revision='b' * 40), self.root, REVISION)
        self.assert_previous_preserved()

    def test_outside_files_and_path_traversal_are_rejected(self):
        for name in ['../escape', '/tmp/escape', 'assets/../../escape', 'backend/config.py']:
            with self.subTest(name=name), self.assertRaises(ValueError):
                PUBLISH.publish(package({name: b'forbidden'}), self.root, REVISION)
            self.assert_previous_preserved()

    def test_symbolic_links_are_rejected(self):
        output = io.BytesIO()
        with tarfile.open(fileobj=output, mode='w:gz') as archive:
            entry = tarfile.TarInfo('assets/link')
            entry.type = tarfile.SYMTYPE
            entry.linkname = '/etc/passwd'
            archive.addfile(entry)
        output.seek(0)
        with self.assertRaisesRegex(ValueError, '链接'):
            PUBLISH.publish(output, self.root, REVISION)
        self.assert_previous_preserved()

    def test_incomplete_archive_does_not_switch(self):
        with self.assertRaises(tarfile.ReadError):
            PUBLISH.publish(io.BytesIO(b'incomplete upload'), self.root, REVISION)
        self.assert_previous_preserved()

    def test_ssh_accepts_only_publish_with_full_commit(self):
        self.assertEqual(PUBLISH.read_revision('publish ' + REVISION), REVISION)
        for command in ['', 'bash', 'publish main', 'publish ' + REVISION + '; id']:
            with self.subTest(command=command), self.assertRaises(ValueError):
                PUBLISH.read_revision(command)


if __name__ == '__main__':
    unittest.main()
