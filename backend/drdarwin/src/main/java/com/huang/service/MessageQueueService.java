package com.huang.service;

import com.huang.dao.MessageQueueDao;
import com.huang.po.Message;
import com.huang.po.MessageQueue;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.util.List;
import java.util.Optional;

@Service
public class MessageQueueService {
    private final MessageQueueDao messageQueueDao;
    private final MessageService messageService;

    public MessageQueueService(MessageQueueDao messageQueueDao, MessageService messageService) {
        this.messageQueueDao = messageQueueDao;
        this.messageService = messageService;
    }

    public MessageQueue create() {
        MessageQueue messageQueue = new MessageQueue();
        return messageQueueDao.insert(messageQueue);
    }

//    @Transactional
    public void saveMessages(String id, List<Message> messages) {
        Assert.notEmpty(messages, "Messages cannot be empty.");
        MessageQueue messageQueue = getMessageQueueById(id).orElse(null);
        Assert.notNull(messageQueue, "MessageQueue ID{" + id + "} does not exist.");
        messages.forEach(message -> {
            String mid = messageService.insert(message).orElse(null);
            Assert.notNull(mid, "Failed to insert message: " + message);
            messageQueue.getMessages().add(mid);
        });
        messageQueueDao.save(messageQueue);
    }

//    @Transactional
    public void deleteById(String id) {
        MessageQueue messageQueue = getMessageQueueById(id).orElse(null);
        Assert.notNull(messageQueue, "MessageQueue ID{" + id + "} does not exist.");
        messageService.getAll(messageQueue.getMessages()).ifPresent(messages -> {
            messages.forEach(message -> messageService.deleteById(message.getId()));
        });
        messageQueueDao.deleteById(id);
    }

    public Optional<MessageQueue> getMessageQueueById(String id) {
        Assert.hasText(id, "MessageQueue ID cannot be empty.");
        return messageQueueDao.findById(id);
    }

    public Optional<List<Message>> getMessages(String id) {
        MessageQueue messageQueue = getMessageQueueById(id).orElse(null);
        Assert.notNull(messageQueue, "MessageQueue ID{" + id + "} does not exist.");
        return messageService.getAll(messageQueue.getMessages());
    }
}
