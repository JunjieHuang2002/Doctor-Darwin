package com.huang.controller;

import com.huang.po.Message;
import com.huang.service.ConversationService;
import com.huang.utils.Result;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ai/conversation")
public class ConversationController {
    private final ConversationService conversationService;

    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @GetMapping("/getIds")
    public Result<List<String>> getIds() {
        return conversationService.getIds()
                .map(Result::success)
                .orElseGet(() -> Result.fail("Failed to retrieve conversation IDs"));
    }

    @PostMapping("/create")
    public Result<String> create(@RequestParam String conversationId) {
        Assert.hasText(conversationId, "Conversation ID cannot be empty");
        return conversationService.insert(conversationId)
                .map(Result::success)
                .orElseGet(() -> Result.fail("Failed to create conversation"));
    }

    @DeleteMapping("/delete")
    public Result<String> delete(@RequestParam String conversationId) {
        Assert.hasText(conversationId, "Conversation ID cannot be empty");
        conversationService.deleteById(conversationId);
        return Result.success();
    }

    @GetMapping("/history")
    public Result<List<Message>> getAllMessages(@RequestParam String conversationId) {
        Assert.hasText(conversationId, "Conversation ID cannot be empty");
        return conversationService.getAllMessages(conversationId)
                .map(Result::success)
                .orElseGet(() -> Result.fail("Failed to retrieve messages"));
    }
}
