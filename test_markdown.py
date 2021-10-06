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


def test_elements_de_liste_avec_classe():
    from build import markdown

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


def test_paragraphes_avec_classe():
    from build import markdown

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


class TestQuestionDirective:
    def test_default_heading_level(self):
        from build import markdown

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
                <div id="quand-pourrai-je-me-faire-vacciner" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                <h2>
                    <span itemprop="name">Quand pourrai-je me faire vacciner&#8239;?</span> <a href="#quand-pourrai-je-me-faire-vacciner" itemprop="url" title="Lien vers cette question" aria-hidden="true">#</a>
                </h2>
                <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                <div itemprop="text">
                <p>Vous pouvez vous faire vacciner <strong>dès maintenant</strong>&nbsp;:</p>
                <ul>
                <li>si vous avez <strong>18&nbsp;ans et plus</strong>, sans conditions&#8239;;</li>
                <li>si vous avez entre <strong>16&nbsp;et 17&nbsp;ans</strong> et présentez un risque de développer une <strong>forme très grave</strong> de Covid (cancer, dialyse, trisomie 21, etc.)&#8239;;</li>
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
                </div>
                """
            )
        )

    def test_specific_heading_level(self):
        from build import markdown

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
                <div id="quand-pourrai-je-me-faire-vacciner" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                <h3>
                    <span itemprop="name">Quand pourrai-je me faire vacciner&#8239;?</span> <a href="#quand-pourrai-je-me-faire-vacciner" itemprop="url" title="Lien vers cette question" aria-hidden="true">#</a>
                </h3>
                <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                <div itemprop="text">
                <p>Vous pouvez vous faire vacciner <strong>dès maintenant</strong>&nbsp;:</p>
                <ul>
                <li>si vous avez <strong>18&nbsp;ans et plus</strong>, sans conditions&#8239;;</li>
                <li>si vous avez entre <strong>16&nbsp;et 17&nbsp;ans</strong> et présentez un risque de développer une <strong>forme très grave</strong> de Covid (cancer, dialyse, trisomie 21, etc.)&#8239;;</li>
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
                </div>
                """
            )
        )


class TestSummaryDirective:
    def test_summary(self):
        from build import markdown

        assert (
            markdown(
                dedent(
                    """\
                    .. summary:: Je ne suis pas vacciné(e) et je souhaite voyager
                    """
                )
            )
            == dedent(
                """\
                <summary>
                    <h3>
                        Je ne suis pas vacciné(e) et je souhaite voyager
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z"/></svg>
                    </h3>
                </summary>
                """
            )
        )


class TestMarkdownContentBlock:
    def test_render_block(self):
        from build import MarkdownContent, markdown

        m = MarkdownContent("Hello **world**", markdown)
        assert m.render_block() == "<p>Hello <strong>world</strong></p>\n"

    def test_stringify(self):
        from build import MarkdownContent, markdown

        m = MarkdownContent("Hello **world**", markdown)
        assert str(m) == m.render_block()

    def test_split(self):
        from build import MarkdownContent, markdown

        m = MarkdownContent("Moi\n\n---\n\nCette personne", markdown)
        me, them = m.split()

        assert isinstance(me, MarkdownContent)
        assert me.text == "Moi"

        assert isinstance(them, MarkdownContent)
        assert them.text == "Cette personne"

    def test_me_or_them_filter(self):
        from build import MarkdownContent, markdown, me_or_them_filter

        m = MarkdownContent("Moi\n\n---\n\nCette personne", markdown)
        assert me_or_them_filter(m) == (
            '<div class="me visible"><p>Moi</p></div>'
            '<div class="them" hidden><p>Cette personne</p></div>'
        )


class TestMarkdownContentInline:
    def test_inline_filter(self):
        from build import (
            MarkdownContent,
            MarkdownInlineContent,
            markdown,
            inline_filter,
        )

        m = MarkdownContent("Hello **world**", markdown)
        i = inline_filter(m)
        assert isinstance(i, MarkdownInlineContent)

    def test_render_inline(self):
        from build import MarkdownInlineContent, markdown

        m = MarkdownInlineContent("Hello **world**\n", markdown)
        assert m.render_inline() == "Hello <strong>world</strong>"

    def test_stringify(self):
        from build import MarkdownInlineContent, markdown

        m = MarkdownInlineContent("Hello **world**", markdown)
        assert str(m) == m.render_inline()

    def test_split(self):
        from build import MarkdownInlineContent, markdown

        m = MarkdownInlineContent("Moi\n\n---\n\nCette personne", markdown)
        me, them = m.split()

        assert isinstance(me, MarkdownInlineContent)
        assert me.text == "Moi"

        assert isinstance(them, MarkdownInlineContent)
        assert them.text == "Cette personne"

    def test_me_or_them_filter(self):
        from build import MarkdownInlineContent, markdown, me_or_them_filter

        m = MarkdownInlineContent("Moi\n\n---\n\nCette **personne**", markdown)
        assert me_or_them_filter(m) == (
            '<span class="me visible">Moi</span>'
            '<span class="them" hidden>Cette <strong>personne</strong></span>'
        )


def _build_tree(items, level):
    siblings = []
    while items:
        next_item = items[0]
        if next_item == level:
            item = items.pop(0)
            children, items = _build_tree(items, level+1)
            siblings.append((item, children))
        elif next_item > level:
            raise RuntimeError("should not happen")
        elif next_item < level:
            break
    return siblings, items


def build_tree(items, level=1):
    tree, rest = _build_tree(items, level)
    assert rest == []
    return tree


import pytest
@pytest.mark.parametrize("input_,output_", [
    ([], []),
    ([1], [(1, [])]),
    ([1, 1], [(1, []), (1, [])]),
    ([1, 2], [(1, [(2, [])])]),
    ([1, 2, 3, 3, 2, 3], [(1, [(2, [(3, []), (3, [])]), (2, [(3, [])])])])
])
def test_heading_hierarchy(input_,output_):
    assert build_tree(input_) == output_
