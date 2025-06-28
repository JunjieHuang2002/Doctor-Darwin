package com.huang.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "conversations")
public class Conversation implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    private String conversationId;
    private String msg;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Conversation(String conversationId, String msg) {
        this.conversationId = conversationId;
        this.msg = msg;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
