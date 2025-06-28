package com.huang.service;

import com.huang.dao.MessageDao;
import com.huang.po.Message;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.List;
import java.util.Optional;

@Service
public class MessageService {
    private final MessageDao messageDao;

    public MessageService(MessageDao messageDao) {
        this.messageDao = messageDao;
    }

    public Optional<String> insert(Message message) {
        return Optional.of(
                messageDao.insert(message).getId()
        );
    }

    public void deleteById(String id) {
        Assert.hasText(id, "Message ID must not be empty");
        messageDao.deleteById(id);
    }

    public Optional<List<Message>> getAll(List<String> messageIds) {
        return Optional.of(
                messageDao.findAllById(messageIds)
        );
    }
}
