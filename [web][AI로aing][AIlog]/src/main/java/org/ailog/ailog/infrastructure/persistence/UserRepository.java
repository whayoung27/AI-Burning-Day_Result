package org.ailog.ailog.infrastructure.persistence;

import java.util.List;

import org.ailog.ailog.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
	User findUserByToken(String token);
	List<User> findUsersByTokenIn(List<String> tokens);
}
