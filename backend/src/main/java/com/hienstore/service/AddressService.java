package com.hienstore.service;

import com.hienstore.dto.request.AddressRequest;
import com.hienstore.dto.response.AddressDto;
import com.hienstore.entity.Address;
import com.hienstore.entity.User;
import com.hienstore.mapper.AddressMapper;
import com.hienstore.repository.AddressRepository;
import com.hienstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final AddressMapper addressMapper;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<AddressDto> getUserAddresses(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return addressRepository.findByUserIdOrderByIdDesc(user.getId())
                .stream()
                .map(addressMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public AddressDto createAddress(String email, AddressRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Address> existingAddresses = addressRepository.findByUserIdOrderByIdDesc(user.getId());
        
        // If it's the first address or requested to be default
        boolean isDefault = existingAddresses.isEmpty() || (request.getIsDefault() != null && request.getIsDefault());

        if (isDefault && !existingAddresses.isEmpty()) {
            existingAddresses.forEach(addr -> addr.setIsDefault(false));
            addressRepository.saveAll(existingAddresses);
        }

        Address address = Address.builder()
                .user(user)
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .streetNumber(request.getStreetNumber())
                .streetName(request.getStreetName())
                .ward(request.getWard())
                .district(request.getDistrict())
                .city(request.getCity())
                .isDefault(isDefault)
                .build();

        address = addressRepository.save(address);
        return addressMapper.toDto(address);
    }

    @Transactional
    public AddressDto updateAddress(String email, Long addressId, AddressRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = addressRepository.findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() -> new RuntimeException("Address not found"));

        boolean requestedDefault = request.getIsDefault() != null && request.getIsDefault();
        
        if (requestedDefault && !address.getIsDefault()) {
            List<Address> existingAddresses = addressRepository.findByUserIdOrderByIdDesc(user.getId());
            existingAddresses.stream()
                    .filter(addr -> !addr.getId().equals(addressId))
                    .forEach(addr -> addr.setIsDefault(false));
            addressRepository.saveAll(existingAddresses);
        }

        address.setFullName(request.getFullName());
        address.setPhone(request.getPhone());
        address.setStreetNumber(request.getStreetNumber());
        address.setStreetName(request.getStreetName());
        address.setWard(request.getWard());
        address.setDistrict(request.getDistrict());
        address.setCity(request.getCity());
        
        if (request.getIsDefault() != null) {
            address.setIsDefault(requestedDefault);
        }

        address = addressRepository.save(address);
        return addressMapper.toDto(address);
    }

    @Transactional
    public void deleteAddress(String email, Long addressId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = addressRepository.findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() -> new RuntimeException("Address not found"));

        addressRepository.delete(address);
        
        // If the deleted address was default, set the latest one to default
        if (address.getIsDefault()) {
            List<Address> remaining = addressRepository.findByUserIdOrderByIdDesc(user.getId());
            if (!remaining.isEmpty()) {
                Address newDefault = remaining.get(0);
                newDefault.setIsDefault(true);
                addressRepository.save(newDefault);
            }
        }
    }
}
