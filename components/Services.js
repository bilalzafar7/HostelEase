// Service.js

import React from 'react';
import { Pressable, Text } from 'react-native';

const Service = ({ service, isSelected, onSelect }) => {
  return (
    <Pressable
      onPress={() => onSelect(service)}
      style={{
        backgroundColor: isSelected ? '#c90644' : 'white',
        borderRadius: 10,
        padding: 8,
        marginHorizontal: 10,
        marginVertical: 3,
      }}
    >
      <Text
        style={{
          textAlign: 'center',
          fontSize: 16,
          fontWeight: '500',
          color: isSelected ? 'white' : '#c90644',
          fontFamily: 'Kanit',
        }}
      >
        {service}
      </Text>
    </Pressable>
  );
};

export default Service;
