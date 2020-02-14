package org.ailog.ailog.domain.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;
import javax.sound.sampled.AudioFileFormat;
import javax.sound.sampled.AudioFileFormat.Type;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.UnsupportedAudioFileException;

import org.ailog.ailog.domain.dto.ChatDto;
import org.ailog.ailog.domain.model.ChatRecord;
import org.ailog.ailog.domain.model.Record;
import org.ailog.ailog.domain.model.User;
import org.ailog.ailog.infrastructure.persistence.ChatRecordRepository;
import org.ailog.ailog.infrastructure.persistence.RecordRepository;
import org.ailog.ailog.infrastructure.persistence.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class RecordService {

	@Autowired
	private RecordRepository recordRepository;

	@Autowired
	private ChatRecordRepository chatRecordRepository;

	@Autowired
	private UserRepository userRepository;


	private AudioFileFormat audioFileFormat;

	@PostConstruct
	public void init() throws IOException, UnsupportedAudioFileException {
		audioFileFormat = AudioSystem.getAudioFileFormat(new File("1234.wav"));
	}

	public String saveFile(String token, MultipartFile file) {
		File saveFile = new File( UUID.randomUUID() + token + ".wav");

		try {
//			AudioFileFormat audioFileFormat = AudioSystem.getAudioFileFormat(new File("1234.wav"));

			AudioInputStream audioInputStream = new AudioInputStream(file.getInputStream(),audioFileFormat.getFormat(),audioFileFormat.getFrameLength());
			AudioSystem.write(audioInputStream, Type.WAVE, saveFile);

			Record record = new Record();
			record.setFilePath(saveFile.getPath());
			record.setStatus("NONE");
			record.setToken(token);
			recordRepository.save(record);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return saveFile.getName();
	}

	public String saveFile(String token, byte[] bytes) {
		File saveFile = new File( UUID.randomUUID() + token + ".wav");
		try {

			FileOutputStream fileOutputStream = new FileOutputStream(saveFile);
			fileOutputStream.write(bytes);

			Record record = new Record();
			record.setFilePath(saveFile.getPath());
			record.setStatus("NONE");
			record.setToken(token);
			recordRepository.save(record);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return saveFile.getName();
	}

	public String saveChatFile(String token, byte[] bytes) {
		File saveFile = new File( UUID.randomUUID() + token + ".wav");
		try {

			FileOutputStream fileOutputStream = new FileOutputStream(saveFile);
			fileOutputStream.write(bytes);

			ChatRecord record = new ChatRecord();
			record.setFilePath(saveFile.getPath());
			record.setStatus("NONE");
			record.setToken(token);
			chatRecordRepository.save(record);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return saveFile.getName();
	}

	public void updateFile(Long id, String message) {
		Record record = recordRepository.findById(id).orElseThrow(() -> new NoSuchElementException("no element"));
		record.setText(message);
		record.setStatus("READY");

		recordRepository.flush();
	}

	public List<ChatDto> getChatRecord() {
		List<ChatRecord> records = chatRecordRepository.findRecordsByStatus("READY");

		return records.stream()
			   .map(o -> {
			   	User user = userRepository.findUserByToken(o.getToken());
			   	return new ChatDto(o, user.getNickName());
			   })
		.collect(Collectors.toList());
	}
}
