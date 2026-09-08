package app.service;

import app.dto.AuthResponse;
import app.dto.LoginRequest;
import app.dto.SignupRequest;
import app.dto.UserResponse;
import app.model.Login;
import app.model.User;
import app.model.Wallet;
import app.repository.LoginRepository;
import app.repository.UserRepository;
import app.repository.WalletRepository;
import app.security.JwtService;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final LoginRepository loginRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public AuthService(
            UserRepository userRepository,
            WalletRepository walletRepository,
            LoginRepository loginRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            UserDetailsService userDetailsService) {

        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.loginRepository = loginRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    // =========================
    // SIGNUP
    // =========================
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

        String email = request.getEmail().trim();

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();

        user.setName(request.getName().trim());
        user.setEmail(email);

        // HASH PASSWORD BEFORE SAVING
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user = userRepository.save(user);

        // Create wallet
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

    // =========================
    // LOGIN
    // =========================
    public AuthResponse login(LoginRequest request) {

        if (request.getEmail() == null ||
                request.getEmail().trim().isEmpty()) {

            throw new RuntimeException("Email is required");
        }

        if (request.getPassword() == null ||
                request.getPassword().trim().isEmpty()) {

            throw new RuntimeException("Password is required");
        }

        String email = request.getEmail().trim();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password"
                        )
                );

        // Compare entered password with stored hash
        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!passwordMatches) {
            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        // Load authenticated user details
        UserDetails userDetails =
                userDetailsService.loadUserByUsername(email);

        // Generate JWT
        String token =
                jwtService.generateToken(userDetails);

        // Save login record
        Login login = new Login();

        login.setUser(user);
        login.setLoginTime(LocalDateTime.now());

        loginRepository.save(login);

        UserResponse userResponse =
                new UserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail()
                );

        // Return JWT + user information
        return new AuthResponse(
                token,
                userResponse
        );
    }
}