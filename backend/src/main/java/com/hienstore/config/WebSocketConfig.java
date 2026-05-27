package com.hienstore.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Prefix for messages bound for methods annotated with @MessageMapping
        registry.setApplicationDestinationPrefixes("/app");
        // Prefix for messages sent to clients
        registry.enableSimpleBroker("/topic", "/queue");
        registry.setUserDestinationPrefix("/user");
    }

    @org.springframework.beans.factory.annotation.Autowired
    private com.hienstore.security.JwtService jwtService;

    @org.springframework.beans.factory.annotation.Autowired
    private org.springframework.security.core.userdetails.UserDetailsService userDetailsService;

    @Override
    public void configureClientInboundChannel(org.springframework.messaging.simp.config.ChannelRegistration registration) {
        registration.interceptors(new org.springframework.messaging.support.ChannelInterceptor() {
            @Override
            public org.springframework.messaging.Message<?> preSend(org.springframework.messaging.Message<?> message, org.springframework.messaging.MessageChannel channel) {
                org.springframework.messaging.simp.stomp.StompHeaderAccessor accessor =
                        org.springframework.messaging.simp.stomp.StompHeaderAccessor.wrap(message);

                if (org.springframework.messaging.simp.stomp.StompCommand.CONNECT.equals(accessor.getCommand())) {
                    java.util.List<String> authorization = accessor.getNativeHeader("Authorization");
                    if (authorization != null && !authorization.isEmpty()) {
                        String authHeader = authorization.get(0);
                        if (authHeader.startsWith("Bearer ")) {
                            String token = authHeader.substring(7);
                            try {
                                String username = jwtService.extractUsername(token);
                                if (username != null) {
                                    org.springframework.security.core.userdetails.UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                                    if (jwtService.isTokenValid(token, userDetails)) {
                                        org.springframework.security.authentication.UsernamePasswordAuthenticationToken authentication =
                                                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                                                        userDetails, null, userDetails.getAuthorities());
                                        accessor.setUser(authentication);
                                    }
                                }
                            } catch (Exception e) {
                                // Ignore invalid token
                            }
                        }
                    }
                }
                return message;
            }
        });
    }
}
