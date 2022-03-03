import pytest


@pytest.mark.parametrize(
    "in_,out_unicode, out_html",
    [
        ("", "", ""),
        (" ", " ", " "),
        ("\u00a0", "\u00a0", "&nbsp;"),
        ("\u202f", "\u202f", "&#8239;"),
        ("ici !", "ici\u202f!", "ici&#8239;!"),
        ("non ?", "non\u202f?", "non&#8239;?"),
        ("infos :", "infos\u00a0:", "infos&nbsp;:"),
        (
            "entre « guillemets »",
            "entre «\u00a0guillemets\u00a0»",
            "entre «&nbsp;guillemets&nbsp;»",
        ),
        (
            'entre « <a href="">guillemets avec lien</a> »',
            'entre «\u00a0<a href="">guillemets avec lien</a>\u00a0»',
            'entre «&nbsp;<a href="">guillemets avec lien</a>&nbsp;»',
        ),
        ("18 h", "18\u202fh", "18&#8239;h"),
        ("24 heures", "24\u00a0heures", "24&nbsp;heures"),
        ("24&nbsp;heures", "24\u00a0heures", "24&nbsp;heures"),
        ("18 hibous", "18\u00a0hibous", "18&nbsp;hibous"),
        ("1 j", "1\u202fj", "1&#8239;j"),
        ("1 jour", "1\u00a0jour", "1&nbsp;jour"),
        ("2 j", "2\u202fj", "2&#8239;j"),
        ("2 jours", "2\u00a0jours", "2&nbsp;jours"),
        ("65 ans", "65\u00a0ans", "65&nbsp;ans"),
        ("150 g", "150\u202fg", "150&#8239;g"),
        ("150 g de farine", "150\u202fg de farine", "150&#8239;g de farine"),
        ("150 gibbons", "150\u00a0gibbons", "150&nbsp;gibbons"),
        ("200 mg", "200\u202fmg", "200&#8239;mg"),
        ("200 µg", "200\u202fµg", "200&#8239;µg"),
        (
            "à 10 000 kilomètres",
            "à 10\u202f000\u00a0kilomètres",
            "à 10&#8239;000&nbsp;kilomètres",
        ),
        ("100&nbsp;%", "100\u202f%", "100&#8239;%"),
        (
            "pour&nbsp;100&nbsp;% des cas",
            "pour&nbsp;100\u202f% des cas",
            "pour&nbsp;100&#8239;% des cas",
        ),
        (
            '<h2 itemprop="name">Est-ce que je peux voyager&nbsp;?</h2>',
            '<h2 itemprop="name">Est-ce que je peux voyager\u202f?</h2>',
            '<h2 itemprop="name">Est-ce que je peux voyager&#8239;?</h2>',
        ),
        ("Covid-19 :", "Covid-19\u00a0:", "Covid-19&nbsp;:"),
        ("35,5&nbsp;°C", "35,5\u202f°C", "35,5&#8239;°C"),
        (
            "« Comment mettre son masque ? »",
            "«\u00a0Comment mettre son masque\u202f?\u00a0»",
            "«&nbsp;Comment mettre son masque&#8239;?&nbsp;»",
        ),
        (
            "« Comment mettre son masque ! »",
            "«\u00a0Comment mettre son masque\u202f!\u00a0»",
            "«&nbsp;Comment mettre son masque&#8239;!&nbsp;»",
        ),
        (
            "« Comment mettre son masque. »",
            "«\u00a0Comment mettre son masque.\u00a0»",
            "«&nbsp;Comment mettre son masque.&nbsp;»",
        ),
        (
            "« Comment mettre son masque… »",
            "«\u00a0Comment mettre son masque…\u00a0»",
            "«&nbsp;Comment mettre son masque…&nbsp;»",
        ),
        (
            """<h3>
                Si vous êtes complètement vacciné(e) :
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="arcs"><path d="m6 9 6 6 6-6"/></svg>
            </h3>""",
            """<h3>
                Si vous êtes complètement vacciné(e)\u00a0:
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="arcs"><path d="m6 9 6 6 6-6"/></svg>
            </h3>""",
            """<h3>
                Si vous êtes complètement vacciné(e)&nbsp;:
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="arcs"><path d="m6 9 6 6 6-6"/></svg>
            </h3>""",
        ),
    ],
)
def test_espaces_insecables(in_, out_unicode, out_html):
    from construction.typographie import typographie

    assert typographie(in_) == out_unicode
    assert typographie(in_, html=True) == out_html
