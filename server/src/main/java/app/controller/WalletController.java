package app.controller;

import app.dto.WalletResponse;
import app.service.WalletService;

import org.springframework.http.ResponseEntity;
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
            java.security.Principal principal) {

        return walletService.getWallet(principal.getName());
    }

    @PostMapping("/deposit")
    public WalletResponse deposit(
            java.security.Principal principal,
            @RequestParam BigDecimal amount) {

        return walletService.deposit(
                principal.getName(),
                amount
        );
    }

    @PostMapping("/withdraw")
    public WalletResponse withdraw(
            java.security.Principal principal,
            @RequestParam BigDecimal amount) {

        return walletService.withdraw(
                principal.getName(),
                amount
        );
    }

    @PostMapping("/send")
    public Map<String, String> send(
            java.security.Principal principal,
            @RequestParam String receiverEmail,
            @RequestParam BigDecimal amount) {

        String result = walletService.sendMoney(
                principal.getName(),
                receiverEmail,
                amount
        );

        return Map.of("message", result);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleException(
            RuntimeException exception) {

        return ResponseEntity
                .badRequest()
                .body(Map.of(
                        "error",
                        exception.getMessage()
                ));
    }
}