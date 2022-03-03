from textwrap import dedent

import pytest


@pytest.fixture
def markdown():
    from construction.markdown import create_markdown_parser

    return create_markdown_parser()


def test_liste_sans_saut_de_ligne(markdown):
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


def test_liste_avec_saut_de_ligne(markdown):
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


def test_elements_de_liste_avec_classe(markdown):
    assert (
        markdown(
            dedent(
                """\
                - {.classe-au-debut} a
                - b {.classe-a-la-fin}
                - foo {.classe-au-milieu} bar
                - {.foo bar baz} plusieurs classes
                - pas de classe
                """
            )
        )
        == dedent(
            """\
            <ul>
            <li class="classe-au-debut">a</li>
            <li class="classe-a-la-fin">b</li>
            <li class="classe-au-milieu">foo bar</li>
            <li class="foo bar baz">plusieurs classes</li>
            <li>pas de classe</li>
            </ul>
            """
        )
    )


def test_paragraphes_avec_classe(markdown):
    assert (
        markdown(
            dedent(
                """\
                {.classe-au-debut} a

                b {.classe-a-la-fin}

                foo {.classe-au-milieu} bar

                {.foo bar baz} plusieurs classes

                pas de classes
                """
            )
        )
        == dedent(
            """\
            <p class="classe-au-debut">a</p>
            <p class="classe-a-la-fin">b</p>
            <p class="classe-au-milieu">foo bar</p>
            <p class="foo bar baz">plusieurs classes</p>
            <p>pas de classes</p>
            """
        )
    )


def test_block_html(markdown):
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


class TestSectionDirective:
    def test_cas_de_base(self, markdown):
        assert (
            markdown(
                dedent(
                    """\
                    .. section:: La vaccination
                    """
                )
            )
            == dedent(
                """\
                <h2 id="la-vaccination">La vaccination</h2>
                """
            )
        )

    def test_niveau_specifique(self, markdown):
        assert (
            markdown(
                dedent(
                    """\
                    .. section:: La vaccination
                        :level: 3
                    """
                )
            )
            == dedent(
                """\
                <h3 id="la-vaccination">La vaccination</h3>
                """
            )
        )

    def test_slug_specifique(self, markdown):
        assert (
            markdown(
                dedent(
                    """\
                    .. section:: La vaccination
                        :slug: vaccination
                    """
                )
            )
            == dedent(
                """\
                <h2 id="vaccination">La vaccination</h2>
                """
            )
        )

    def test_tags(self, markdown):
        assert (
            markdown(
                dedent(
                    """\
                    .. section:: La vaccination
                        :tags: Foo, Bar
                    """
                )
            )
            == dedent(
                """\
                <h2 id="la-vaccination">La vaccination <span class="tags">
                  <span class="tag tag-foo">Foo</span>
                  <span class="tag tag-bar">Bar</span>
                </span></h2>
                """
            )
        )

    def test_folded(self, markdown):
        assert (
            markdown(
                dedent(
                    """\
                    .. section:: La vaccination
                        :level: 3
                        :folded: true
                    """
                )
            )
            == dedent(
                """\
                <h3 id="la-vaccination">La vaccination
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="arcs"><path d="m6 9 6 6 6-6"/></svg>
                </h3>
                """
            )
        )


