package com.huang.controller;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/ai/chat")
public class ChatController {
    private final ChatClient chatClient;

    public ChatController(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    @PostMapping("/send")
    public Flux<String> send(@RequestBody ChatData chatData) {
        Assert.hasText(chatData.getConversationId(), "Conversation ID must not be empty");
        Assert.hasText(chatData.getPrompt(), "Prompt must not be empty");
        return chatClient.prompt()
                .user(chatData.getPrompt())
                .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, chatData.getConversationId()))
                .stream()
                .content();
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    private static class ChatData {
        private String conversationId;
        private String prompt;
    }
}
