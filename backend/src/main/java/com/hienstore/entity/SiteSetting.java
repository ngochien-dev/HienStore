package com.hienstore.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "site_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteSetting {

    @Id
    @Column(length = 50)
    private String settingKey;

    @Column(columnDefinition = "TEXT")
    private String settingValue;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
