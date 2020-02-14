package org.ailog.ailog.domain.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "record")
@AllArgsConstructor
@NoArgsConstructor
public class Record {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String token;
	@Column(name = "file_path")
	private String filePath;
	private String text;
	private String status;
	private String summarize;
}
