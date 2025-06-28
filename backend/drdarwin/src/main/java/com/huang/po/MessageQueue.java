package com.huang.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@Document(collection = "messageQueues")
public class MessageQueue implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    private List<String> messages;

    public MessageQueue() {
        this.messages = new ArrayList<>();
    }
}
