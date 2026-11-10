/**
 * Steuert die Kategorienliste und die Dialoge zum Erstellen und Bearbeiten.
 */
class CategoriesController {
    /**
     * Wählt anhand der Kategorie-ID zwischen Erstellen und Aktualisieren.
     * @param {SubmitEvent} event Das Absendeereignis des Kategorieformulars.
     */
    static onSubmit(event) {
        event.preventDefault();

        // Eine leere ID kennzeichnet eine neue Kategorie.
        const form = event.currentTarget;
        const categoryId = form.elements.category_id.value;

        if (categoryId) {
            CategoriesController.updateCategory();
        } else {
            CategoriesController.createCategory();
        }
    }

    /**
     * Öffnet die Kategorie, deren ID in der URL steht.
     */
    static getProductFromPermaLink() {
        const categoryId = new URLSearchParams(window.location.search).get("id");

        if (categoryId) {
            CategoriesController.openUpdateCategoryDialog(categoryId);
        }
    }

    /**
     * Lädt alle Kategorien von der API und aktualisiert die Tabelle.
     */
    static async getAllCategories() {
        LoadingCursor.start();
        try {
            let response = await ApiModel.getCategories();

            if (response.status === 401) {
                alert("Bitte erneut anmelden");
                window.location.href = "/index.php";
            } else if (response.ok) {
                const categories = await response.json();
                CategoriesController.loadTable(categories);
            } else {
                console.error("Could not load products: ", response.status);
            }
        } catch (error) {
            console.error("Could not load products: ", error.message);
        } finally {
            LoadingCursor.stop();
        }
    }

    /**
     * Erstellt die Tabellenzeilen mit Aktionen und Permalinks.
     * @param {object[]} categories Die anzuzeigenden Kategorien.
     */
    static loadTable(categories) {
        const categoryList = document.querySelector("#category-list");

        // Entfernt alte Zeilen, damit die Liste beim Nachladen keine Duplikate enthält.
        categoryList.replaceChildren();

        for (let category of categories) {
            const row = categoryList.insertRow();

            row.insertCell().textContent = category.category_id;
            row.insertCell().textContent = category.name;
            row.insertCell().textContent = Number(category.active) === 1 ? "Ja" : "Nein";

            // Bündelt die Aktionen für die jeweilige Kategorie in einer Zelle.
            const actionCell = row.insertCell();

            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.textContent = "Bearbeiten";
            editButton.onclick = () => CategoriesController.openUpdateCategoryDialog(category.category_id);

            // Der Löschbutton übergibt die Kategorie-ID aus dieser Zeile.
            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.textContent = "Löschen";
            deleteButton.onclick = () => CategoriesController.handleDelete(category.category_id);

            actionCell.append(editButton, " ", deleteButton);

            // Die Kategorie-ID in der URL macht den Datensatz direkt aufrufbar.
            const categoryLink = document.createElement("a");
            categoryLink.textContent = "Kategoriedetails öffnen";
            categoryLink.href = "/view/categories.php?id=" + encodeURIComponent(category.category_id);

            // Aktualisiert die Adressleiste, ohne die Seite neu zu laden.
            categoryLink.onclick = () => {
                history.replaceState(null, "", categoryLink.href);
                CategoriesController.getProductFromPermaLink();
                return false;
            };

            actionCell.append(" ", categoryLink)
        }
    }

    /**
     * Setzt das Formular zurück und öffnet es zum Erstellen einer Kategorie.
     */
    static openCreateCategoryDialog() {
        const form = document.querySelector("#category-form");
        const dialog = document.querySelector("#create-or-update-category-dialog");

        // Leert auch die ID, damit der nächste Submit eine Kategorie erstellt.
        form.reset();
        dialog.querySelector("h2").textContent = "Kategorie erstellen";
        dialog.showModal();
    }

