"""
Start local development server
"""
import argparse
import logging
from contextlib import suppress
from http.server import HTTPServer, SimpleHTTPRequestHandler
from ssl import wrap_socket

from livereload.server import LogFormatter, Server, shell
from watchdog.observers import Observer
from watchdog.tricks import ShellCommandTrick


ROOT_DIR = "dist/"

WATCHED_PATHS = [
    "contenus/**/[!README]*.md",
    "src/scripts/**/*.js",
    "src/scripts/*.js",
    "src/style.css",
    "templates/*.html",
    "static/version.json",
]

COMMAND = "make build"


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--address", default="0.0.0.0")
    parser.add_argument("--port", type=int, default=None)
    parser.add_argument("--ssl", action="store_true")
    parser.add_argument("--ssl-cert", default="cert.pem")
    parser.add_argument("--ssl-key", default="key.pem")
    parser.add_argument("--watch", action="store_true")
    return parser.parse_args()


class CustomServer(Server):
    """
    Custom server with logger that decodes bytes in logs
    """

    def _setup_logging(self):
        super()._setup_logging()
        logger = logging.getLogger("livereload")
        formatter = self.BytesFormatter()
        for handler in logger.handlers:
            handler.setFormatter(formatter)

    class BytesFormatter(LogFormatter):
        def format(self, record):
            if isinstance(record.msg, bytes):
                with suppress(UnicodeDecodeError):
                    record.msg = record.msg.decode("utf-8")
            return super().format(record)


def serve(address, port, watch):
    server = CustomServer()
    if watch:
        for path in WATCHED_PATHS:
            server.watch(path, shell(COMMAND))
    server.serve(host=address, port=port, root=ROOT_DIR)


def serve_ssl(address, port, ssl_cert, ssl_key, watch):
    class MyHTTPRequestHandler(SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=ROOT_DIR, **kwargs)

    class MyFileSystemEventHandler(ShellCommandTrick):
        def __init__(self):
            super().__init__(
                shell_command=COMMAND,
                patterns=WATCHED_PATHS,
                wait_for_process=True,
                drop_during_process=True,
            )

        def on_any_event(self, event):
            print(event)
            super().on_any_event(event)

    if watch:
        observer = Observer()
        handler = MyFileSystemEventHandler()
        for path in ["src", "contenus"]:
            observer.schedule(handler, path, recursive=True)
        observer.start()

    httpd = HTTPServer((address, port), MyHTTPRequestHandler)
    httpd.socket = wrap_socket(
        httpd.socket, certfile=ssl_cert, keyfile=ssl_key, server_side=True
    )
    print(f"Listening on https://{address}:{port}/")
    httpd.serve_forever()


if __name__ == "__main__":
    args = parse_args()
    if args.ssl:
        serve_ssl(
            address=args.address,
            port=args.port or 8443,
            watch=args.watch,
            ssl_cert=args.ssl_cert,
            ssl_key=args.ssl_key,
        )
    else:
        serve(address=args.address, port=args.port or 5500, watch=args.watch)
