package com.huang.dao;

import com.huang.po.MessageQueue;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MessageQueueDao extends MongoRepository<MessageQueue, String> {
}
