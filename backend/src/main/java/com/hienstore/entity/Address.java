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
