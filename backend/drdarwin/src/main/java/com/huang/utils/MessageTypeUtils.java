package com.huang.utils;

import org.springframework.ai.chat.messages.*;

import java.util.List;

public class MessageTypeUtils {
    public static String translate2Role(MessageType type) {
        return switch (type) {
            case USER -> "user";
            case ASSISTANT -> "assistant";
            case SYSTEM -> "system";
            default -> "tool";
        };
    }

    public static Message messageCreator(String role, String content) {
        switch (role) {
            case "user" -> { return new UserMessage(content); }
            case "assistant" -> { return new AssistantMessage(content); }
            case "system" -> { return new SystemMessage(content); }
            default -> { return new ToolResponseMessage(List.of()); }
        }
    }
}
