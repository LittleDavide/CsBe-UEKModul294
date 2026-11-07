class ProductsController {
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
        }
    }
}

ProductsController.getAllProducts();