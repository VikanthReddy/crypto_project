package app.security;

import org.springframework.security.crypto.password.PasswordEncoder;

public class PasswordHash implements PasswordEncoder {

    private static final long PRIME = 31;
    private static final long MODULUS = 1_000_000_007;

    @Override
    public String encode(CharSequence password) {
        long hashValue = 7;

        for (char c : password.toString().toCharArray()) {
            hashValue = (hashValue * PRIME + c) % MODULUS;
        }

        return Long.toHexString(hashValue);
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        return encode(rawPassword).equals(encodedPassword);
    }
}