/**
 * Steuert die Produktliste und die Dialoge zum Erstellen und Bearbeiten.
 */
class ProductsController {
    /**
     * Startet das Speichern des Produktformulars.
     * @param {SubmitEvent} event Das Absendeereignis des Formulars.
     */
    static onSubmit(event) {
        event.preventDefault();
        ProductsController.createOrUpdateProduct();
    }

    /**
     * Öffnet das Produkt, dessen SKU in der URL steht.
     */
    static getProductFromPermaLink() {
        const sku = new URLSearchParams(window.location.search).get("sku");

        if (sku) {
            ProductsController.openUpdateProductDialog(sku);
        }
    }

    /**
     * Lädt die Produkte von der API und aktualisiert die Tabelle.
     */
    static async getAllProducts() {
        try {
            let response = await ApiModel.getProducts();

            if (response.status === 401) {
                alert("Bitte erneut anmelden");
                window.location.href = "/index.php";
            } else if (response.ok) {
                const products = await response.json();
                ProductsController.loadTable(products);
            } else {
                console.error("Could not load products: ", response.status);
            }
        } catch (error) {
            console.error("Could not load products: ", error.message);
        }
    }

    /**
     * Erstellt die Tabellenzeilen mit Aktionen und Permalinks.
     * @param {object[]} products Die anzuzeigenden Produkte.
     */
    static loadTable(products) {
        const productList = document.querySelector("#product-list");

        // Entfernt alte Zeilen, damit die Liste beim Nachladen keine Duplikate enthält.
        productList.replaceChildren();

        for (let product of products) {
            const row = productList.insertRow();

            row.insertCell().textContent = product.sku;
            row.insertCell().textContent = product.name;
            row.insertCell().textContent = product.id_category;
            row.insertCell().textContent = product.price;
            row.insertCell().textContent = product.stock;

            // Bündelt die Aktionen für das jeweilige Produkt in einer Zelle.
            const actionCell = row.insertCell();

            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.textContent = "Bearbeiten";
            editButton.onclick = () => ProductsController.openUpdateProductDialog(product.sku);

            // Der Löschbutton übergibt die SKU aus dieser Zeile.
            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.textContent = "Löschen";
            deleteButton.onclick = () => ProductsController.handleDelete(product.sku);

            actionCell.append(editButton, " ", deleteButton);

            // Die SKU in der URL macht das Produkt direkt aufrufbar.
            const productLink = document.createElement("a");
            productLink.textContent = "Produkt Detail öffnen";
            productLink.href = "/view/products.php?sku=" + encodeURIComponent(product.sku);

            // Aktualisiert die Adressleiste, ohne die Seite neu zu laden.
            productLink.onclick = () => {
                history.replaceState(null, "", productLink.href);
                ProductsController.getProductFromPermaLink();
                return false;
            };

            actionCell.append(" ", productLink)

        }
    }

    /**
     * Fragt vor dem Löschen nach und lädt die Liste nach Erfolg neu.
     * @param {string} sku Die Artikelnummer des Produkts.
     */
    static async handleDelete(sku) {
        if (confirm("Produkt wirklich löschen? " + sku)) {
            try {
                const response = await ApiModel.deleteProduct(sku);

                if (response.ok) {
                    alert("Erfolgreich gelöscht");
                    await ProductsController.getAllProducts();
                } else if (response.status === 401) {
                    alert("Bitte erneut anmelden");
                    window.location.href = "/index.php";
                } else if (response.status === 404) {
                    alert("Die SKU " + sku + " wurde nicht gefunden");
                } else {
                    console.error("Could not create or update product: ", response.status);
                }
            } catch (error) {
                console.error("Could not load products: ", error.message);
            }
        }
    }

