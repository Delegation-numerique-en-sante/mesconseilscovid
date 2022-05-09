/* See:
 * https://gomakethings.com/how-to-create-a-search-page-for-a-static-website-with-vanilla-js/
 * https://gomakethings.com/how-to-update-the-url-of-a-page-without-causing-a-reload-using-vanilla-javascript/
 */

/**
 * If there's a query string search term, search it on page load
 */
export function onload(input, stopWords, searchIndex, searchStatus, resultList) {
    let query = new URLSearchParams(window.location.search).get('s')
    if (!query) return
    input.value = query
    search(query, stopWords, searchIndex, searchStatus, resultList)
}

/**
 * Search for matches
 * @param  {String} query The term to search for
 */
export function search(query, stopWords, searchIndex, searchStatus, resultList) {
    // Create a regex for each query
    let regMap = query
        .toLowerCase()
        .split(' ')
        .filter(function (word) {
            return word.length && !stopWords.includes(word)
        })
        .map(function (word) {
            return new RegExp(word, 'i')
        })

    // Get and sort the results
    let results = searchIndex
        .reduce(function (results, article) {
            // Setup priority count
            let priority = 0

            // Assign priority
            for (let reg of regMap) {
                if (reg.test(article.title)) {
                    priority += 100
                }
                let occurences = article.content.match(reg)
                if (occurences) {
                    priority += occurences.length
                }
            }

            // If any matches, push to results
            if (priority > 0) {
                results.push({
                    priority: priority,
                    article: article,
                })
            }

            return results
        }, [])
        .sort(function (article1, article2) {
            return article2.priority - article1.priority
        })

    // Display the results
    showResults(results, regMap, searchStatus, resultList)

    // Update the URL
    updateURL(query)
}

/**
 * Show the search results in the UI
 * @param  {Array}  results The results to display
 * @param  {List}  regMap Regular expressions for the highlights
 */
function showResults(results, regMap, searchStatus, resultList) {
    let status = 'Aucune question n’a été trouvée 😢'
    let searchResults = ''
    if (results.length) {
        const plural = results.length > 1 ? 's' : ''
        status = `${results.length} question${plural} trouvée${plural} 🙌`
        searchResults = results
            .map(function (result) {
                const url = result.article.url
                const title = highlightText(result.article.title, regMap)
                return `<li><a href="${url}">${title}</a></li>`
            })
            .join('')
    }
    searchStatus.innerHTML = status
    resultList.innerHTML = searchResults
}

/**
 * Highlight the text in the UI
 * @param  {String}  text The content to highlight
 * @param  {List}  regMap Regular expressions for the highlights
 */
function highlightText(text, regMap) {
    // TODO: deal with close matches when multiple words are looked for,
    // it does not look trivial because you have to memorize positions
    // then create extracts.
    // For instance: `microsoft github`
    const extractBoundariesSize = 100
    const textLength = text.length
    let extracts = []
    for (let reg of regMap) {
        const index = text.search(reg)
        if (index === -1) {
            continue
        }
        let extract = text.substring(
            index - extractBoundariesSize,
            index + reg.source.length + extractBoundariesSize
        )
        // TODISCUSS: we replace with the source but in case there is
        // an uppercase letter it will disappear from the extract
        // (is that confusing or closer to what is expected?)
        extract = extract.replace(reg, `<mark>${reg.source}</mark>`)
        const prefixEllipsis = index - extractBoundariesSize >= 0 ? '…' : ''
        const suffixEllipsis = index + extractBoundariesSize <= textLength ? '…' : ''
        extracts.push(`${prefixEllipsis}${extract}${suffixEllipsis}`)
    }
    if (!extracts.length && textLength < 200) {
        // If there is no match but it's a short title, return it.
        return text
    }
    return extracts.join('')
}

/**
 * Update the URL with a query string for the search string
 * @param  {String} query The search query
 */
function updateURL(query) {
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
