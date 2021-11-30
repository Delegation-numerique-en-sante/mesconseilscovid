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
        {
            "kind": "flag",
            "message": "J’ai *rien* compris",
            "page": "introduction",
        },
    )
    assert resp.status == HTTPStatus.ACCEPTED
    assert json.loads(resp.body) == {
        "message": ":golf: *introduction*\n>J’ai \\*rien\\* compris\nhttps://mesconseilscovid.sante.gouv.fr/#introduction"
    }
    app.bot.chat.send.assert_called_once_with(
        "abcd1234",
        ":golf: *introduction*\n>J’ai \\*rien\\* compris\nhttps://mesconseilscovid.sante.gouv.fr/#introduction",
    )


async def test_post_feedback_with_user_agent(client, app):
    resp = await client.post(
        "/feedback",
        {
            "kind": "flag",
            "message": "J’ai *rien* compris\ndu tout",
            "page": "introduction",
        },
        headers={
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 5_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9B179 Safari/7534.48.3",
        },
    )
    assert resp.status == HTTPStatus.ACCEPTED
    assert json.loads(resp.body) == {
        "message": ":golf: *introduction*\n>J’ai \\*rien\\* compris\n>du tout\n>_(Envoyé depuis iPhone / iOS 5.1 / Mobile Safari 5.1)_\nhttps://mesconseilscovid.sante.gouv.fr/#introduction"
    }
    app.bot.chat.send.assert_called_once_with(
        "abcd1234",
        ":golf: *introduction*\n>J’ai \\*rien\\* compris\n>du tout\n>_(Envoyé depuis iPhone / iOS 5.1 / Mobile Safari 5.1)_\nhttps://mesconseilscovid.sante.gouv.fr/#introduction",
    )


async def test_post_question_feedback(client, app):
    resp = await client.post(
        "/feedback",
        {
            "kind": "bof",
            "message": "Bla _bla_ bla",
            "page": "cas-contact-a-risque.html",
            "question": "Dois-je m’isoler",
        },
        headers={
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 5_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9B179 Safari/7534.48.3",
        },
    )
    assert resp.status == HTTPStatus.ACCEPTED
    assert json.loads(resp.body) == {
        "message": ":neutral_face: *Dois-je m’isoler\xa0?*\n>Bla \\_bla\\_ bla\n>_(Envoyé depuis iPhone / iOS 5.1 / Mobile Safari 5.1)_\nhttps://mesconseilscovid.sante.gouv.fr/cas-contact-a-risque.html#dois-je-m-isoler"
    }
    app.bot.chat.send.assert_called_once_with(
        "abcd1234",
        ":neutral_face: *Dois-je m’isoler\xa0?*\n>Bla \\_bla\\_ bla\n>_(Envoyé depuis iPhone / iOS 5.1 / Mobile Safari 5.1)_\nhttps://mesconseilscovid.sante.gouv.fr/cas-contact-a-risque.html#dois-je-m-isoler",
    )


async def test_bad_request(client, app):
    resp = await client.post("/feedback", {"hello": "world"})
    assert resp.status == HTTPStatus.BAD_REQUEST
    assert json.loads(resp.body) == {"error": "Bad Request"}
