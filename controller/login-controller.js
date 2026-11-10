/**
 * Verarbeitet die Anmeldung und öffnet nach Erfolg die Produktseite.
 */
class LoginController {
  /**
   * Verhindert das normale Absenden und startet die Anmeldung.
   * @param {SubmitEvent} event Das Absendeereignis des Formulars.
   */
  static onSubmit(event) {
    event.preventDefault();
    LoginController.sendLogin();
    document.body.classList.add("loading");
  }

  /**
   * Zeigt die Fehlermeldung aus der API-Antwort an.
   * @param {Response} response Die Antwort auf den Anmeldeversuch.
   */
  static async loginFailedAlert(response) {
    const errorData = await response.json();
    alert(response.status + ": " + errorData.error_message);
  }

  /**
   * Liest die Zugangsdaten aus dem Formular und meldet den Benutzer an.
   */
  static async sendLogin() {
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    try {
      const response = await ApiModel.sendLogin(username, password);

      if (!response.ok) {
        document.body.classList.remove("loading");
        await LoginController.loginFailedAlert(response);
        return;
      }

      LoginController.loginSuccessfully();
    } catch (error) {
      console.error(error.message);
    }
  }

  /**
   * Leitet nach erfolgreicher Anmeldung zur Produktliste weiter.
   */
  static loginSuccessfully() {
    window.location.href = "/view/products.php";
  }
}