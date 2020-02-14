package org.ailog.ailog.domain.service;

import java.io.File;
import java.io.FileInputStream;
import java.util.List;
import java.util.NoSuchElementException;

import org.ailog.ailog.application.FileProcessor;
import org.ailog.ailog.domain.model.ChatRecord;
import org.ailog.ailog.domain.model.Record;
import org.ailog.ailog.domain.model.SttResult;
import org.ailog.ailog.infrastructure.persistence.ChatRecordRepository;
import org.ailog.ailog.infrastructure.persistence.RecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PapagoSTTService implements STTService {

	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	private RecordRepository recordRepository;

	@Autowired
	private ChatRecordRepository chatRecordRepository;

	@Autowired
	private FileProcessor fileProcessor;

	private String url = "https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang=Kor";

	@Value("${stt.api.key}")
	private String STT_API_KEY;

	@Value("${stt.api.key.id}")
	private String STT_API_KEY_ID;

	@Override
	public String stt(Long id) {
		Record record = recordRepository.findById(id).orElseThrow(() -> new NoSuchElementException("no elem"));
		String filePath = record.getFilePath();

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
		headers.set("X-NCP-APIGW-API-KEY-ID", STT_API_KEY_ID);
		headers.set("X-NCP-APIGW-API-KEY", STT_API_KEY);

		List<File> lists = fileProcessor.splitFiles(filePath);
		String result = "";

		for (int i = 0; i < lists.size(); i++) {
			try (final FileInputStream fileInputStream = new FileInputStream(lists.get(i))) {
				byte[] buffer = new byte[2000000];
				fileInputStream.read(buffer);
				final HttpEntity requestEntity = new HttpEntity(buffer, headers);

				ResponseEntity<SttResult> res = restTemplate.exchange(url, HttpMethod.POST, requestEntity, SttResult.class);
				String apiResult = res.getBody().getText();

				System.out.println(i + apiResult);
				result += apiResult + "\n";
			} catch (Exception e) {
				System.out.println(e);

			}
		}


		lists.forEach(o -> o.delete());
		System.out.println("result :" + result);
		return result;
	}

	@Override
	public String chatStt(Long id) {
//		List<Record> lists = chatRecordRepository.findRecordsByStatus("NONE");

		ChatRecord record = chatRecordRepository.findById(id).orElseThrow(() -> new NoSuchElementException("no elem"));
		String filePath = record.getFilePath();

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
		headers.set("X-NCP-APIGW-API-KEY-ID", STT_API_KEY_ID);
		headers.set("X-NCP-APIGW-API-KEY", STT_API_KEY);

		List<File> lists = fileProcessor.splitFiles(filePath);
		String result = "";

		for (int i = 0; i < lists.size(); i++) {
			try (final FileInputStream fileInputStream = new FileInputStream(lists.get(i))) {
				byte[] buffer = new byte[2000000];
				fileInputStream.read(buffer);
				final HttpEntity requestEntity = new HttpEntity(buffer, headers);

				ResponseEntity<SttResult> res = restTemplate.exchange(url, HttpMethod.POST, requestEntity, SttResult.class);
				String apiResult = res.getBody().getText();

				result += apiResult + "\n";
			} catch (Exception e) {
				System.out.println(e);

			}
		}

		lists.forEach(o -> o.delete());
		System.out.println("result :" + result);
		return result;
	}
}
