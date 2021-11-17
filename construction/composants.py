def render_html_summary(text, title, level=3, extra_span=""):
    return f"""<summary>
    <h{level}>
        <span{extra_span}>{title}</span>
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="arcs"><path d="m6 9 6 6 6-6"/></svg>
    </h{level}>
</summary>
"""
