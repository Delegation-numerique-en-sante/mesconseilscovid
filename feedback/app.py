#!/usr/bin/env python3
import logging
import os
from http import HTTPStatus

from pykeybasebot import Bot
from roll import Roll
from roll.extensions import cors, options, simple_server, traceback

logger = logging.getLogger(__name__)

COVIDOUDOU_GENERAL = "00001ec246802cf2e3efb0e00ac6c7733313ef24d49f6b835877011974dde0c5"

try:
    paperkey = os.environ["KEYBASE_PAPERKEY"]
except KeyError:
    print("You must set the KEYBASE_PAPERKEY env var.")
    exit(1)


class Handler:
    async def __call__(self, bot, event):
        return


bot = Bot(username="covibot", paperkey=paperkey, handler=Handler())

app = Roll()


@app.listen("error")
async def json_error_response(request, response, error):
    if isinstance(error.message, str):
        error.message = {"error": error.message}
    elif isinstance(error.message, bytes):
        error.message = {"error": error.message.decode("utf-8")}
    response.json = error.message
    if error.status != HTTPStatus.NOT_FOUND:
        logger.debug(
            f"HttpError: status={error.status}, message={response.body}, "
            f"request={request.body.decode('utf-8')}, "
            f"url={request.url.decode('utf-8')}"
        )


@app.route("/feedback", methods=["POST"])
async def feedback(request, response):
    payload = request.json
    kind_emoji = {"flag": ":golf:", "positif": ":+1:", "negatif": ":-1:"}
    message = f'{kind_emoji[payload["kind"]]} ({payload["page"]}): {payload["message"]}'
    if request.host.startswith("127.0.0.1"):
        print(message)
    else:
        await bot.chat.send(COVIDOUDOU_GENERAL, message)
    response.body = {"message": message}
    response.status = HTTPStatus.ACCEPTED


if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    cors(app, origin="*", headers=["content-type"])
    options(app)
    traceback(app)
    simple_server(app, port=5678)
