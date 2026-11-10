/**
 * Steuert die Anmeldung, die Abmeldung und die Weiterleitung.
 */
class LoginController {
  /**
   * Verhindert das normale Absenden und startet die Anmeldung.
   * @param {SubmitEvent} event Das Absendeereignis des Formulars.
   */
  static onSubmit(event) {
    event.preventDefault();
    LoginController.sendLogin();
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

    LoadingCursor.start();
    try {
      const response = await ApiModel.sendLogin(username, password);

      if (!response.ok) {
        await LoginController.loginFailedAlert(response);
        return;
      }

      LoginController.loginSuccessfully();
    } catch (error) {
      console.error(error.message);
    } finally {
      LoadingCursor.stop();
    }
  }

  /**
   * Leitet nach erfolgreicher Anmeldung zur Produktliste weiter.
   */
  static loginSuccessfully() {
    window.location.href = "/view/products.php";
  }

  /**
   * Ruft die Abmeldung bei der API auf und öffnet danach die Anmeldung.
   */
  static async logout() {
    LoadingCursor.start();
    try {
      const response = await ApiModel.sendLogout();

      if (!response.ok) {
        console.error("Abmeldung fehlgeschlagen:", response.status);
      }
    } catch (error) {
      console.error("Abmeldung fehlgeschlagen:", error.message);
    } finally {
      LoadingCursor.stop();
      window.location.href = "/index.php";
    }
  }
}