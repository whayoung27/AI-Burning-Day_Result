package org.ailog.ailog.interfaces;

import org.ailog.ailog.application.MailSender;
import org.ailog.ailog.domain.model.User;
import org.ailog.ailog.domain.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

	@Autowired
	private UserService userService;

	@Autowired
	private MailSender mailSender;

	@PostMapping("/user")
	public User createUser(
			@RequestParam("token") String token,
			@RequestParam("name") String name,
			@RequestParam("nickName") String nickName,
			@RequestParam("email") String email
	) {

		final User user = new User(token, name, nickName, email);
		userService.createUser(user);

		return user;
	}

	@GetMapping("/user/test")
	public void sendMail() {
		mailSender.sendMail();
	}
}