    /**
     * Lädt Produkt und Kategorien und füllt das Bearbeitungsformular.
     * @param {string} sku Die Artikelnummer des Produkts.
     */
    static async openUpdateProductDialog(sku) {
        try {
            const productResponse = await ApiModel.getProduct(sku);
            const categoriesResponse = await ApiModel.getCategories();

            if (productResponse.status === 401 || categoriesResponse.status === 401) {
                alert("Bitte erneut anmelden");
                window.location.href = "/index.php";
            } else if (productResponse.status === 500 || categoriesResponse.status === 500) {
                console.error("Could not create or update product");
            } else if (productResponse.status === 404) {
                alert("Product not Found");
                await this.getAllProducts();
            } else if (productResponse.ok && categoriesResponse.ok) {
                const product = await productResponse.json();
                const categories = await categoriesResponse.json();

                // Greift über die Feldnamen auf das gemeinsame Produktformular zu.
                const fields = document.querySelector("#product-form").elements;
                // Entfernt die Kategorien der vorherigen Dialogöffnung.
                fields.id_category.replaceChildren();

                for (const category of categories) {
                    fields.id_category.add(new Option(category.name, category.category_id));
                }

                fields.sku.value = product.sku;
                fields.sku.readOnly = true;

                fields.name.value = product.name;
                fields.id_category.value = product.id_category;
                fields.image.value = product.image;
                fields.description.value = product.description;
                fields.price.value = product.price;
                fields.stock.value = product.stock;

                // Die API liefert den Aktivstatus als 0 oder 1.
                fields.active.checked = Number(product.active) === 1;

                const dialog = document.querySelector("#create-or-update-product-dialog");
                dialog.querySelector("h2").textContent = "Produkt bearbeiten";
                dialog.showModal();
            } else {
                console.error("Could not load product or categories:", productResponse.status, categoriesResponse.status);
            }
        } catch (error) {
            console.error("Could not load product or categories:", error.message);
        }
    }


    /**
     * Lädt die Kategorien und öffnet ein leeres Produktformular.
     */
    static async openCreateProductDialog() {
        // Lädt die Kategorien vor dem Öffnen des Dialogs.
        try {
            const response = await ApiModel.getCategories();

            if (response.ok) {
                const categories = await response.json();
                const categorySelect = document.querySelector("#product-category");

                // Setzt die Auswahl zurück und verhindert doppelte Einträge.
                categorySelect.replaceChildren(new Option("Bitte Kategorie wählen", ""));

                for (const category of categories) {
                    categorySelect.add(new Option(category.name, category.category_id));
                }

                const form = document.querySelector("#product-form");
                const dialog = document.querySelector("#create-or-update-product-dialog");

                // Setzt Formular und SKU-Feld nach einer Bearbeitung zurück.
                form.reset();
                form.elements.sku.readOnly = false;
                dialog.querySelector("h2").textContent = "Produkt erstellen";
                dialog.showModal();
            } else if (response.status === 401) {
                alert("Bitte erneut anmelden");
                window.location.href = "/index.php";
            } else {
                console.error("Could not create or update product: ", response.status);
            }
        } catch (error) {
            console.error("Could not load categories: ", error.message);
        }
    }

    /**
     * Übermittelt die Formularwerte und aktualisiert die Liste nach dem Speichern.
     */
    static async createOrUpdateProduct() {
        const sku = document.querySelector("#product-sku").value;
        const name = document.querySelector("#product-name").value;
        const id_category = Number(document.querySelector("#product-category").value);
        const image = document.querySelector("#product-image").value;
        const description = document.querySelector("#product-description").value;
        const price = Number(document.querySelector("#product-price").value);
        const stock = Number(document.querySelector("#product-stock").value);
        // Sendet den Zustand der Checkbox als Zahl an die API.
        const active = document.querySelector("#product-active").checked ? 1 : 0;

        try {
            let response = await ApiModel.createOrUpdateProduct(sku, active, id_category, name, image, description, price, stock);

            if (response.status === 401) {
                alert("Bitte erneut anmelden");
                window.location.href = "/index.php";
            } else if (response.status === 201) {
                alert("Erfolreich erstellt");

                document.querySelector("#create-or-update-product-dialog").close();
                await ProductsController.getAllProducts();
            } else if (response.status === 204) {
                alert("Erfolgreich updatet");

                document.querySelector("#create-or-update-product-dialog").close();
                await ProductsController.getAllProducts();
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
}

ProductsController.getAllProducts();
ProductsController.getProductFromPermaLink();