class TestQuestionDirective:
    def test_default_heading_level(self, markdown):
        assert (
            markdown(
                dedent(
                    """\
                    .. question:: Quand pourrai-je me faire vacciner ?

                        Vous pouvez vous faire vacciner **dès maintenant** :

                        * si vous avez **18 ans et plus**, sans conditions ;
                        * si vous avez entre **16 et 17 ans** et présentez un risque de développer une **forme très grave** de Covid (cancer, dialyse, trisomie 21, etc.) ;
                        * si vous êtes au **second trimestre** de votre grossesse.
                    """
                )
            )
            == dedent(
                """\
                <details id="quand-pourrai-je-me-faire-vacciner" class="bloc-a-deplier" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                <summary>
                    <h2>
                        <span itemprop="name">Quand pourrai-je me faire vacciner&#8239;?</span>
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="arcs"><path d="m6 9 6 6 6-6"/></svg>
                    </h2>
                </summary>

                <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                <div itemprop="text">
                <p>Vous pouvez vous faire vacciner <strong>dès maintenant</strong>&nbsp;:</p>
                <ul>
                <li>si vous avez <strong>18&nbsp;ans et plus</strong>, sans conditions&#8239;;</li>
                <li>si vous avez entre <strong>16&nbsp;et 17&nbsp;ans</strong> et présentez un risque de développer une <strong>forme très grave</strong> de Covid (cancer, dialyse, trisomie&nbsp;21, etc.)&#8239;;</li>
                <li>si vous êtes au <strong>second trimestre</strong> de votre grossesse.</li>
                </ul>
                </div>
                </div>
                <form class="question-feedback">
                    <fieldset>
                        <legend>Avez-vous trouvé cette réponse utile&#8239;?</legend>
                        <div>
                            <label><input type="submit" class="button-invisible" data-value="non" value="🙁">Non</label>
                            <label><input type="submit" class="button-invisible" data-value="bof" value="😐">Bof</label>
                            <label><input type="submit" class="button-invisible" data-value="oui" value="🙂">Oui</label>
                        </div>
                    </fieldset>
                </form>
                </details>
                """
            )
        )

    def test_specific_heading_level(self, markdown):
        assert (
            markdown(
                dedent(
                    """\
                    .. question:: Quand pourrai-je me faire vacciner ?
                        :level: 3

                        Vous pouvez vous faire vacciner **dès maintenant** :

                        * si vous avez **18 ans et plus**, sans conditions ;
                        * si vous avez entre **16 et 17 ans** et présentez un risque de développer une **forme très grave** de Covid (cancer, dialyse, trisomie 21, etc.) ;
                        * si vous êtes au **second trimestre** de votre grossesse.
                    """
                )
            )
            == dedent(
                """\
                <details id="quand-pourrai-je-me-faire-vacciner" class="bloc-a-deplier" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                <summary>
                    <h3>
                        <span itemprop="name">Quand pourrai-je me faire vacciner&#8239;?</span>
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="arcs"><path d="m6 9 6 6 6-6"/></svg>
                    </h3>
                </summary>

                <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                <div itemprop="text">
                <p>Vous pouvez vous faire vacciner <strong>dès maintenant</strong>&nbsp;:</p>
                <ul>
                <li>si vous avez <strong>18&nbsp;ans et plus</strong>, sans conditions&#8239;;</li>
                <li>si vous avez entre <strong>16&nbsp;et 17&nbsp;ans</strong> et présentez un risque de développer une <strong>forme très grave</strong> de Covid (cancer, dialyse, trisomie&nbsp;21, etc.)&#8239;;</li>
                <li>si vous êtes au <strong>second trimestre</strong> de votre grossesse.</li>
                </ul>
                </div>
                </div>
                <form class="question-feedback">
                    <fieldset>
                        <legend>Avez-vous trouvé cette réponse utile&#8239;?</legend>
                        <div>
                            <label><input type="submit" class="button-invisible" data-value="non" value="🙁">Non</label>
                            <label><input type="submit" class="button-invisible" data-value="bof" value="😐">Bof</label>
                            <label><input type="submit" class="button-invisible" data-value="oui" value="🙂">Oui</label>
                        </div>
                    </fieldset>
                </form>
                </details>
                """
            )
        )

    def test_open(self, markdown):
        assert (
            markdown(
                dedent(
                    """\
                    .. question:: Quand pourrai-je me faire vacciner ?
                        :open: true

                        Qui dolore consectetur elit sed exercitation anim pariatur occaecat et eiusmod excepteur.
                    """
                )
            )
            == dedent(
                """\
                <details id="quand-pourrai-je-me-faire-vacciner" class="bloc-a-deplier" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question" open>
                <summary>
                    <h2>
                        <span itemprop="name">Quand pourrai-je me faire vacciner&#8239;?</span>
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="arcs"><path d="m6 9 6 6 6-6"/></svg>
                    </h2>
                </summary>

                <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                <div itemprop="text">
                <p>Qui dolore consectetur elit sed exercitation anim pariatur occaecat et eiusmod excepteur.</p>
                </div>
                </div>
                <form class="question-feedback">
                    <fieldset>
                        <legend>Avez-vous trouvé cette réponse utile&#8239;?</legend>
                        <div>
                            <label><input type="submit" class="button-invisible" data-value="non" value="🙁">Non</label>
                            <label><input type="submit" class="button-invisible" data-value="bof" value="😐">Bof</label>
                            <label><input type="submit" class="button-invisible" data-value="oui" value="🙂">Oui</label>
                        </div>
                    </fieldset>
                </form>
                </details>
                """
            )
        )


