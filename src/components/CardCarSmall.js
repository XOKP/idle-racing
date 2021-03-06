import React from 'react';
import { Box, Text, Flex } from '@chakra-ui/core';
import { useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { capitalize, ATTRIBUTE_TYPES } from '../helpers/utils';
import { colors } from '../helpers/theme';
import AttributeCircle from './AttributeCircle';
import Button from './Button';
import CarImage from './CarImage';
import { useHistoryHelper } from '../helpers/hooks';

const BlinkCard = styled(Button)`
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  -webkit-tap-highlight-color: transparent;
  animation: ${({ blink }) =>
    blink ? 'card-car-shadow-blink 1s ease infinite' : 'none'};
  padding: 0;

  :hover {
    animation: none;
  }

  @keyframes card-car-shadow-blink {
    50% {
      box-shadow: none;
    }
    100% {
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    }
  }
`;

const CardCarSmall = ({
  car,
  stripped,
  onClick,
  notification,
  showAttributes,
  infoBgColor = colors.lightGray,
  infoH,
  children,
  ...props
}) => {
  const { id } = car;
  const location = useLocation();
  const history = useHistoryHelper();

  // To improve mobile navigation,
  // this way the back button will un-select
  const setSelected = () => {
    if (onClick) {
      onClick(car);

      return;
    }

    if (location?.state?.car) {
      history.replace({
        pathname: location.pathname,
        state: { ...(location.state || {}), car: id },
      });
    } else {
      history.push({
        pathname: location.pathname,
        state: { ...(location.state || {}), car: id },
      });
    }
  };

  return (
    <BlinkCard
      w="160px"
      position="relative"
      onClick={setSelected}
      cursor="pointer"
      borderRadius="16px"
      blink={notification}
      bg={colors.darkGray}
      {...props}
    >
      {children}
      <Flex
        w="100%"
        h={infoH || '100%'}
        direction="column"
        borderRadius="16px"
        bg={infoBgColor}
        position="absolute"
        top="0"
      >
        <Text
          fontSize="14px"
          lineHeight="24px"
          textAlign="center"
          w="100%"
          marginTop="100px"
        >
          {car.name}
        </Text>
        {showAttributes && (
          <Flex justifyContent="space-evenly">
            <AttributeCircle
              attr={car[ATTRIBUTE_TYPES.ACCELERATION]}
              tuning={~~car.tuning?.[ATTRIBUTE_TYPES.ACCELERATION]}
              text="ACC"
            />
            <AttributeCircle
              attr={car[ATTRIBUTE_TYPES.SPEED]}
              tuning={~~car.tuning?.[ATTRIBUTE_TYPES.SPEED]}
              text="SPD"
            />
            <AttributeCircle
              attr={car[ATTRIBUTE_TYPES.HANDLING]}
              tuning={~~car.tuning?.[ATTRIBUTE_TYPES.HANDLING]}
              text="HND"
            />
          </Flex>
        )}
      </Flex>
      <Box
        w="100%"
        h="100px"
        position="absolute"
        top="0"
        left="0"
        borderRadius="16px"
        color={colors.darkGray}
        fontSize="12px"
        lineHeight="12px"
      >
        <CarImage car={car} bg={colors.white} />
        <Text top="8px" left="8px" position="absolute">
          {capitalize(car.brand)}
        </Text>
        <Text bottom="8px" right="8px" position="absolute">
          {car.type}
        </Text>
      </Box>
    </BlinkCard>
  );
};

export default CardCarSmall;
