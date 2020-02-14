package org.ailog.ailog.interfaces;

import java.io.IOException;
import java.util.Arrays;
import java.util.Base64;
import java.util.Base64.Decoder;
import java.util.List;

import javax.sound.sampled.AudioFileFormat;
import javax.sound.sampled.AudioFileFormat.Type;

import org.ailog.ailog.application.SttConverter;
import org.ailog.ailog.domain.model.ChatRecord;
import org.ailog.ailog.domain.service.RecordService;
import org.ailog.ailog.domain.service.STTService;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

@RestController
public class RecordController {

	@Autowired
	private RecordService recordService;

	@Autowired
	private STTService sttService;

	@Autowired
	private SttConverter sttConverter;

	@CrossOrigin
	@PostMapping("/record")
	public String saveRecord(@RequestParam("token") String token,
						   @RequestParam("uploadFile")MultipartFile file) throws IOException {
		System.out.println(file.getContentType());
		return recordService.saveFile(token, file);
	}

	@CrossOrigin
	@PostMapping("/record/bytes")
	public String saveRecordBytes(@RequestParam("token") String token,
							 @RequestParam("uploadFile") String base64audio) {

		Decoder decoder = Base64.getDecoder();
		byte[] decoded = decoder.decode(base64audio.split(",")[1]);

		return recordService.saveFile(token, decoded);
	}
}
