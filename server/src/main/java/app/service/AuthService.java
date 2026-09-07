package app.service;

import app.dto.LoginRequest;
import app.dto.SignupRequest;
import app.dto.UserResponse;
import app.model.Login;
import app.model.User;
import app.model.Wallet;
import app.repository.LoginRepository;
import app.repository.UserRepository;
import app.repository.WalletRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final LoginRepository loginRepository;

    public AuthService(
            UserRepository userRepository,
            WalletRepository walletRepository,
            LoginRepository loginRepository) {

        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.loginRepository = loginRepository;
    }

    public UserResponse signup(SignupRequest request) {

        if (request.getName() == null ||
            request.getName().trim().isEmpty()) {

            throw new RuntimeException("Name is required");
        }

        if (request.getEmail() == null ||
            request.getEmail().trim().isEmpty()) {

            throw new RuntimeException("Email is required");
        }

        if (request.getPassword() == null ||
            request.getPassword().trim().isEmpty()) {

            throw new RuntimeException("Password is required");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        user = userRepository.save(user);

        Wallet wallet = new Wallet();

        wallet.setUser(user);
        wallet.setBalance(BigDecimal.ZERO);

        walletRepository.save(wallet);

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }

    public UserResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        Login login = new Login();

        login.setUser(user);
        login.setLoginTime(LocalDateTime.now());

        loginRepository.save(login);

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }
}