package org.ailog.ailog.infrastructure.persistence;

import java.util.List;

import org.ailog.ailog.domain.model.ChatRecord;
import org.ailog.ailog.domain.model.Record;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRecordRepository extends JpaRepository<ChatRecord, Long> {
	List<ChatRecord> findRecordsByStatus(String status);
}
