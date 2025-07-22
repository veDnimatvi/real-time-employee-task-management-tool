import request from "../utils/request";

export function getUser() {
  return request({
    url: "/users",
    method: "get",
  });
}

export function getAllUser() {
  return request({
    url: "/all-users",
    method: "get",
  });
}

export function createUser(data) {
  return request({
    url: "/users",
    method: "post",
    data,
  });
}

export function updateUser(data, id) {
  return request({
    url: "/users/" + id,
    method: "put",
    data,
  });
}

export function deleteUser(id) {
  return request({
    url: "/users/" + id,
    method: "delete",
  });
}
