from setuptools import setup

setup(
    name="mesconseilscovid-feedback",
    version="3.2.0",
    url="https://github.com/Delegation-numerique-en-sante/mesconseilscovid",
    author="Délégation ministérielle du numérique en santé",
    author_email="mesconseilscovid@sante.gouv.fr",
    description="Retours utilisateurs pour Mes Conseils Covid",
    packages=["mesconseilscovid_feedback"],
    python_requires=">=3.7",
    install_requires=["roll", "pykeybasebot", "python-slugify", "user-agents"],
    extras_require={
        "prod": ["gunicorn"],
    },
)
