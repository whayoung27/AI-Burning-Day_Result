package org.ailog.ailog.interfaces;

import java.util.Base64;
import java.util.Base64.Decoder;
import java.util.List;

import org.ailog.ailog.application.SttConverter;
import org.ailog.ailog.domain.dto.ChatDto;
import org.ailog.ailog.domain.model.ChatRecord;
import org.ailog.ailog.domain.service.RecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ChatController {
	@Autowired
	private RecordService recordService;

	@Autowired
	private SttConverter sttConverter;

	@CrossOrigin
	@PostMapping("/chat/bytes")
	public String saveRecordChatBytes(@RequestParam("token") String token,
									  @RequestParam("uploadFile") String base64audio) {

		Decoder decoder = Base64.getDecoder();
		byte[] decoded = decoder.decode(base64audio.split(",")[1]);

		String fileName = recordService.saveChatFile(token, decoded);

		sttConverter.chatSttConvert();

		return fileName;
//		return recordService.saveFile(token, decoded);
	}

	@CrossOrigin
	@GetMapping("/chat")
	public List<ChatDto> getRecords() {
		return recordService.getChatRecord();
	}
}
