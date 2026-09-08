package app.controller;

import app.dto.AuthResponse;
import app.dto.LoginRequest;
import app.dto.SignupRequest;
import app.dto.UserResponse;

import app.service.AuthService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    public AuthController(
            AuthService authService) {

        this.authService = authService;
    }

    /*
     * ==========================
     * SIGNUP
     * ==========================
     */
    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse signup(
            @RequestBody SignupRequest request) {

        return authService.signup(request);
    }

    /*
     * ==========================
     * LOGIN
     * ==========================
     */
    @PostMapping("/login")
    public AuthResponse login(
            @RequestBody LoginRequest request) {

        return authService.login(request);
    }

    /*
     * ==========================
     * ERROR HANDLER
     * ==========================
     */
    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleException(
            RuntimeException exception) {

        return Map.of(
                "error",
                exception.getMessage()
        );
    }
}