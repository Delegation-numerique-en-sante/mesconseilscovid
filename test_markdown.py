from textwrap import dedent


def test_liste_sans_saut_de_ligne():
    from build import markdown

    assert (
        markdown(
            dedent(
                """\
                - a
                - b
                """
            )
        )
        == dedent(
            """\
            <ul>
            <li>a</li>
            <li>b</li>
            </ul>
            """
        )
    )


def test_liste_avec_saut_de_ligne():
    from build import markdown

    assert (
        markdown(
            dedent(
                """\
                - a

                - b
                """
            )
        )
        == dedent(
            """\
            <ul>
            <li><p>a</p>
            </li>
            <li><p>b</p>
            </li>
            </ul>
            """
        )
    )


def test_liste_avec_classes():
    from build import markdown

    assert (
        markdown(
            dedent(
                """\
                - {.classe-au-debut} a
                - b {.classe-a-la-fin}
                - foo {.classe-au-milieu} bar
                """
            )
        )
        == dedent(
            """\
            <ul>
            <li class="classe-au-debut">a</li>
            <li class="classe-a-la-fin">b</li>
            <li class="classe-au-milieu">foo bar</li>
            </ul>
            """
        )
    )


def test_block_html():
    from build import markdown

    assert (
        markdown(
            dedent(
                """\
                <!---->Mes deux points :

                ---

                <!---->Ses deux points :
                """
            )
        )
        == dedent(
            """\
            <!---->Mes deux points&nbsp;:
            <hr />
            <!---->Ses deux points&nbsp;:
            """
        )
    )
