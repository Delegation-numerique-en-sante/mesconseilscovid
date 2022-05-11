/* See:
 * https://gomakethings.com/
 * how-to-create-a-search-page-for-a-static-website-with-vanilla-js/
 * https://gomakethings.com/
 * how-to-update-the-url-of-a-page-without-causing-a-reload-using-vanilla-javascript/
 */

import STOPWORDS from './recherche_stopwords'

type Question = { title: string; content: string; url: URL; title_page: string }
type Result = { priority: number; question: Question }

/**
 * If there's a query string search term, search it on page load
 */
export function onload(
    input: HTMLInputElement,
    searchIndex: [],
    searchStatus: HTMLElement,
    resultList: HTMLElement
) {
    let query = new URLSearchParams(window.location.search).get('s')
    if (!query) return
    input.value = query
    search(query, searchIndex, searchStatus, resultList)
}

/**
 * Search for matches
 */
export function search(
    query: string,
    searchIndex: [],
    searchStatus: HTMLElement,
    resultList: HTMLElement
) {
    // Create a regex for each query
    let regMap = query
        .toLowerCase()
        .split(' ')
        .filter((word) => word.length && !STOPWORDS.includes(word))
        .map((word) => new RegExp(word, 'i'))

    // Get and sort the results
    let results: Result[] = searchIndex
        .reduce((results: Result[], question: Question) => {
            // Setup priority count
            let priority = 0

            // Assign priority
            for (let reg of regMap) {
                if (reg.test(question.title)) {
                    priority += 100
                }
                let occurences = question.content.match(reg)
                if (occurences) {
                    priority += occurences.length
                }
            }

            // If any matches, push to results
            if (priority > 0) {
                results.push({ priority, question })
            }

            return results
        }, [])
        .sort((result1, result2) => result2.priority - result1.priority)

    // Display the results
    showResults(results, query, regMap, searchStatus, resultList)

    // Update the URL
    updateURL(query)
}

/**
 * Show the search results in the UI
 */
function showResults(
    results: Result[],
    query: string,
    regMap: RegExp[],
    searchStatus: HTMLElement,
    resultList: HTMLElement
) {
    const resultsLength = results.length
    if (!resultsLength) {
        resultList.innerHTML = ''
        if (query.length) {
            searchStatus.innerHTML = 'Aucune question/réponse n’a été trouvée 😢'
        } else {
            searchStatus.innerHTML = ''
        }
        return
    }
    const plural = results.length > 1 ? 's' : ''
    searchStatus.innerHTML = `
        ${results.length} question${plural}/réponse${plural} trouvée${plural} 🙌
    `

    const NB_VISIBLE_RESULTS = 5
    const searchResults = results.map((result) => {
        const url = result.question.url
        const title = highlightText(result.question.title, regMap)
        return `<li><a href="${url}">${title}</a></li>`
    })
    if (resultsLength <= NB_VISIBLE_RESULTS) {
        resultList.innerHTML = `<ul>${searchResults.join('')}</ul>`
    } else {
        const visibleSearchResults = searchResults.slice(0, NB_VISIBLE_RESULTS)
        const hiddenSearchResults = searchResults.slice(NB_VISIBLE_RESULTS)
        const hiddenPlural = hiddenSearchResults.length > 1 ? 's' : ''
        resultList.innerHTML = `
        <ul>${visibleSearchResults.join('')}</ul>
        <details>
            <summary>Voir plus de résultats de recherche (${
                hiddenSearchResults.length
            } autre${hiddenPlural})</summary>
            <ul>${hiddenSearchResults.join('')}</ul>
        </details>
        `
    }
}

/**
 * Highlight the text in the UI
 */
function highlightText(text: string, regMap: RegExp[]) {
    let extract = text
    for (let reg of regMap) {
        const index = text.search(reg)
        if (index === -1) {
            continue
        }
        // TODISCUSS: we replace with the source but in case there is
        // an uppercase letter it will disappear from the extract
        // (is that confusing or closer to what is expected?)
        extract = extract.replace(reg, `<mark>${reg.source}</mark>`)
    }
    if (!extract.length) {
        return text
    }
    return extract
}

/**
 * Update the URL with a query string for the search string
 */
function updateURL(query: string) {
    // Create the properties
    let state = history.state
    let title = document.title
    let url = window.location.origin + window.location.pathname
    if (query) {
        url += '?s=' + encodeURI(query)
    }

    // Update the URL
    history.pushState(state, title, url)
}
