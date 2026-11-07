class LoginController {
  static onSubmit(event) {
    event.preventDefault();
    LoginController.sendLogin();
  }

  static async loginFailedAlert(response) {
    const errorData = await response.json();
    alert(response.status + ": " + errorData.error_message);
  }

  static async sendLogin() {
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    try {
      const response = await ApiModel.sendLogin(username, password);

      if (!response.ok) {
        return LoginController.loginFailedAlert(response);
      }

      console.log("Login successful");
    } catch (error) {
      console.error(error.message);
    }
  }
}