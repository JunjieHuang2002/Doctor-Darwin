package com.huang.utils;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Result<T> {
    T data;
    int code;
    String msg;

    private Result() {
    }

    public static <T> Result<T> success() {
        return new Result<>(null, 200, "");
    }

    public static <T> Result<T> success(T data) {
        return new Result<>(data, 200, "");
    }

    public static <T> Result<T> fail(String msg) {
        return new Result<>(null, 400, msg);
    }

    public static <T> Result<T> error(String msg) {
        return new Result<>(null, 500, msg);
    }
}
