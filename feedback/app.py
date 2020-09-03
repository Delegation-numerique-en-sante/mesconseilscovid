#!/usr/bin/env python3
import asyncio
import logging
import os

from pykeybasebot import Bot
from roll import Roll
from roll.extensions import simple_server, traceback

COVIDOUDOU_GENERAL = "00001ec246802cf2e3efb0e00ac6c7733313ef24d49f6b835877011974dde0c5"


class Handler:
    async def __call__(self, bot, event):
        return


bot = Bot(
    username="covibot", paperkey=os.environ["KEYBASE_PAPERKEY"], handler=Handler()
)

app = Roll()


@app.route("/feedback", methods=["POST"])
async def feedback(request, response):
    payload = request.json
    message = (
        f'Received "{payload["feedback"]}" feedback'
        f' for page "{payload["page"]}"'
        f' with message "{payload["message"]}"'
    )
    await bot.chat.send(COVIDOUDOU_GENERAL, message)


if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    traceback(app)
    simple_server(app)
