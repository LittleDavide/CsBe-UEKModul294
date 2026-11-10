/**
 * Kapselt die Anfragen an die Shop-API.
 */
class ApiModel {
    /**
     * Sendet die Zugangsdaten zur Anmeldung.
     * @param {string} username Der Benutzername.
     * @param {string} password Das Passwort.
     * @returns {Promise<Response>} Die HTTP-Antwort der API.
     */
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

    /**
     * Sendet die Anfrage zum Abmelden.
     * @returns {Promise<Response>} Die HTTP-Antwort der API.
     */
    static sendLogout() {
        return fetch("https://campus.csbe.ch./uek294/api/v1/unauthenticate", {
            method: "POST",
            credentials: "include"
        });
    }

    /**
     * Fragt die Liste aller Kategorien ab.
     * @returns {Promise<Response>} Die HTTP-Antwort der API.
     */
    static getCategories() {
        return fetch("https://campus.csbe.ch/uek294/api/v1/categories", {
            method: "GET",
            credentials: "include"
        });
    }

    /**
     * Sendet die Daten für eine neue Kategorie.
     * @param {number} active Der Aktivstatus (1 oder 0).
     * @param {string} name Der Name der Kategorie.
     * @returns {Promise<Response>} Die HTTP-Antwort der API.
     */
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

    /**
     * Fragt eine Kategorie anhand ihrer ID ab.
     * @param {number|string} categoryId Die ID der Kategorie.
     * @returns {Promise<Response>} Die HTTP-Antwort der API.
     */
    static getCategory(categoryId) {
        return fetch("https://campus.csbe.ch/uek294/api/v1/category/" + encodeURIComponent(categoryId), {
            method: "GET",
            credentials: "include"
        });
    }

    /**
     * Sendet Änderungen an einer Kategorie.
     * @param {number|string} categoryId Die ID der Kategorie.
     * @param {number} active Der Aktivstatus (1 oder 0).
     * @param {string} name Der Name der Kategorie.
     * @returns {Promise<Response>} Die HTTP-Antwort der API.
     */
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

    /**
     * Fordert das Löschen einer Kategorie an.
     * @param {number|string} categoryId Die ID der Kategorie.
     * @returns {Promise<Response>} Die HTTP-Antwort der API.
     */
    static deleteCategory(categoryId) {
        return fetch("https://campus.csbe.ch/uek294/api/v1/category/" + encodeURIComponent(categoryId), {
            method: "DELETE",
            credentials: "include"
        });
    }

    /**
     * Fragt die Liste aller Produkte ab.
     * @returns {Promise<Response>} Die HTTP-Antwort der API.
     */
    static getProducts() {
        return fetch("https://campus.csbe.ch/uek294/api/v1/products", {
            method: "GET",
            credentials: "include"
        });
    }

    /**
     * Fragt ein Produkt anhand seiner SKU ab.
     * @param {string} sku Die Artikelnummer des Produkts.
     * @returns {Promise<Response>} Die HTTP-Antwort der API.
     */
    static getProduct(sku) {
        return fetch("https://campus.csbe.ch/uek294/api/v1/product/" + encodeURIComponent(sku), {
            method: "GET",
            credentials: "include"
        });
    }

    /**
     * Sendet die Produktdaten zum Erstellen oder Aktualisieren anhand der SKU.
     * @param {string} sku Die Artikelnummer des Produkts.
     * @param {number} active Der Aktivstatus (1 oder 0).
     * @param {number} id_category Die ID der zugeordneten Kategorie.
     * @param {string} name Der Produktname.
     * @param {string} image Die URL zum Produktbild.
     * @param {string} description Die Produktbeschreibung.
     * @param {number} price Der Preis in CHF.
     * @param {number} stock Die Anzahl an Lager.
     * @returns {Promise<Response>} Die HTTP-Antwort der API.
     */
    static createOrUpdateProduct(sku, active, id_category, name, image, description, price, stock) {
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

    /**
     * Fordert das Löschen eines Produkts an.
     * @param {string} sku Die Artikelnummer des Produkts.
     * @returns {Promise<Response>} Die HTTP-Antwort der API.
     */
    static deleteProduct(sku) {
        return fetch("https://campus.csbe.ch/uek294/api/v1/product/" + encodeURIComponent(sku), {
            method: "DELETE",
            credentials: "include"
        });
    }
}