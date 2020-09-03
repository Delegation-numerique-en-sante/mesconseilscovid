import json
from http import HTTPStatus

import pytest

from app import app as app_

pytestmark = pytest.mark.asyncio


@pytest.fixture(scope="function")
def app():
    return app_


async def test_post_feedback(client, app):
    resp = await client.post(
        "/feedback",
        {"feedback": "flag", "message": "J’ai rien compris", "page": "introduction",},
    )
    assert resp.status == HTTPStatus.OK
    assert resp.body.decode("utf-8") == (
        'Received "flag" feedback'
        ' for page "introduction"'
        ' with message "J’ai rien compris"'
    )
