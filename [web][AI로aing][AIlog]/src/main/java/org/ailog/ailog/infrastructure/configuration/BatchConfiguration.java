package org.ailog.ailog.infrastructure.configuration;

import javax.transaction.Transactional;

import org.ailog.ailog.application.MailSender;
import org.ailog.ailog.application.SttConverter;
import org.ailog.ailog.domain.service.RecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Configuration
@EnableScheduling
public class BatchConfiguration {

	@Autowired
	private MailSender mailSender;

	@Autowired
	private SttConverter sttConverter;

	@Scheduled(fixedRate = 30000, initialDelay = 5000)
	@Transactional
	public void sendMail() {
		mailSender.sendMail();
	}

	@Scheduled(fixedRate = 30000, initialDelay = 6000)
	@Transactional
	public void stt() {
		sttConverter.sttConvert();
	}
}
