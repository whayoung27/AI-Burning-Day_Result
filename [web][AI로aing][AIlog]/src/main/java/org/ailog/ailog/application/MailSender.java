package org.ailog.ailog.application;

import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.ailog.ailog.domain.model.Record;
import org.ailog.ailog.domain.model.User;
import org.ailog.ailog.infrastructure.persistence.RecordRepository;
import org.ailog.ailog.infrastructure.persistence.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class MailSender {

	@Autowired
	private RecordRepository recordRepository;

	@Autowired
	private UserRepository userRepository;

	@Value("${mail.user}")
	private String user;
	@Value("${mail.password}")
	private String password;

	private String host = "smtp.naver.com";
	private Properties props = new Properties();

	@PostConstruct
	public void init() {
		props.put("mail.smtp.host", host);
		props.put("mail.smtp.port", 587);
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "false");
	}

	public void sendMail() {
		List<Record> list = recordRepository.findRecordsByStatus("DONE");

		Session session = Session.getDefaultInstance(props, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() { return new PasswordAuthentication(user, password); }
		});

		for (Record record : list) {
			try {
				User receiveUser = userRepository.findUserByToken(record.getToken());

				System.out.println(receiveUser.getToken());
				System.out.println(receiveUser.getEmail());
				MimeMessage message = new MimeMessage(session);
				message.setFrom(new InternetAddress(user + "@naver.com"));
				message.addRecipient(Message.RecipientType.TO, new InternetAddress(receiveUser.getEmail()));
				message.setSubject("summarize content"); // 메일 내용
				message.setText(record.getSummarize()); // send the message

				Transport.send(message);
				System.out.println("Success Message Send");
				record.setStatus("SEND");
			} catch (MessagingException e) {
				e.printStackTrace();
			}

		}

		recordRepository.flush();
		System.out.println("SEND MAIL END");
	}
}
