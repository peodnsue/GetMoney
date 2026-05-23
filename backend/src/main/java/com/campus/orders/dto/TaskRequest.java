package com.campus.orders.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class TaskRequest {
    private Long typeId;
    private String title;
    private String description;
    private BigDecimal commission;
    private BigDecimal deposit;
    private LocalDateTime deadline;
    private String building;
    private String address;
    private List<String> images;

    public String getImagesAsString() {
        if (images == null || images.isEmpty()) {
            return null;
        }
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.writeValueAsString(images);
        } catch (JsonProcessingException e) {
            return null;
        }
    }
}
