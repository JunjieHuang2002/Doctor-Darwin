package com.huang.repository;

import com.huang.service.ConversationService;
import com.huang.utils.MessageTypeUtils;
import org.springframework.ai.chat.memory.ChatMemoryRepository;
import org.springframework.ai.chat.messages.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class MongoChatRepository implements ChatMemoryRepository {
    private final ConversationService conversationService;

    public MongoChatRepository(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @Override
    public List<String> findConversationIds() {
        return conversationService.getIds().orElse(List.of());
    }

    @Override
    public List<Message> findByConversationId(String conversationId) {
        List<com.huang.po.Message> messages = conversationService.getAllMessages(conversationId).orElse(List.of());
        return messages.stream()
                .map(msg -> MessageTypeUtils.messageCreator(msg.getRole(),msg.getContent()))
                .collect(Collectors.toList());
    }

    @Override
    public void saveAll(String conversationId, List<Message> messages) {
        List<com.huang.po.Message> msgs = messages.stream()
                .map(msg -> new com.huang.po.Message(
                        MessageTypeUtils.translate2Role(msg.getMessageType()),
                        msg.getText()
                ))
                .toList();
        conversationService.saveMessages(conversationId, msgs);
    }

    @Override
    public void deleteByConversationId(String conversationId) {
        conversationService.deleteById(conversationId);
    }
}
