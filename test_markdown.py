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


class TestMarkdownLinks:
    def test_http(self):
        from build import markdown
        assert markdown("[foo](http://bar)") == '<p><a href="http://bar">foo</a></p>\n'

    def test_internal(self):
        from build import markdown
        assert markdown("[foo](vaccins)") == '<p><a href="vaccins" data-navigo>foo</a></p>\n'


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
