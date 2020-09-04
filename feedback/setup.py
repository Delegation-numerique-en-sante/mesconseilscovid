from setuptools import setup

setup(
    name="mesconseilscovid-feedback",
    version="1.0.0",
    url="https://github.com/Delegation-numerique-en-sante/mesconseilscovid",
    author="Délégation ministérielle du numérique en santé",
    author_email="mesconseilscovid@sante.gouv.fr",
    description="Retours utilisateurs pour Mes Conseils Covid",
    modules=["app"],
    python_requires=">=3.7",
    install_requires=["roll", "pykeybasebot"],
)
