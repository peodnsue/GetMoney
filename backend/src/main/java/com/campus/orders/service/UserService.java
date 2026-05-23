package com.campus.orders.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.campus.orders.entity.User;

public interface UserService extends IService<User> {
    User loginByEmail(String email, String password);
    User loginByEmailCode(String email, String code);
    User register(String email, String code, String nickname, String password);
    User getUserInfo(Long userId);
    void sendCode(String email);
    void sendCode(String email, String type);
    User updateUser(Long userId, User user);
    boolean verifyPassword(Long userId, String password);
    boolean verifyCode(String email, String code);
    void changePassword(Long userId, String oldPassword, String newPassword, String code);
    void changeEmail(Long userId, String newEmail, String code);
    void uploadAvatar(Long userId, String avatar);
}
