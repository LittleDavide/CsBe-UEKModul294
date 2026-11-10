<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CsBe ★ <?= $page_title ?></title>
    <link rel="stylesheet" type="text/css" href="/view/stylesheets/style.css">
    <script src="/model/api-model.js" defer></script>
    <script src="/view/loading-cursor.js" defer></script>
    <script src="/controller/login-controller.js" defer></script>
    <?php if (!empty($page_controller_path)): ?>
        <script defer src="<?= $page_controller_path ?>"></script>
    <?php endif; ?>
</head>
<body>
    <main>