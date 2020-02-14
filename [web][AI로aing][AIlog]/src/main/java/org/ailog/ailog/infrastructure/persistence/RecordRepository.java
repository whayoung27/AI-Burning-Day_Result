package org.ailog.ailog.infrastructure.persistence;

import java.util.List;

import org.ailog.ailog.domain.model.Record;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecordRepository extends JpaRepository<Record, Long> {
	List<Record> findRecordsByStatus(String status);
}