class TestRenvoiDirective:
    def test_renvoi(self):
        from construction.markdown import create_markdown_parser

        markdown = create_markdown_parser(
            questions_index={
                "je-veux-me-faire-vacciner.html": {
                    "titre": "Je souhaite me faire vacciner",
                    "questions": {
                        "suis-je-concerne-par-la-dose-de-rappel-dite-3-e-dose": {
                            "titre": "Suis-je concerné par la dose de rappel, dite 3<sup>e</sup> dose&#8239;?",
                        }
                    },
                }
            }
        )
        assert (
            markdown(
                dedent(
                    """\
                    .. renvoi:: /je-veux-me-faire-vacciner.html#suis-je-concerne-par-la-dose-de-rappel-dite-3-e-dose
                        :level: 3
                    """
                )
            )
            == dedent(
                """\
                <details id="suis-je-concerne-par-la-dose-de-rappel-dite-3-e-dose" class="bloc-a-deplier">
                    <summary>
                    <h3>
                        <span>Suis-je concerné par la dose de rappel, dite 3<sup>e</sup> dose&#8239;?</span>
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="arcs"><path d="m6 9 6 6 6-6"/></svg>
                    </h3>
                </summary>

                    <p>
                        Voir la réponse sur notre page
                        « <a href="je-veux-me-faire-vacciner.html#suis-je-concerne-par-la-dose-de-rappel-dite-3-e-dose">Je souhaite me faire vacciner</a> ».
                    </p>
                </details>
            """
            )
        )


class TestInjectionDirective:
    def test_injection(self):
        from construction.markdown import create_markdown_parser

        markdown = create_markdown_parser(
            questions_index={
                "je-veux-me-faire-vacciner.html": {
                    "titre": "Je souhaite me faire vacciner",
                    "questions": {
                        "suis-je-concerne-par-la-dose-de-rappel-dite-3-e-dose": {
                            "titre": "Suis-je concerné par la dose de rappel, dite 3<sup>e</sup> dose&#8239;?",
                            "details": dedent(
                                """\
                                <details id="suis-je-concerne-par-la-dose-de-rappel-dite-3-e-dose" class="bloc-a-deplier">
                                    <summary>
                                        <h3>
                                            <span>Suis-je concerné par la dose de rappel, dite 3<sup>e</sup> dose&#8239;?</span>
                                            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="arcs"><path d="m6 9 6 6 6-6"/></svg>
                                        </h3>
                                    </summary>
                                    <p>
                                        Avec le temps, l’efficacité de la protection du vaccin contre l’infection
                                        peut diminuer, en particulier face au variant Delta.
                                        Pour « booster » cette protection, la Haute autorité de santé (HAS)
                                        recommande un **rappel vaccinal** avec une 2<sup>e</sup>, 3<sup>e</sup>
                                        ou 4<sup>e</sup> dose selon les cas, pour :
                                    </p>
                                </details>"""
                            ),
                        }
                    },
                }
            }
        )
        assert (
            markdown(
                dedent(
                    """\
                    .. injection:: /je-veux-me-faire-vacciner.html#suis-je-concerne-par-la-dose-de-rappel-dite-3-e-dose
                    """
                )
            )
            == dedent(
                """\
                <details id="suis-je-concerne-par-la-dose-de-rappel-dite-3-e-dose" class="bloc-a-deplier">
                    <summary>
                        <h3>
                            <span>Suis-je concerné par la dose de rappel, dite 3<sup>e</sup> dose&#8239;?</span>
                            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="arcs"><path d="m6 9 6 6 6-6"/></svg>
                        </h3>
                    </summary>
                    <p>
                        Avec le temps, l’efficacité de la protection du vaccin contre l’infection
                        peut diminuer, en particulier face au variant Delta.
                        Pour « booster » cette protection, la Haute autorité de santé (HAS)
                        recommande un **rappel vaccinal** avec une 2<sup>e</sup>, 3<sup>e</sup>
                        ou 4<sup>e</sup> dose selon les cas, pour :
                    </p>
                </details>"""
            )
        )


