package org.ailog.ailog.domain.service;

import org.springframework.stereotype.Service;

@Service
public interface STTService {
	String stt(Long id);
	String chatStt(Long id);
}