    /**
     * Lädt eine Kategorie und setzt ihre Werte ins Bearbeitungsformular.
     * @param {number|string} category_id Die ID der Kategorie.
     */
    static async openUpdateCategoryDialog(category_id) {
        LoadingCursor.start();
        try {
            const response = await ApiModel.getCategory(category_id);

            if (response.status === 401) {
                alert("Bitte erneut anmelden");
                window.location.href = "/index.php";
            } else if (response.status === 500) {
                console.error("Could not create or update category");
            } else if (response.status === 404) {
                alert("Category not Found");
                await this.getAllCategories();
            } else if (response.ok) {
                const category = await response.json();

                // Greift über die Feldnamen auf das gemeinsame Kategorieformular zu.
                const fields = document.querySelector("#category-form").elements;

                fields.category_id.value = category.category_id;
                fields.name.value = category.name;

                // Die API liefert den Aktivstatus als 0 oder 1.
                fields.active.checked = Number(category.active) === 1;

                const dialog = document.querySelector("#create-or-update-category-dialog");
                dialog.querySelector("h2").textContent = "Kategorie bearbeiten";
                dialog.showModal();
            } else {
                console.error("Could not load product or categories:", response.status);
            }
        } catch (error) {
            console.error("Could not load product or categories:", error.message);
        } finally {
            LoadingCursor.stop();
        }
    }

    /**
     * Speichert die Änderungen und aktualisiert danach die Kategorienliste.
     */
    static async updateCategory() {
        const category_id = Number(document.querySelector("#category-id").value);
        const name = document.querySelector("#category-name").value;
        // Sendet den Zustand der Checkbox als Zahl an die API.
        const active = document.querySelector("#category-active").checked ? 1 : 0;

        LoadingCursor.start();
        try {
            let response = await ApiModel.updateCategory(category_id, active, name);

            if (response.status === 401) {
                alert("Bitte erneut anmelden");
                window.location.href = "/index.php";
            } else if (response.status === 404) {
                alert("Category not Found");
                await CategoriesController.getAllCategories();
            } else if (response.status === 204) {
                alert("Erfolreich updatet");

                document.querySelector("#create-or-update-category-dialog").close();
                await CategoriesController.getAllCategories();
            } else if (response.status === 400) {
                const errorData = await response.json();
                alert("Falsche validation: " + errorData.error_message);
            } else {
                console.error("Could not create or update product: ", response.status);
            }
        } catch (error) {
            console.error("Could not load products: ", error.message);
        } finally {
            LoadingCursor.stop();
        }
    }

    /**
     * Erstellt eine Kategorie mit den Formularwerten und lädt die Liste neu.
     */
    static async createCategory() {
        const name = document.querySelector("#category-name").value;
        // Sendet den Zustand der Checkbox als Zahl an die API.
        const active = document.querySelector("#category-active").checked ? 1 : 0;

        LoadingCursor.start();
        try {
            let response = await ApiModel.createCategory(active, name);

            if (response.status === 401) {
                alert("Bitte erneut anmelden");
                window.location.href = "/index.php";
            } else if (response.status === 201) {
                alert("Erfolreich erstellt");

                document.querySelector("#create-or-update-category-dialog").close();
                await CategoriesController.getAllCategories();
            } else if (response.status === 400) {
                const errorData = await response.json();
                alert("Falsche validation: " + errorData.error_message);
            } else {
                console.error("Could not create or update product: ", response.status);
            }
        } catch (error) {
            console.error("Could not load products: ", error.message);
        } finally {
            LoadingCursor.stop();
        }
    }

    /**
     * Fragt vor dem Löschen nach und lädt die Liste nach Erfolg neu.
     * @param {number|string} category_id Die ID der zu löschenden Kategorie.
     */
    static async handleDelete(category_id) {
        if (confirm("Kategorie wirklich löschen? " + category_id)) {
            LoadingCursor.start();
            try {
                const response = await ApiModel.deleteCategory(category_id);

                if (response.ok) {
                    alert("Erfolgreich gelöscht");
                    await CategoriesController.getAllCategories();
                } else if (response.status === 401) {
                    alert("Bitte erneut anmelden");
                    window.location.href = "/index.php";
                } else if (response.status === 404) {
                    alert("Category wurde nicht gefunden");
                } else {
                    console.error("Could not create or update product: ", response.status);
                }
            } catch (error) {
                console.error("Could not load products: ", error.message);
            } finally {
                LoadingCursor.stop();
            }
        }
    }
}

CategoriesController.getAllCategories();
CategoriesController.getProductFromPermaLink();