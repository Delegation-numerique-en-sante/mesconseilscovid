export async function recuperationReponse(page, thematique, reponse) {
    const contenuReponse = await page.waitForSelector(
        `#${thematique}-${reponse}-reponse`
    )
    return (await contenuReponse.innerText()).trim()
}
