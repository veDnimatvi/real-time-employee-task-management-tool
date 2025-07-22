import request from "../utils/request";

export function getMessage(id) {
  return request({
    url: "/messages/" + id,
    method: "get",
  });
}

export function apiSendMessage(data) {
  return request({
    url: "/messages",
    method: "post",
    data,
  });
}
