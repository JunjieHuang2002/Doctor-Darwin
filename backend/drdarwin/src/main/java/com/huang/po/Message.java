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
@Document(collection = "messages")
public class Message implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    private String role;
    private String content;
    private LocalDateTime date;

    public Message(String role, String content) {
        this.role = role;
        this.content = content;
        this.date = LocalDateTime.now();
    }
}
