package com.campus.orders.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campus.orders.entity.User;
import com.campus.orders.mapper.UserMapper;
import com.campus.orders.service.UserService;
import com.campus.orders.service.VerifyCodeService;
import com.campus.orders.service.MailService;
import com.campus.orders.service.GcoinService;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Autowired
    private VerifyCodeService verifyCodeService;

    @Autowired
    private MailService mailService;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private GcoinService gcoinService;

    @Override
    public User loginByEmail(String email, String password) {
        User user = userMapper.selectByEmailOnly(email);

        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        String hashedPassword = DigestUtils.md5Hex(password);
        if (!hashedPassword.equals(user.getPassword())) {
            throw new RuntimeException("密码错误");
        }

        if (user.getStatus() != 1) {
            throw new RuntimeException("账号已被封禁，请联系管理员处理");
        }

        return user;
    }

    @Override
    public User loginByEmailCode(String email, String code) {
        User user = userMapper.selectByEmailOnly(email);

        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        if (!verifyCodeService.verifyCode(email, code)) {
            throw new RuntimeException("验证码错误或已过期");
        }

        if (user.getStatus() != 1) {
            throw new RuntimeException("账号已被封禁，请联系管理员处理");
        }

        return user;
    }

    @Override
    @Transactional
    public User register(String email, String code, String nickname, String password) {
        User existingUser = userMapper.selectByEmailOnly(email);
        if (existingUser != null) {
            throw new RuntimeException("邮箱已注册");
        }

        if (!verifyCodeService.verifyCode(email, code)) {
            throw new RuntimeException("验证码错误或已过期");
        }

        User user = new User();
        user.setEmail(email);
        user.setNickname(nickname != null && !nickname.isEmpty() ? nickname : email.split("@")[0]);
        user.setPassword(DigestUtils.md5Hex(password));
        user.setRole(1);
        user.setBalance(new java.math.BigDecimal("0"));
        user.setStatus(1);

        this.save(user);
        
        gcoinService.createAccount(user.getId());
        
        return userMapper.selectById(user.getId());
    }

    @Override
    public User getUserInfo(Long userId) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        return user;
    }

    @Override
    public void sendCode(String email) {
        mailService.sendVerificationCode(email);
    }

    @Override
    public void sendCode(String email, String type) {
        if ("register".equals(type)) {
            User existingUser = userMapper.selectByEmailOnly(email);
            if (existingUser != null) {
                throw new RuntimeException("该邮箱已被注册");
            }
        } else if ("login".equals(type)) {
            User existingUser = userMapper.selectByEmailOnly(email);
            if (existingUser == null) {
                throw new RuntimeException("该邮箱尚未注册");
            }
        }
        mailService.sendVerificationCode(email);
    }

    @Override
    public User updateUser(Long userId, User user) {
        User existingUser = userMapper.selectById(userId);
        if (existingUser == null) {
            throw new RuntimeException("用户不存在");
        }

        if (user.getNickname() != null) {
            existingUser.setNickname(user.getNickname());
        }
        if (user.getAvatar() != null) {
            existingUser.setAvatar(user.getAvatar());
        }
        if (user.getStudentId() != null) {
            existingUser.setStudentId(user.getStudentId());
        }

        this.updateById(existingUser);
        return userMapper.selectById(userId);
    }

    @Override
    public boolean verifyPassword(Long userId, String password) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            return false;
        }
        String hashedPassword = DigestUtils.md5Hex(password);
        return hashedPassword.equals(user.getPassword());
    }

    @Override
    public boolean verifyCode(String email, String code) {
        return verifyCodeService.verifyCode(email, code);
    }

    @Override
    public void changePassword(Long userId, String oldPassword, String newPassword, String code) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        String hashedOldPassword = DigestUtils.md5Hex(oldPassword);
        if (!hashedOldPassword.equals(user.getPassword())) {
            throw new RuntimeException("旧密码错误");
        }

        if (!verifyCodeService.verifyCode(user.getEmail(), code)) {
            throw new RuntimeException("验证码错误或已过期");
        }

        user.setPassword(DigestUtils.md5Hex(newPassword));
        this.updateById(user);
    }

    @Override
    public void changeEmail(Long userId, String newEmail, String code) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        User existingUser = userMapper.selectByEmailOnly(newEmail);
        if (existingUser != null) {
            throw new RuntimeException("邮箱已被注册");
        }

        if (!verifyCodeService.verifyCode(newEmail, code)) {
            throw new RuntimeException("验证码错误或已过期");
        }

        user.setEmail(newEmail);
        this.updateById(user);
    }

    @Override
    public void uploadAvatar(Long userId, String avatar) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        user.setAvatar(avatar);
        this.updateById(user);
    }
}
