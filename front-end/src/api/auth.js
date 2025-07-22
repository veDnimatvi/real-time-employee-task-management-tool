import request from "../utils/request";

export function loginApi(data) {
  return request({
    url: "/auth/login",
    method: "post",
    data,
  });
}

export function loginNumberApi(data) {
  return request({
    url: "/auth/login-phone-number",
    method: "post",
    data,
  });
}

export function createAccessCodeSms(data) {
  return request({
    url: "/auth/create-access-code",
    method: "post",
    data,
  });
}

export function validateAccessCodeSms(data) {
  return request({
    url: "/auth/validate-access-code",
    method: "post",
    data,
  });
}
export function createAccessCodeEmail(data) {
  return request({
    url: "/auth/create-access-email",
    method: "post",
    data,
  });
}
export function validateAccessCodeEmail(data) {
  return request({
    url: "/auth/validate-access-email",
    method: "post",
    data,
  });
}
export function registerForEmployee(data) {
  return request({
    url: "/auth/register-employee",
    method: "post",
    data,
  });
}

export default { loginApi, createAccessCodeSms };
