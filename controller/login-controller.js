class LoginController {
  static onSubmit(event) {
    event.preventDefault();
    LoginController.sendLogin();
    document.body.classList.add("loading");
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
        document.body.classList.remove("loading");
        await LoginController.loginFailedAlert(response);
        return;
      }

      LoginController.loginSuccessfully();
    } catch (error) {
      console.error(error.message);
    }
  }

  static loginSuccessfully() {
    window.location.href = "/view/products.php";
  }
}