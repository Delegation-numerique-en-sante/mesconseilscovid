from pathlib import Path


def each_file_from(source_dir, pattern="*", exclude=None):
    """Walk across the `source_dir` and return the md file paths."""
    for path in _each_path_from(source_dir, pattern=pattern, exclude=exclude):
        if path.is_file():
            yield path


def each_folder_from(source_dir, exclude=None):
    """Walk across the `source_dir` and return the folder paths."""
    for path in _each_path_from(source_dir, exclude=exclude):
        if path.is_dir():
            yield path


def _each_path_from(source_dir, pattern="*", exclude=None):
    for path in sorted(Path(source_dir).glob(pattern)):
        if exclude is not None and path.name in exclude:
            continue
        yield path
