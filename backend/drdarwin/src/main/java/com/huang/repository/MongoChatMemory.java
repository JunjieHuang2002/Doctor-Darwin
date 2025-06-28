package com.huang.repository;

import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.ChatMemoryRepository;
import org.springframework.ai.chat.messages.Message;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MongoChatMemory implements ChatMemory {
    private final ChatMemoryRepository chatMemoryRepository;

    public MongoChatMemory(ChatMemoryRepository chatMemoryRepository) {
        this.chatMemoryRepository = chatMemoryRepository;
    }

    @Override
    public void add(String conversationId, Message message) {
         chatMemoryRepository.saveAll(conversationId, List.of(message));
    }

    @Override
    public void add(String conversationId, List<Message> messages) {
        chatMemoryRepository.saveAll(conversationId, messages);
    }

    @Override
    public List<Message> get(String conversationId) {
        return chatMemoryRepository.findByConversationId(conversationId);
    }

    @Override
    public void clear(String conversationId) {
        chatMemoryRepository.deleteByConversationId(conversationId);
    }
}
