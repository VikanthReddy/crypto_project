package app.controller;

import app.dto.UserResponse;
import app.service.UserService;

import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/user")
@CrossOrigin
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public UserResponse getProfile(
            Principal principal) {

        return userService.getProfile(
                principal.getName()
        );
    }
}