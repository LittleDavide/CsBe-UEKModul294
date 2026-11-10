<h1>Anmeldung</h1>
<!-- Der Login-Controller sendet die Zugangsdaten beim Absenden an die API. -->
<form id="login-form" onsubmit="LoginController.onSubmit(event)">
    <label>Benutzername: </label><br>
    <input required id="username" name="username" type="text" placeholder="Benutzernamen eingeben"><br>
    <label>Passwort: </label><br>
    <input required id="password" name="password" type="password" placeholder="Passwort eingeben"><br>
    <p>
        <button>Anmelden</button>
    </p>
</form>
