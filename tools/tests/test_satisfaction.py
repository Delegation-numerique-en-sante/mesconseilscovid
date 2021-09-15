from datetime import date


def test_separe_question_et_reponse():
    from satisfaction import FeedbackQuestions

    results = FeedbackQuestions._separe_question_et_reponse(
        [
            {
                "reponse": "Est-ce que je dois m’isoler\u202f? : oui",
                "visitors": 50,
            },
            {
                "reponse": "Est-ce que je dois m’isoler\u202f? : bof",
                "visitors": 20,
            },
            {
                "reponse": "Est-ce que je dois m’isoler\u202f? : non",
                "visitors": 10,
            },
        ]
    )
    assert list(results) == [
        ("Est-ce que je dois m’isoler\u202f?", "oui", 50),
        ("Est-ce que je dois m’isoler\u202f?", "bof", 20),
        ("Est-ce que je dois m’isoler\u202f?", "non", 10),
    ]


def test_regroupe_par_question():
    from satisfaction import FeedbackQuestions

    results = FeedbackQuestions._regroupe_par_question(
        [
            ("Est-ce que je dois m’isoler\u202f?", "oui", 50),
            ("Est-ce que je dois m’isoler\u202f?", "bof", 20),
            ("Est-ce que je dois m’isoler\u202f?", "non", 10),
        ]
    )
    assert results == {
        "Est-ce que je dois m’isoler\u202f?": {"bof": 20, "non": 10, "oui": 50}
    }


class MockAPI:
    def __init__(self, response):
        self.response = response

    def breakdown_for_day(self, *args, **kwargs):
        return self.response


def test_stats_du_jour():
    from satisfaction import FeedbackQuestions, Reponses

    question_feedback = FeedbackQuestions(
        plausible_api=MockAPI(
            response={
                "results": [
                    {
                        "reponse": "Est-ce que je dois m’isoler\u202f? : oui",
                        "visitors": 50,
                    },
                    {
                        "reponse": "Est-ce que je dois m’isoler\u202f? : bof",
                        "visitors": 20,
                    },
                    {
                        "reponse": "Est-ce que je dois m’isoler\u202f? : non",
                        "visitors": 10,
                    },
                ]
            }
        )
    )
    stats = question_feedback.stats_du_jour(date.today())
    assert stats == {
        "Est-ce que je dois m’isoler\u202f?": Reponses(
            {"oui": 50, "bof": 20, "non": 10}
        )
    }


def test_pourcentage_de_satisfaits():
    from satisfaction import Reponses

    stats = {
        "Est-ce que je dois m’isoler\u202f?": Reponses(
            {"oui": 50, "bof": 20, "non": 10}
        )
    }
    reponses = stats["Est-ce que je dois m’isoler\u202f?"]
    assert reponses.pourcentage_de_satisfaits() == 62.5
