package com.huang.exception;

import com.huang.utils.Result;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    public Result<Object> handleException(Exception e) {
        return Result.error(StringUtils.hasLength(e.getMessage()) ? e.getMessage() : "Invalid operation.");
    }
}
