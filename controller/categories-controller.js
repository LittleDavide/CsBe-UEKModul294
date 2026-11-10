class CategoriesController {
    static onSubmit(event) {
        event.preventDefault();

        // rausholen der category id um zu referenzieren obs ein update oder create ist
        const form = event.currentTarget;
        const categoryId = form.elements.category_id.value;

        if (categoryId) {
            CategoriesController.updateCategory();
        } else {
            CategoriesController.createCategory();
        }
    }

    static getProductFromPermaLink() {
        const categoryId = new URLSearchParams(window.location.search).get("id");

        if (categoryId) {
            CategoriesController.openUpdateCategoryDialog(categoryId);
        }
    }

    static async getAllCategories() {
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
        }
    }

    static loadTable(categories) {
        const categoryList = document.querySelector("#category-list");

        // Entfernt alte Zeilen, damit die Liste beim Nachladen keine Duplikate enthält.
        categoryList.replaceChildren();

        for (let category of categories) {
            const row = categoryList.insertRow();

            row.insertCell().textContent = category.category_id;
            row.insertCell().textContent = category.name;
            row.insertCell().textContent = Number(category.active) === 1 ? "Ja" : "Nein";

            // Bündelt die Aktionen für das jeweilige Produkt in einer Zelle.
            const actionCell = row.insertCell();

            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.textContent = "Bearbeiten";
            editButton.onclick = () => CategoriesController.openUpdateCategoryDialog(category.category_id);

            // Der Löschbutton übergibt die SKU aus dieser Zeile.
            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.textContent = "Löschen";
            deleteButton.onclick = () => CategoriesController.handleDelete(category.category_id);

            actionCell.append(editButton, " ", deleteButton);

            // Die SKU in der URL macht das Produkt direkt aufrufbar.
            const categoryLink = document.createElement("a");
            categoryLink.textContent = "Produkt Detail öffnen";
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

    static openCreateCategoryDialog() {
        // Lädt die Kategorien vor dem Öffnen des Dialogs.
        const form = document.querySelector("#category-form");
        const dialog = document.querySelector("#create-or-update-category-dialog");

        // Setzt Formular und SKU-Feld nach einer Bearbeitung zurück.
        form.reset();
        dialog.querySelector("h2").textContent = "Category erstellen";
        dialog.showModal();
    }

    static async openUpdateCategoryDialog(category_id) {
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

                // Greift über die Feldnamen auf das gemeinsame Produktformular zu.
                const fields = document.querySelector("#category-form").elements;

                fields.category_id.value = category.category_id;
                fields.name.value = category.name;

                // Die API liefert den Aktivstatus als 0 oder 1.
                fields.active.checked = Number(category.active) === 1;

                const dialog = document.querySelector("#create-or-update-category-dialog");
                dialog.querySelector("h2").textContent = "Produkt bearbeiten";
                dialog.showModal();
            } else {
                console.error("Could not load product or categories:", response.status, categoriesResponse.status);
            }
        } catch (error) {
            console.error("Could not load product or categories:", error.message);
        }
    }

    static async updateCategory() {
        const category_id = Number(document.querySelector("#category-id").value);
        const name = document.querySelector("#category-name").value;
        // Sendet den Zustand der Checkbox als Zahl an die API.
        const active = document.querySelector("#category-active").checked ? 1 : 0;

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
        }
    }

    static async createCategory() {
        const name = document.querySelector("#category-name").value;
        // Sendet den Zustand der Checkbox als Zahl an die API.
        const active = document.querySelector("#category-active").checked ? 1 : 0;

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
        }
    }

    static async handleDelete(category_id) {
        if (confirm("Produkt wirklich löschen? " + category_id)) {
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
            }
        }
    }
}

CategoriesController.getAllCategories();