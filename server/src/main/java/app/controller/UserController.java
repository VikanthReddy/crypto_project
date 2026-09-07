package app.controller;

import app.dto.UserResponse;
import app.service.UserService;
import org.springframework.web.bind.annotation.*;

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
            @RequestParam Long id) {

        return userService.getProfile(id);
    }
}