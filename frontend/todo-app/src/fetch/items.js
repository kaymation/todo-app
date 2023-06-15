const ITEMS_URL = process.env.VUE_APP_ITEMS_URL || "http://localhost:3000/api/v1/items"
const getItemUrl = (id) => `${ITEMS_URL}/${id}`

export const getItems = async () => {
    return await fetch(ITEMS_URL, {
        headers: {
            "Content-Type": "application/json",
        }
    }).then((response) => {
        if (response.status === 200) {
            return response.json()
        }
    }).catch((error) => {
        console.log(error)
    })
}

export const createItem = async (item) => {
    return await fetch(ITEMS_URL, {
        method: "POST",
        body: JSON.stringify(item),
        headers: {
            "Content-Type": "application/json",
        }
    }).then((response) => {
        if (response.status === 200) {
            return response.json()
        }
    }).catch((error) => {
        console.log(error)
    })
}

export const updateItem = async (changes, itemId) => {
    const url = getItemUrl(itemId)
    return await fetch(url, {
        method: "PUT",
        body: JSON.stringify(changes),
        headers: {
            "Content-Type": "application/json",
        }
    }).then((response) => {
        if (response.status === 200) {
            return response.json()
        }
    }).catch((error) => {
        console.log(error)
    })
}

export const destroyItem = async (itemId) => {
    const url = getItemUrl(itemId)
    return await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        }
    }).then((response) => {
        if (response.status === 200) {
            return response.json()
        }
    }).catch((error) => {
        console.log(error)
    })   
}