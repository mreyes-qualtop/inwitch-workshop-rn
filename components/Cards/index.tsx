import React, { useState, useMemo, useEffect } from "react";
import { FlatList, Text, TextInput, View, Picker } from "react-native";
import { styled } from "@gluestack-style/react";
import { Box, Spinner } from "@gluestack-ui/themed";
import useGetCards from "./useCards";
import CardItem from "../CardItem";
import { cardStatus } from "./types";

interface CardListProps {
  entityId: string;
}

const CardsList: React.FC<CardListProps> = ({ entityId }) => {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [last4Filter, setLast4Filter] = useState<string>("");
  
  const filters = useMemo(() => {

    return {
      status: statusFilter,
      last4: last4Filter,
    };
  }, [statusFilter, last4Filter]);


  const { cards, error, loading, getCards } = useGetCards(entityId, filters);
   
  return (
    <Box w={"$full"} h={"$full"}>
      <FilterContainer>
        <Text>Filtrar por estado:</Text>
        <Picker
          selectedValue={statusFilter}
          onValueChange={(value) => setStatusFilter(value)}
        >
          <Picker.Item label="Todos" value={undefined} />
          {cardStatus.map((status) => (
            <Picker.Item key={status} label={status} value={status} />
          ))}
        </Picker>

        <Text>Últimos 4 dígitos:</Text>
        <TextInput
          style={{ borderColor: 'gray', borderWidth: 1, padding: 5, marginBottom: 10 }}
          value={last4Filter}
          onChangeText={(text) => setLast4Filter(text)}
          placeholder="Ej: 1234"
          maxLength={4}
        />
      </FilterContainer>

      <FlatList
        data={cards.cards}
        keyExtractor={(item) => item.cardIdentifier}
        renderItem={({ item }) => <CardItem {...item} handleReload={getCards} />}
        ListFooterComponent={
          <>
            {loading && <Spinner size={"small"} />}
          </>
        }
        ListHeaderComponent={
          <>
            <TextWrapper>Total de tarjetas: {cards.totalCount}</TextWrapper>
          </>
        }
        ListEmptyComponent={
          <>
            {error ? (
              <ErrorText>
                Error obteniendo las tarjetas: {error.message}
              </ErrorText>
            ) : (
              <TextWrapper mt={"$4"} textAlign="center">
                No hay tarjetas disponibles
              </TextWrapper>
            )}
          </>
        }
      />
    </Box>
  );
};

const FilterContainer = styled(View, {
  marginBottom: 20,
  padding: 10,
  borderColor: 'gray',
  borderWidth: 1,
  borderRadius: 5,
  backgroundColor: 'white',
});

const TextWrapper = styled(Text, {
  color: "$black",
  _dark: {
    color: "$white",
  },
});

const ErrorText = styled(TextWrapper, {
  fontSize: "$lg",
  color: "$red200",
  _dark: {
    color: "$red900",
  },
});

export default CardsList;
