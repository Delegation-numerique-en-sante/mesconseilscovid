import pytest


@pytest.mark.parametrize(
    "in_,out_",
    [
        ("", ""),
        (" ", " "),
        ("\u00a0", "\u00a0"),
        ("\u202f", "\u202f"),
        ("ici !", "ici&#8239;!"),
        ("non ?", "non&#8239;?"),
        ("infos :", "infos&nbsp;:"),
        ("entre « guillemets »", "entre «&nbsp;guillemets&nbsp;»"),
        ("18 h", "18&#8239;h"),
        ("24 heures", "24&nbsp;heures"),
        ("24&nbsp;heures", "24&nbsp;heures"),
        ("18 hibous", "18&nbsp;hibous"),
        ("1 j", "1&#8239;j"),
        ("1 jour", "1&nbsp;jour"),
        ("2 j", "2&#8239;j"),
        ("2 jours", "2&nbsp;jours"),
        ("65 ans", "65&nbsp;ans"),
        ("150 g", "150&#8239;g"),
        ("150 g de farine", "150&#8239;g de farine"),
        ("150 gibbons", "150&nbsp;gibbons"),
        ("200 mg", "200&#8239;mg"),
        ("à 10 000 kilomètres", "à 10&#8239;000&nbsp;kilomètres"),
        ("100&nbsp;%", "100&#8239;%"),
        ("pour&nbsp;100&nbsp;% des cas", "pour&nbsp;100&#8239;% des cas"),
        ("Covid-19 :", "Covid-19&nbsp;:"),
        ("35,5&nbsp;°C", "35,5&#8239;°C"),
        (
            "« Comment mettre son masque ? »",
            "«&nbsp;Comment mettre son masque&#8239;?&nbsp;»",
        ),
        (
            "« Comment mettre son masque ! »",
            "«&nbsp;Comment mettre son masque&#8239;!&nbsp;»",
        ),
        (
            "« Comment mettre son masque. »",
            "«&nbsp;Comment mettre son masque.&nbsp;»",
        ),
        (
            "« Comment mettre son masque… »",
            "«&nbsp;Comment mettre son masque…&nbsp;»",
        ),
    ],
)
def test_espaces_insecables(in_, out_):
    from typographie import typographie

    assert typographie(in_) == out_
