package com.campus.orders.controller;

import com.campus.orders.dto.ApiResponse;
import com.campus.orders.dto.GcoinTransferRequest;
import com.campus.orders.dto.GcoinTransferResponse;
import com.campus.orders.dto.GcoinWalletResponse;
import com.campus.orders.entity.GcoinTransaction;
import com.campus.orders.service.GcoinService;
import com.baomidou.mybatisplus.core.metadata.IPage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/gcoin")
public class GcoinController {

    @Autowired
    private GcoinService gcoinService;

    @GetMapping("/wallet")
    public ApiResponse<GcoinWalletResponse> getWallet(@RequestAttribute("userId") Long userId) {
        GcoinWalletResponse wallet = gcoinService.getWallet(userId);
        return ApiResponse.success(wallet);
    }

    @PostMapping("/transfer")
    public ApiResponse<GcoinTransferResponse> transfer(
            @RequestAttribute("userId") Long userId,
            @Valid @RequestBody GcoinTransferRequest request) {
        GcoinTransferResponse response = gcoinService.transfer(userId, request);
        return ApiResponse.success("转账成功", response);
    }

    @GetMapping("/transactions")
    public ApiResponse<IPage<GcoinTransaction>> getTransactions(
            @RequestAttribute("userId") Long userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {
        IPage<GcoinTransaction> transactions = gcoinService.getTransactionHistory(userId, page, size);
        return ApiResponse.success(transactions);
    }
}