package com.example.backend;

import com.example.backend.entity.enums.Role;
import com.example.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		// Load .env file
		Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
		dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner setupAdmin(UserRepository userRepository) {
		return args -> {
			userRepository.findByEmail("admin@gmail.com").ifPresent(user -> {
				if (user.getRole() != Role.ADMIN) {
					user.setRole(Role.ADMIN);
					userRepository.save(user);
					System.out.println(">>> [AUTO-FIX] admin@gmail.com role updated to ADMIN");
				}
			});
		};
	}
}
