class ApiModel {
    static sendLogin(username, password) {
        return fetch("https://campus.csbe.ch/uek294/api/v1/authenticate", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
    }

    static sendLogout() {
        return fetch("https://campus.csbe.ch./uek294/api/v1/unauthenticate", {
            method: "POST",
            credentials: "include"
        });
    }
}