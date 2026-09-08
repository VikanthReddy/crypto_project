package app.service;

import app.dto.WalletResponse;
import app.model.Wallet;
import app.repository.WalletRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class WalletService {

    private final WalletRepository walletRepository;

    public WalletService(WalletRepository walletRepository) {
        this.walletRepository = walletRepository;
    }

    public WalletResponse getWallet(String email) {

        Wallet wallet = walletRepository
                .findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Wallet not found"));

        return convert(wallet);
    }

    @Transactional
    public WalletResponse deposit(
            String email,
            BigDecimal amount) {

        validateAmount(amount);

        Wallet wallet = walletRepository
                .findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Wallet not found"));

        BigDecimal currentBalance =
                wallet.getBalance() == null
                        ? BigDecimal.ZERO
                        : wallet.getBalance();

        wallet.setBalance(
                currentBalance.add(amount)
        );

        walletRepository.save(wallet);

        return convert(wallet);
    }

    @Transactional
    public WalletResponse withdraw(
            String email,
            BigDecimal amount) {

        validateAmount(amount);

        Wallet wallet = walletRepository
                .findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Wallet not found"));

        BigDecimal currentBalance =
                wallet.getBalance() == null
                        ? BigDecimal.ZERO
                        : wallet.getBalance();

        if (currentBalance.compareTo(amount) < 0) {
            throw new RuntimeException(
                    "Insufficient balance"
            );
        }

        wallet.setBalance(
                currentBalance.subtract(amount)
        );

        walletRepository.save(wallet);

        return convert(wallet);
    }

    @Transactional
    public String sendMoney(
            String senderEmail,
            String receiverEmail,
            BigDecimal amount) {

        validateAmount(amount);

        if (receiverEmail == null ||
                receiverEmail.isBlank()) {

            throw new RuntimeException(
                    "Receiver email is required"
            );
        }

        receiverEmail = receiverEmail.trim();

        Wallet senderWallet =
                walletRepository
                        .findByUserEmail(senderEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Sender wallet not found"
                                ));

        Wallet receiverWallet =
                walletRepository
                        .findByUserEmail(receiverEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Receiver wallet not found"
                                ));

        if (senderWallet.getUser() == null ||
                receiverWallet.getUser() == null) {

            throw new RuntimeException(
                    "Wallet user data is missing"
            );
        }

        if (senderWallet.getUser()
                .getId()
                .equals(receiverWallet.getUser().getId())) {

            throw new RuntimeException(
                    "Cannot send money to yourself"
            );
        }

        BigDecimal senderBalance =
                senderWallet.getBalance() == null
                        ? BigDecimal.ZERO
                        : senderWallet.getBalance();

        if (senderBalance.compareTo(amount) < 0) {
            throw new RuntimeException(
                    "Insufficient balance"
            );
        }

        BigDecimal receiverBalance =
                receiverWallet.getBalance() == null
                        ? BigDecimal.ZERO
                        : receiverWallet.getBalance();

        senderWallet.setBalance(
                senderBalance.subtract(amount)
        );

        receiverWallet.setBalance(
                receiverBalance.add(amount)
        );

        walletRepository.save(senderWallet);
        walletRepository.save(receiverWallet);

        return "Money sent successfully";
    }

    private void validateAmount(BigDecimal amount) {

        if (amount == null ||
                amount.compareTo(BigDecimal.ZERO) <= 0) {

            throw new RuntimeException(
                    "Amount must be greater than zero"
            );
        }
    }

    private WalletResponse convert(Wallet wallet) {

        if (wallet == null) {
            throw new RuntimeException(
                    "Wallet not found"
            );
        }

        if (wallet.getUser() == null) {
            throw new RuntimeException(
                    "Wallet user data is missing"
            );
        }

        return new WalletResponse(
                wallet.getId(),
                wallet.getBalance() == null
                        ? BigDecimal.ZERO
                        : wallet.getBalance(),
                wallet.getUser().getName(),
                wallet.getUser().getEmail()
        );
    }
}