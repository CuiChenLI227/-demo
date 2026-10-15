#!/usr/bin/env python3
"""Run the bundled demo locally using only Python's standard library."""
import argparse
import errno
import functools
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import webbrowser

ROOT = Path(__file__).resolve().parent / "dist"


def main():
    parser = argparse.ArgumentParser(description="Qwen Create local demo")
    parser.add_argument("--port", type=int, default=8767)
    parser.add_argument("--open", action="store_true", help="Open the browser")
    args = parser.parse_args()
    if not (1 <= args.port <= 65535):
        parser.error("Port must be between 1 and 65535.")
    if not (ROOT / "index.html").is_file():
        parser.error("Missing dist/index.html. Extract the entire ZIP first.")
    handler = functools.partial(SimpleHTTPRequestHandler, directory=str(ROOT))
    server = None
    for port in range(args.port, min(args.port + 20, 65536)):
        try:
            server = ThreadingHTTPServer(("127.0.0.1", port), handler)
            break
        except OSError as exc:
            if exc.errno != errno.EADDRINUSE and getattr(exc, "winerror", None) != 10048:
                raise
    if server is None:
        parser.error("Ports are occupied. Try --port 9000.")
    url = "http://127.0.0.1:{}/".format(server.server_port)
    print("Qwen Create demo: " + url, flush=True)
    print("Keep this terminal running. Press Ctrl+C to stop.", flush=True)
    if args.open:
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
