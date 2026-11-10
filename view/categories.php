<?php $page_title = "products"; ?>
<?php $page_controller_path = "/controller/categories-controller.js"; ?>
<?php require "blocks/header.php"; ?>

<h1>Categories</h1>

<button type="button" onclick="LoginController.logout()">Abmelden</button>
<button type="button" onclick="window.location.href = '/view/products.php'">Zurück zu Produkten</button>

<table border="1" cellspacing="0" cellpadding="5" class="category-table">
    <thead>
        <tr>
            <th scope="col">Kategorie ID</th>
            <th scope="col">Name</th>
            <th scope="col">Aktiv</th>
            <th scope="col">Aktionen</th>
        </tr>
    </thead>
    <!-- Der Kategorie-Controller ergänzt die geladenen Kategorien und ihre Aktionen. -->
    <tbody id="category-list"></tbody>
</table>
<br>
<button id="create-category-button" type="button" onclick="CategoriesController.openCreateCategoryDialog()">Neuen
    Produkt erstellen</button>

<!-- Gemeinsamer Dialog zum Erstellen und Bearbeiten von Kategorien. -->
<dialog id="create-or-update-category-dialog">
    <h2>Produkt erstellen</h2>

    <form id="category-form" onsubmit="CategoriesController.onSubmit(event)">
        <label for="category-id">Kategorie-ID</label><br>
        <input id="category-id" name="category_id" type="text" placeholder="Wird automatisch vergeben" readonly><br>

        <label for="category-name">Name</label><br>
        <input id="category-name" name="name" type="text" maxlength="500" placeholder="z. B. Getränke" required><br>

        <input id="category-active" name="active" type="checkbox" checked>
        <label for="category-active">Aktiv</label><br><br>

        <button type="submit" value="save">Speichern</button>
    </form>
</dialog>

<?php require "blocks/footer.php"; ?>