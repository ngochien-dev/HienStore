package com.hienstore.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "addresses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(length = 100)
    private String fullName;

    @Column(length = 20)
    private String phone;

    @Column(length = 50)
    private String streetNumber;

    @Column(length = 100)
    private String streetName;

    @Column(length = 100)
    private String ward;

    @Column(length = 100)
    private String district;

    @Column(length = 100)
    private String city;

    @Builder.Default
    private Boolean isDefault = false;

    public String getFullAddress() {
        StringBuilder sb = new StringBuilder();
        if (streetNumber != null && !streetNumber.isEmpty()) sb.append(streetNumber).append(" ");
        if (streetName != null && !streetName.isEmpty()) sb.append(streetName).append(", ");
        if (ward != null && !ward.isEmpty()) sb.append(ward).append(", ");
        if (district != null && !district.isEmpty()) sb.append(district).append(", ");
        if (city != null && !city.isEmpty()) sb.append(city);
        return sb.toString().trim();
    }
}
