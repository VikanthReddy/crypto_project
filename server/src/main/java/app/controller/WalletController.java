package app.controller;

import app.dto.WalletResponse;
import app.service.WalletService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/wallet")
@CrossOrigin
public class WalletController {

    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @GetMapping("/me")
    public WalletResponse getWallet(
            @RequestParam Long userId) {

        return walletService.getWallet(userId);
    }

    @PostMapping("/deposit")
    public WalletResponse deposit(
            @RequestParam Long userId,
            @RequestParam BigDecimal amount) {

        return walletService.deposit(userId, amount);
    }

    @PostMapping("/withdraw")
    public WalletResponse withdraw(
            @RequestParam Long userId,
            @RequestParam BigDecimal amount) {

        return walletService.withdraw(userId, amount);
    }

    @PostMapping("/send")
    public Map<String, String> send(
            @RequestParam Long userId,
            @RequestParam String receiverEmail,
            @RequestParam BigDecimal amount) {

        String result = walletService.sendMoney(
                userId,
                receiverEmail,
                amount
        );

        return Map.of("message", result);
    }

    @ExceptionHandler(RuntimeException.class)
    public org.springframework.http.ResponseEntity<Map<String, String>>
    handleException(RuntimeException exception) {

        return org.springframework.http.ResponseEntity
                .badRequest()
                .body(Map.of(
                        "error",
                        exception.getMessage()
                ));
    }
}