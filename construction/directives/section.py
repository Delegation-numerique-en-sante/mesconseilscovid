from mistune.directives import Directive

from construction.slugs import slugify_title


class SectionDirective(Directive):
    def __call__(self, md):
        self.register_directive(md, "section")

    def parse(self, block, m, state):
        text = m.group("value")
        options = dict(self.parse_options(m))
        if options and "slug" in options:
            tid = options["slug"]
        else:
            tid = slugify_title(text)
        if options and "level" in options:
            level = int(options["level"])
        else:
            level = 2
        if options and "tags" in options:
            tags = [tag.strip() for tag in options["tags"].split(",")]
        else:
            tags = []
        folded = options.get("folded") == "true"
        children = block.parse(self.parse_text(m), state, block.rules)
        if children:
            raise ValueError(
                f"Section avec des enfants : indentation en trop ?\n« {text} »"
            )
        state["toc_headings"].append((tid, text, level, tags))
        return {"type": "theading", "text": text, "params": (level, tid, tags, folded)}
