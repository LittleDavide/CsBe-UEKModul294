<?php $page_title = "products"; ?>
<?php $page_controller_path = "/controller/products-controller.js"; ?>
<?php require "blocks/header.php"; ?>

<h1>Produkte</h1>

<button id="create-product-button" type="button" onclick="window.location.href = '/view/categories.php'">Kategorien öffnen</button>

<table border="1" cellspacing="0" cellpadding="5" class="product-table">
    <thead>
        <tr>
            <th scope="col">Artikelnummer (SKU)</th>
            <th scope="col">Name</th>
            <th scope="col">Kategorie</th>
            <th scope="col">Preis (CHF)</th>
            <th scope="col">Bestand</th>
            <th scope="col">Aktionen</th>
        </tr>
    </thead>
    <!-- Der Produkt-Controller füllt die Tabellenzeilen mit den geladenen Produkten. -->
    <tbody id="product-list"></tbody>
</table>
<br>
<button id="create-product-button" type="button" onclick="ProductsController.openCreateProductDialog()">Neuen Produkt erstellen</button>


<!-- Gemeinsames Formular für neue und bestehende Produkte. -->
<dialog id="create-or-update-product-dialog">
    <h2>Produkt erstellen</h2>

    <form id="product-form" onsubmit="CategoriesController.onSubmit(event)">
        <label for="product-sku">Artikelnummer (SKU)</label><br>
        <input id="product-sku" name="sku" type="text" required><br>

        <label for="product-name">Produktname</label><br>
        <input id="product-name" name="name" type="text" required><br>

        <label for="product-category">Kategorie</label><br>
        <!-- Der Controller ergänzt die Kategorien beim Öffnen des Dialogs. -->
        <select id="product-category" name="id_category" required>
            <option value="">Bitte Kategorie wählen</option>
        </select><br>

        <label for="product-image">Bild-URL</label><br>
        <input id="product-image" name="image" type="url" required><br>

        <label for="product-description">Beschreibung</label><br>
        <textarea id="product-description" name="description" required></textarea><br>

        <label for="product-price">Preis (CHF)</label><br>
        <input id="product-price" name="price" type="number" min="0" step="0.01" required><br>

        <label for="product-stock">Bestand</label><br>
        <input id="product-stock" name="stock" type="number" min="0" step="1" required><br>

        <input id="product-active" name="active" type="checkbox" checked>
        <label for="product-active">Aktiv</label><br><br>

        <button type="submit" value="save">Speichern</button>
    </form>
</dialog>

<?php require "blocks/footer.php"; ?>