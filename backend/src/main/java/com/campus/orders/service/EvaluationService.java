package com.campus.orders.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.campus.orders.entity.Evaluation;

public interface EvaluationService extends IService<Evaluation> {
    Evaluation submitEvaluation(Long userId, Integer rating, String feedback);
    boolean updateStatus(Long id, Integer status);
}
