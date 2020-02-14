package org.ailog.ailog.domain.service;

import org.ailog.ailog.domain.model.User;
import org.ailog.ailog.infrastructure.persistence.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
	@Autowired
	private UserRepository userRepository;

	public void createUser(User user) {
		userRepository.save(user);
	}
}
