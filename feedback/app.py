#!/usr/bin/env python3
import logging
import os
from http import HTTPStatus

from pykeybasebot import Bot
from roll import HttpError, Roll
from roll.extensions import cors, options, simple_server, traceback

logger = logging.getLogger(__name__)


class CoviBot(Bot):
    """
    Minimal Keybase bot that can send messages to a channel
    """

    def __init__(self, paperkey, channel):
        super().__init__(
            username="covibot", paperkey=paperkey, handler=CoviBot.Handler()
        )
        self.channel = channel

    class Handler:
        async def __call__(self, *args):
            return  # do nothing

    async def send_message(self, message):
        await self.chat.send(self.channel, message)


class FeedbackApp(Roll):
    """
    Minimal async web app that relays feedback messages to Keybase
    """

    def __init__(self):
        super().__init__()
        cors(self, origin="*", headers=["content-type"])
        options(self)
        traceback(self)
        self.bot = self.create_bot()

    def create_bot(self):
        try:
            paperkey = os.environ["COVIBOT_PAPERKEY"]
        except KeyError:
            print("You must set the COVIBOT_PAPERKEY env var.")
            exit(1)
        try:
            conv_id = os.environ["COVIBOT_CONV_ID"]
        except KeyError:
            print("You must set the COVIBOT_CONV_ID env var.")
            exit(1)
        return CoviBot(paperkey=paperkey, channel=conv_id)


app = FeedbackApp()


@app.route("/feedback")
class FeedbackView:

    KIND_EMOJI = {"flag": ":golf:", "positif": ":+1:", "negatif": ":-1:"}

    async def on_post(self, request, response):
        payload = request.json
        try:
            kind = payload["kind"]
            page = payload["page"]
            message = payload["message"]
        except KeyError:
            raise HttpError(HTTPStatus.BAD_REQUEST)

        message = f"{self.KIND_EMOJI[kind]} ({page}): {message}"

        if request.host.startswith("127.0.0.1"):
            print(message)
        else:
            await request.app.bot.send_message(message)

        response.status = HTTPStatus.ACCEPTED
        response.json = {"message": message}


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


if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    simple_server(app, port=5678)
