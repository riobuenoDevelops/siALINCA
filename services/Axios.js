const Axios = require("axios");

class AxiosService {
  static instance = Axios.create({
    baseURL: `http://localhost:3000/api/v1`,
    headers: { Authorization: "" },
  });

  static setAuthorizationToken(token) {
    this.instance.defaults.headers.common["Authorization"] = token;
  }
}

module.exports = AxiosService;
