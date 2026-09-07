package app.repository;

import app.model.Login;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoginRepository extends JpaRepository<Login, Long> {

    List<Login> findByUserId(Long userId);
}