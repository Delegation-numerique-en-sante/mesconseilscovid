"""
Start local development server
"""
import argparse
import logging
import shlex
import subprocess
import webbrowser
from contextlib import suppress
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from ssl import wrap_socket

import tornado.web
from livereload.server import LiveScriptContainer, LogFormatter, Server
from watchdog.observers import Observer
from watchdog.tricks import ShellCommandTrick

import build

PARCEL_CLI = "./node_modules/.bin/parcel"
BUNDLER_COMMAND = f"{PARCEL_CLI} watch src/*.html"

ROOT_DIR = "dist/"

PATHS_TO_WATCH_FOR_BUILD = [
    "contenus/**/[!README]*.md",
    "static/[!sitemap.xml]*",
    "templates/*.html",
]
PATHS_TO_WATCH_FOR_RELOAD = [
    "dist/*",
]


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--address", default="0.0.0.0")
    parser.add_argument("--port", type=int, default=None)
    parser.add_argument("--ssl", action="store_true")
    parser.add_argument("--ssl-cert", default="cert.pem")
    parser.add_argument("--ssl-key", default="key.pem")
    parser.add_argument("--open", action="store_true")
    parser.add_argument("--watch", action="store_true")
    return parser.parse_args()


def build_html():
    build.index()
    build.thematiques()
    build.sitemap()


def serve(address, port, open_, watch, ssl, ssl_cert, ssl_key):
    if ssl:
        return serve_https(
            address=args.address,
            port=args.port or 8443,
            open_=args.open,
            watch=args.watch,
            ssl_cert=args.ssl_cert,
            ssl_key=args.ssl_key,
        )
    else:
        return serve_http(
            address=args.address,
            port=args.port or 5500,
            open_=args.open,
            watch=args.watch,
        )


class CustomServer(Server):
    """
    Custom server with logger that decodes bytes in logs
    """

    def __init__(self, app=None, watcher=None):
        super().__init__(app=app, watcher=watcher)
        self.SFH = self.SPAHandler

    class SPAHandler(tornado.web.StaticFileHandler):
        """
        Sert le fichier index.html au lieu d’une 404 pour la Single-Page App
        """
        def validate_absolute_path(self, root, absolute_path):
            try:
                return super().validate_absolute_path(root, absolute_path)
            except tornado.web.HTTPError as exc:
                if exc.status_code == 404 and self.default_filename is not None:
                    absolute_path = self.get_absolute_path(self.root, self.default_filename)
                    return super().validate_absolute_path(root, absolute_path)
                raise exc

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


def serve_http(address, port, open_, watch):
    server = CustomServer()
    if watch:
        for path in PATHS_TO_WATCH_FOR_BUILD:
            server.watch(path, build_html, delay=5)
        for path in PATHS_TO_WATCH_FOR_RELOAD:
            server.watch(path)
    server.serve(
        host=address,
        port=port,
        root=ROOT_DIR,
        open_url_delay=0.1 if open_ else False,
    )


def serve_https(address, port, open_, watch, ssl_cert, ssl_key):
    class MyHTTPRequestHandler(SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=ROOT_DIR, **kwargs)

        def log_request(self, *args, **kwargs):
            pass

    class MyFileSystemEventHandler(ShellCommandTrick):
        def __init__(self):
            super().__init__(
                shell_command="python3 build.py index thematiques sitemap",
                wait_for_process=True,
                drop_during_process=True,
            )

        def on_any_event(self, event):
            if event.event_type == "modified" and not event.is_directory:
                super().on_any_event(event)

    if watch:
        observer = Observer()
        handler = MyFileSystemEventHandler()
        for pattern in PATHS_TO_WATCH_FOR_BUILD:
            directory = Path(pattern).parts[0]
            observer.schedule(handler, directory, recursive=True)
        observer.start()

    url = f"https://{address}:{port}/"
    print(f"Listening on {url}")

    if open_:
        webbrowser.open(url)

    logging.getLogger()
    httpd = HTTPServer((address, port), MyHTTPRequestHandler)
    httpd.socket = wrap_socket(
        httpd.socket, certfile=ssl_cert, keyfile=ssl_key, server_side=True
    )
    httpd.serve_forever()


if __name__ == "__main__":
    args = parse_args()
    bundler = subprocess.Popen(shlex.split(BUNDLER_COMMAND))
    serve(
        address=args.address,
        port=args.port,
        open_=args.open,
        watch=args.watch,
        ssl=args.ssl,
        ssl_cert=args.ssl_cert,
        ssl_key=args.ssl_key,
    )
