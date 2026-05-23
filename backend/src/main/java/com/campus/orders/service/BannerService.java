package com.campus.orders.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.campus.orders.entity.Banner;
import java.util.List;

public interface BannerService extends IService<Banner> {
    List<Banner> getActiveBanners();
}
