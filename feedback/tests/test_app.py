from http import HTTPStatus
from mock import AsyncMock, patch
import json

import pytest

pytestmark = pytest.mark.asyncio


@pytest.fixture(scope="function")
def app(monkeypatch):
    monkeypatch.setenv("COVIBOT_PAPERKEY", "dummy paper key")
    monkeypatch.setenv("COVIBOT_CONV_ID", "abcd1234")

    from mesconseilscovid_feedback.app import app as app_

    with patch("mesconseilscovid_feedback.app.CoviBot.chat") as mock_chat:
        mock_chat.send = AsyncMock()
        yield app_


async def test_post_feedback_without_user_agent(client, app):
    resp = await client.post(
        "/feedback",
        {"kind": "flag", "message": "J’ai rien compris", "page": "introduction",},
    )
    assert resp.status == HTTPStatus.ACCEPTED
    assert json.loads(resp.body) == {
        "message": ":golf: (introduction): J’ai rien compris"
    }
    app.bot.chat.send.assert_called_once_with(
        "abcd1234", ":golf: (introduction): J’ai rien compris"
    )


async def test_post_feedback_with_user_agent(client, app):
    resp = await client.post(
        "/feedback",
        {"kind": "flag", "message": "J’ai rien compris", "page": "introduction",},
        headers={
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 5_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9B179 Safari/7534.48.3",
        },
    )
    assert resp.status == HTTPStatus.ACCEPTED
    assert json.loads(resp.body) == {
        "message": ":golf: (introduction): J’ai rien compris [envoyé depuis iPhone / iOS 5.1 / Mobile Safari 5.1]"
    }
    app.bot.chat.send.assert_called_once_with(
        "abcd1234",
        ":golf: (introduction): J’ai rien compris [envoyé depuis iPhone / iOS 5.1 / Mobile Safari 5.1]",
    )


async def test_bad_request(client, app):
    resp = await client.post("/feedback", {"hello": "world"})
    assert resp.status == HTTPStatus.BAD_REQUEST
    assert json.loads(resp.body) == {"error": "Bad Request"}
