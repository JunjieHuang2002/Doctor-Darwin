package com.huang.dao;

import com.huang.po.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MessageDao extends MongoRepository<Message, String> {
}
