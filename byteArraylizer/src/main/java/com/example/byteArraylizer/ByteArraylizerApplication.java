package com.example.byteArraylizer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ByteArraylizerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ByteArraylizerApplication.class, args);
	}

	// Allow CORS for local frontend
	@org.springframework.context.annotation.Bean
	public org.springframework.web.servlet.config.annotation.WebMvcConfigurer corsConfigurer() {
		return new org.springframework.web.servlet.config.annotation.WebMvcConfigurer() {
			@Override
			public void addCorsMappings(org.springframework.web.servlet.config.annotation.CorsRegistry registry) {
				registry.addMapping("/**")
						.allowedOrigins("http://localhost:5173")
						.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
						.allowedHeaders("*");
			}
		};
	}
}
