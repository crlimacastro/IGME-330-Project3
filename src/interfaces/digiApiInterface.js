const baseUrl = "https://people.rit.edu/crl3554/330/project3/src/php/digi-sleuth-proxy.php";

// Returns in-game info for digimon
async function search(name) {
    let url = baseUrl + `?action=search&name=${encodeURI(name)}`;
    return fetch(url)
        .then(response => {
            if (!response.ok)
                throw Error(response.statusText);

            return response.text();
        })
        // Process text to json
        .then(text => {
            try {
                let json = JSON.parse(text);
                return json;
            } catch (e) {
                return null;
            }
        });
}

// Returns digimon skill by id
async function getSkill(id) {
    let url = baseUrl + `?action=skill&id=${id}`;

    return fetch(url)
        .then(response => {
            if (!response.ok)
                throw Error(response.statusText);

            return response.json();
        });
}

// Gets back all digimon filtered by the parameters
async function list(amount, offset, stage = null, type = null, attribute = null) {
    let url = baseUrl + "?action=list";

    if (stage)
        url += `&stage=${stage}`;
    if (type)
        url += `&type=${type}&`;
    if (attribute)
        url += `&attribute=${attribute}`;

    return fetch(url)
        // Get the json
        .then(response => {
            if (!response.ok)
                throw Error(response.statusText);

            return response.json();
        })
        // Filter results
        .then(arr => {
            let filteredArr = arr;

            if (stage)
                filteredArr = filteredArr.filter(digimon => digimon.stage == stage);
            if (type)
                filteredArr = filteredArr.filter(digimon => digimon.type == type);
            if (attribute)
                filteredArr = filteredArr.filter(digimon => digimon.attribute == attribute);

            return filteredArr;
        })
        // Get only the amount desired
        .then(filteredArr => {
            // Don't go over the size of the array
            amount = (offset + amount) > filteredArr.length ? filteredArr.length - offset : amount;

            return {
                arr: filteredArr.slice(offset, offset + amount),
                total: filteredArr.length
            };
        });
}

export { search, getSkill, list };