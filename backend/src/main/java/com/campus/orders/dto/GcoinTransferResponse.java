package com.campus.orders.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class GcoinTransferResponse {
    private BigDecimal amount;
    private BigDecimal fee;
    private BigDecimal actualReceived;
    private BigDecimal senderBalance;
    private BigDecimal receiverBalance;
    private String receiverNickname;
}