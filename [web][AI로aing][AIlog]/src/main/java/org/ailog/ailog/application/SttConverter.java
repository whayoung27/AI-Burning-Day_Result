package org.ailog.ailog.application;

import java.util.List;

import org.ailog.ailog.domain.model.ChatRecord;
import org.ailog.ailog.domain.model.Record;
import org.ailog.ailog.domain.service.STTService;
import org.ailog.ailog.infrastructure.persistence.ChatRecordRepository;
import org.ailog.ailog.infrastructure.persistence.RecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class SttConverter {
	@Autowired
	private RecordRepository recordRepository;

	@Autowired
	private ChatRecordRepository chatRecordRepository;

	@Autowired
	private STTService sttService;

	public void sttConvert() {
		System.out.println("STT START");
		final List<Record> lists = recordRepository.findRecordsByStatus("NONE");

		lists.forEach(o -> {
			final String res = sttService.stt(o.getId());
			o.setText(res);
			o.setStatus("READY");
		});

		recordRepository.flush();
		System.out.println("STT END");

	}

	public void chatSttConvert() {
		System.out.println("CHAT STT START");
		final List<ChatRecord> lists = chatRecordRepository.findRecordsByStatus("NONE");

		lists.forEach(o -> {
			final String res = sttService.chatStt(o.getId());
			o.setText(res);
			o.setStatus("READY");
		});

		recordRepository.flush();
		System.out.println("CHAT STT END");
	}
}
