package org.ailog.ailog.domain.dto;


import org.ailog.ailog.domain.model.ChatRecord;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatDto {
	private Long id;
	private String token;
	private String text;
	private String nickName;

	public ChatDto(ChatRecord record, String nickName) {
		this.id = record.getId();
		this.token = record.getToken();
		this.text = record.getText();
		this.nickName = nickName;
	}
}
