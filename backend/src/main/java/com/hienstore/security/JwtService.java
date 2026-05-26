package com.hienstore.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
@Slf4j
public class JwtService {

    @Value("${jwt.private-key:}")
    private String privateKeyStr;

    @Value("${jwt.public-key:}")
    private String publicKeyStr;

    @Value("${jwt.expiration:86400000}")
    private long jwtExpiration;

    private PrivateKey privateKey;
    private PublicKey publicKey;

    @PostConstruct
    public void init() {
        try {
            if (privateKeyStr == null || privateKeyStr.trim().isEmpty() ||
                publicKeyStr == null || publicKeyStr.trim().isEmpty()) {
                log.warn("JWT Keys not provided in config. Generating ephemeral RSA keys for development.");
                KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
                keyPairGenerator.initialize(2048);
                KeyPair keyPair = keyPairGenerator.generateKeyPair();
                this.privateKey = keyPair.getPrivate();
                this.publicKey = keyPair.getPublic();
            } else {
                KeyFactory keyFactory = KeyFactory.getInstance("RSA");
                
                // Parse Private Key
                String privKeyClean = privateKeyStr.replace("-----BEGIN PRIVATE KEY-----", "")
                                                   .replace("-----END PRIVATE KEY-----", "")
                                                   .replaceAll("\\s+", "");
                byte[] privKeyBytes = Base64.getDecoder().decode(privKeyClean);
                this.privateKey = keyFactory.generatePrivate(new PKCS8EncodedKeySpec(privKeyBytes));

                // Parse Public Key
                String pubKeyClean = publicKeyStr.replace("-----BEGIN PUBLIC KEY-----", "")
                                                 .replace("-----END PUBLIC KEY-----", "")
                                                 .replaceAll("\\s+", "");
                byte[] pubKeyBytes = Base64.getDecoder().decode(pubKeyClean);
                this.publicKey = keyFactory.generatePublic(new X509EncodedKeySpec(pubKeyBytes));
                log.info("Loaded RSA keys from configuration successfully.");
            }
        } catch (Exception e) {
            log.error("Failed to initialize RSA keys for JWT", e);
            throw new RuntimeException("Could not initialize JWT keys", e);
        }
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(privateKey, Jwts.SIG.RS256)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(publicKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
