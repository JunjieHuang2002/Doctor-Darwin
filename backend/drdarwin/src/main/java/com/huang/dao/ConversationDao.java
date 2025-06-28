package com.huang.dao;

import com.huang.po.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

public interface ConversationDao extends MongoRepository<Conversation, String> {
    @Query(value = "{ 'conversationId': ?0 }", exists = true)
    boolean existsByCid(String name);

    @Query(value = "{ 'conversationId': ?0 }")
    Optional<Conversation> findByCid(String conversationId);
}
