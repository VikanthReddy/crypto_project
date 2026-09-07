package app.dto;

import java.math.BigDecimal;

public class WalletResponse {

    private Long id;
    private BigDecimal balance;
    private String userName;
    private String email;

    public WalletResponse() {
    }

    public WalletResponse(
            Long id,
            BigDecimal balance,
            String userName,
            String email) {

        this.id = id;
        this.balance = balance;
        this.userName = userName;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public String getUserName() {
        return userName;
    }

    public String getEmail() {
        return email;
    }
}