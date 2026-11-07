class ApiModel {
    static sendLogin(username, password) {
        return fetch("https://campus.csbe.ch/uek294/api/v1/authenticate", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
    }

    static sendLogout() {
        return fetch("https://campus.csbe.ch./uek294/api/v1/unauthenticate", {
            method: "POST",
            credentials: "include"
        });
    }

    static getCategories() {
        return fetch("https://campus.csbe.ch/uek294/api/v1/categories", {
            method: "GET",
            credentials: "include"
        });
    }

    static createCategory(active, name) {
        return fetch("https://campus.csbe.ch/uek294/api/v1/category", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                active: active,
                name: name
            })
        });
    }

    static getCategory(categoryId) {
        return fetch("https://campus.csbe.ch/uek294/api/v1/category/" + encodeURIComponent(categoryId), {
            method: "GET",
            credentials: "include"
        });
    }

    static updateCategory(categoryId, active, name) {
        return fetch("https://campus.csbe.ch/uek294/api/v1/category/" + encodeURIComponent(categoryId), {
            method: "PATCH",
            credentials: "include",
            body: JSON.stringify({
                active: active,
                name: name
            })
        });
    }

    static deleteCategory(categoryId) {
        return fetch("https://campus.csbe.ch/uek294/api/v1/category/" + encodeURIComponent(categoryId), {
            method: "DELETE",
            credentials: "include"
        });
    }

    static getProducts() {
        return fetch("https://campus.csbe.ch/uek294/api/v1/products", {
            method: "GET",
            credentials: "include"
        });
    }

    static getProduct(sku) {
        return fetch("https://campus.csbe.ch/uek294/api/v1/product/" + encodeURIComponent(sku), {
            method: "GET",
            credentials: "include"
        });
    }

    static getProduct(sku, active, id_category, name, image, description, price, stock) {
        return fetch("https://campus.csbe.ch/uek294/api/v1/product/" + encodeURIComponent(sku), {
            method: "PUT",
            credentials: "include",
            body: JSON.stringify({
                active: active,
                id_category: id_category,
                name: name,
                image: image,
                description: description,
                price: price,
                stock: stock
            })
        });
    }

    static deleteProduct(sku) {
        return fetch("https://campus.csbe.ch/uek294/api/v1/product/" + encodeURIComponent(sku), {
            method: "DELETE",
            credentials: "include"
        });
    }
}