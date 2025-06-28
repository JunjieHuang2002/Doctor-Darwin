package com.huang.service;

import com.huang.dao.ConversationDao;
import com.huang.dao.MessageQueueDao;
import com.huang.po.Conversation;
import com.huang.po.Message;
import com.huang.po.MessageQueue;
import com.mongodb.client.ClientSession;
import com.mongodb.client.MongoClient;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ConversationService {
    private final MongoClient mongoClient;
    private final MongoTemplate mongoTemplate;
    private final ConversationDao conversationDao;
    private final MessageQueueService messageQueueService;

    public ConversationService(MongoClient mongoClient, MongoTemplate mongoTemplate, ConversationDao conversationDao, MessageQueueService messageQueueService) {
        this.mongoClient = mongoClient;
        this.mongoTemplate = mongoTemplate;
        this.conversationDao = conversationDao;
        this.messageQueueService = messageQueueService;
    }

    public Optional<List<String>> getIds() {
        return Optional.of(
                conversationDao.findAll().stream()
                        .map(Conversation::getConversationId)
                        .toList()
        );
    }

//    @Transactional
    public Optional<String> insert(String conversationId) {
        Conversation conversation = get(conversationId).orElse(null);
        Assert.isNull(conversation, "Conversation ID{" + conversationId + "} already exists.");
//        MessageQueue messageQueue = new MessageQueue();
//        mongoTemplate.insert(messageQueue);
        MessageQueue messageQueue = messageQueueService.create();
        conversation = new Conversation(conversationId, messageQueue.getId());
//        mongoTemplate.insert(conversation);
        conversation = conversationDao.insert(conversation);
        return Optional.of(conversation.getConversationId());
    }

//    @Transactional
    public void deleteById(String conversationId) {
        Conversation conversation = get(conversationId).orElse(null);
        Assert.notNull(conversation, "Conversation ID{" + conversationId + "} does not exist.");
        MessageQueue messageQueue = messageQueueService.getMessageQueueById(conversation.getMsg()).orElse(null);
        Assert.notNull(messageQueue, "MessageQueue ID{" + conversation.getMsg() + "} does not exist.");
//        mongoTemplate.remove(
//                Query.query(Criteria.where("_id").is(conversation.getId())),
//                Conversation.class
//        );
//        mongoTemplate.remove(
//                Query.query(Criteria.where("_id").is(messageQueue.getId())),
//                MessageQueue.class
//        );
//        messageQueue.getMessages().forEach(
//                mid -> mongoTemplate.remove(
//                        Query.query(Criteria.where("_id").is(mid)),
//                        Message.class
//                )
//        );
        conversationDao.deleteById(conversation.getId());
        messageQueueService.deleteById(messageQueue.getId());
    }

    public Optional<List<Message>> getAllMessages(String conversationId) {
        Conversation conversation = get(conversationId).orElse(null);
        Assert.notNull(conversation, "Conversation ID{" + conversationId + "} does not exist.");
        return messageQueueService.getMessages(conversation.getMsg())
                .map(this::sortMessages);
    }

    private List<Message> sortMessages(List<Message> messages) {
        return messages.stream()
                .sorted(Comparator.comparing(Message::getDate))
                .collect(Collectors.toList());
    }

//    @Transactional
    public void saveMessages(String conversationId, List<Message> messages) {
        Conversation conversation = get(conversationId).orElse(null);
        Assert.notNull(conversation, "Conversation ID{" + conversationId + "} does not exist.");
        messageQueueService.saveMessages(conversation.getMsg(), messages);
    }


    public Optional<Conversation> get(String conversationId) {
        Assert.hasText(conversationId, "Conversation ID cannot be empty.");
        return conversationDao.findByCid(conversationId);
    }
}
