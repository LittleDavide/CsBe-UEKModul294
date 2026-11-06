class LoginController {
  static handleSubmit(event) {
    event.preventDefault();
    LoginController.sendLogin();
  }

  static async loginFailedAlert(response) {
    let errorData = await response.json();
    alert(response.status + ": " + errorData.error_message);
  }

  static async sendLogin() {
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;

    try {
      let response = await ApiModel.sendLogin(username, password);

      if (!response.ok) {
        return LoginController.loginFailedAlert(response);
      }

      console.log("Login successful");
    } catch (error) {
      console.error(error.message);
    }
  }
}

document
  .querySelector("#login-form")
  .addEventListener("submit", LoginController.handleSubmit);
