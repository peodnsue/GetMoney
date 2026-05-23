package com.campus.orders.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campus.orders.entity.Evaluation;
import com.campus.orders.entity.User;
import com.campus.orders.mapper.EvaluationMapper;
import com.campus.orders.mapper.UserMapper;
import com.campus.orders.service.EvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EvaluationServiceImpl extends ServiceImpl<EvaluationMapper, Evaluation> implements EvaluationService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public Evaluation submitEvaluation(Long userId, Integer rating, String feedback) {
        Evaluation evaluation = new Evaluation();
        evaluation.setUserId(userId);
        evaluation.setRating(rating);
        evaluation.setFeedback(feedback);
        evaluation.setStatus(0);
        
        this.save(evaluation);
        
        User user = userMapper.selectById(userId);
        if (user != null) {
            evaluation.setUserNickname(user.getNickname());
            evaluation.setUserEmail(user.getEmail());
        }
        
        return evaluation;
    }

    @Override
    public boolean updateStatus(Long id, Integer status) {
        Evaluation evaluation = this.getById(id);
        if (evaluation == null) {
            return false;
        }
        evaluation.setStatus(status);
        return this.updateById(evaluation);
    }
}