class TestMarkdownContentBlock:
    def test_render_block(self, markdown):
        from construction.templates import MarkdownContent

        m = MarkdownContent("Hello **world**", markdown)
        assert m.render_block() == "<p>Hello <strong>world</strong></p>\n"

    def test_stringify(self, markdown):
        from construction.templates import MarkdownContent

        m = MarkdownContent("Hello **world**", markdown)
        assert str(m) == m.render_block()

    def test_split(self, markdown):
        from construction.templates import MarkdownContent

        m = MarkdownContent("Moi\n\n---\n\nCette personne", markdown)
        me, them = m.split()

        assert isinstance(me, MarkdownContent)
        assert me.text == "Moi"

        assert isinstance(them, MarkdownContent)
        assert them.text == "Cette personne"

    def test_me_or_them_filter(self, markdown):
        from construction.templates import MarkdownContent, me_or_them_filter

        m = MarkdownContent("Moi\n\n---\n\nCette personne", markdown)
        assert me_or_them_filter(m) == (
            '<div class="me visible"><p>Moi</p></div>'
            '<div class="them" hidden><p>Cette personne</p></div>'
        )


class TestMarkdownContentInline:
    def test_inline_filter(self, markdown):
        from construction.templates import (
            MarkdownContent,
            MarkdownInlineContent,
            inline_filter,
        )

        m = MarkdownContent("Hello **world**", markdown)
        i = inline_filter(m)
        assert isinstance(i, MarkdownInlineContent)

    def test_render_inline(self, markdown):
        from construction.templates import MarkdownInlineContent

        m = MarkdownInlineContent("Hello **world**\n", markdown)
        assert m.render_inline() == "Hello <strong>world</strong>"

    def test_stringify(self, markdown):
        from construction.templates import MarkdownInlineContent

        m = MarkdownInlineContent("Hello **world**", markdown)
        assert str(m) == m.render_inline()

    def test_split(self, markdown):
        from construction.templates import MarkdownInlineContent

        m = MarkdownInlineContent("Moi\n\n---\n\nCette personne", markdown)
        me, them = m.split()

        assert isinstance(me, MarkdownInlineContent)
        assert me.text == "Moi"

        assert isinstance(them, MarkdownInlineContent)
        assert them.text == "Cette personne"

    def test_me_or_them_filter(self, markdown):
        from construction.templates import MarkdownInlineContent, me_or_them_filter

        m = MarkdownInlineContent("Moi\n\n---\n\nCette **personne**", markdown)
        assert me_or_them_filter(m) == (
            '<span class="me visible">Moi</span>'
            '<span class="them" hidden>Cette <strong>personne</strong></span>'
        )
