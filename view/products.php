<?php $page_title = "products"; ?>
<?php $page_controller_path = "/controller/products-controller.js"; ?>
<?php require "blocks/header.php"; ?>

<h1>Produkte</h1>

<table border="1" cellspacing="0" cellpadding="5">
    <thead>
        <tr>
            <th scope="col">Artikelnummer (SKU)</th>
            <th scope="col">Name</th>
            <th scope="col">Kategorie</th>
            <th scope="col">Preis (CHF)</th>
            <th scope="col">Bestand</th>
        </tr>
    </thead>
    <tbody id="product-list"></tbody>
</table>

<?php require "blocks/footer.php"; ?>