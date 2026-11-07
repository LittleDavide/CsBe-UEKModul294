class ProductsController {
    static onSubmit(event) {
        event.preventDefault();
        ProductsController.createOrUpdateProduct();
    }

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

    static loadTable(products) {
        const productList = document.querySelector("#product-list");

        //cleared productList
        productList.replaceChildren();

        for (let product of products) {
            const row = productList.insertRow();

            row.insertCell().textContent = product.sku;
            row.insertCell().textContent = product.name;
            row.insertCell().textContent = product.id_category;
            row.insertCell().textContent = product.price;
            row.insertCell().textContent = product.stock;

            // Bearbeitungs Button und Löschen Button
            const actionCell = row.insertCell();

            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.textContent = "Bearbeiten";
            editButton.onclick = () => ProductsController.openUpdateProductDialog(product.sku);

            // confs für delete button
            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.textContent = "Löschen";
            deleteButton.onclick = () => ProductsController.handleDelete(product.sku);

            actionCell.append(editButton, " ", deleteButton);
        }
    }

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

    static async openUpdateProductDialog(sku) {
        try {
            const productResponse = await ApiModel.getProduct(sku);
            const categoriesResponse = await ApiModel.getCategories();

            if (productResponse.ok && categoriesResponse.ok) {
                const product = await productResponse.json();
                const categories = await categoriesResponse.json();

                // holt die einzelne elemente
                const fields = document.querySelector("#product-form").elements;
                // leert den Options auswahl von category
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

                // prüft obs aktiv ist oder nicht 
                fields.active.checked = Number(product.active) === 1;

                const dialog = document.querySelector("#create-or-update-product-dialog");
                dialog.querySelector("h2").textContent = "Produkt bearbeiten";
                dialog.showModal();
            } else if (productResponse.status === 401 || categoriesResponse.status === 401) {
                alert("Bitte erneut anmelden");
                window.location.href = "/index.php";
            } else {
                console.error("Could not load product or categories:", productResponse.status, categoriesResponse.status);
            }
        } catch (error) {
            console.error("Could not load product or categories:", error.message);
        }
    }


    static async openCreateProductDialog() {
        // open Dialog view with loaded categories for the dropdown menü
        try {
            const response = await ApiModel.getCategories();

            if (response.ok) {
                const categories = await response.json();
                const categorySelect = document.querySelector("#product-category");

                // neues Option objekt
                categorySelect.replaceChildren(new Option("Bitte Kategorie wählen", ""));

                for (const category of categories) {
                    categorySelect.add(new Option(category.name, category.category_id));
                }

                const form = document.querySelector("#product-form");
                const dialog = document.querySelector("#create-or-update-product-dialog");

                // Reset den Form und setzt die benötigte Titeln und Regeln richtig
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

    static async createOrUpdateProduct() {
        const sku = document.querySelector("#product-sku").value;
        const name = document.querySelector("#product-name").value;
        const id_category = Number(document.querySelector("#product-category").value);
        const image = document.querySelector("#product-image").value;
        const description = document.querySelector("#product-description").value;
        const price = Number(document.querySelector("#product-price").value);
        const stock = Number(document.querySelector("#product-stock").value);
        // 1 = active / 0 = deactive
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