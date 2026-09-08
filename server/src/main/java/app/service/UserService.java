package app.service;

import app.dto.UserResponse;
import app.model.User;
import app.repository.UserRepository;

import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponse getProfile(String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        ));

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }
}