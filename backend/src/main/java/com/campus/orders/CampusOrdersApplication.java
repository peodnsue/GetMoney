package com.campus.orders;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.campus.orders.mapper")
public class CampusOrdersApplication {
    public static void main(String[] args) {
        SpringApplication.run(CampusOrdersApplication.class, args);
    }
}
