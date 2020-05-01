import React from 'react';
import { Box, Text, Flex } from '@chakra-ui/core';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { raceSelector } from '../state/selectors';
import CardProgressOverlay from './CardProgressOverlay';
import CardTrackContent from './CardTrackContent';

const CardTrack = ({ track }) => {
  const { id, race } = track;
  const location = useLocation();
  const history = useHistory();

  const currentRace = useSelector(raceSelector(race));

  // To improve mobile navigation,
  // this way the back button will un-select instead off showing the previous selected
  const setSelected = () => {
    if (currentRace) return;

    if (location?.state?.track) {
      history.replace({
        pathname: location.pathname,
        state: { ...(location.state || {}), track: id },
      });
    } else {
      history.push({
        pathname: location.pathname,
        state: { ...(location.state || {}), track: id },
      });
    }
  };

  return (
    <Box
      w="304px"
      h="396px"
      position="relative"
      cursor="pointer"
      borderRadius="16px"
      onClick={setSelected}
    >
      {location?.state?.track === id && (
        <Box
          position="absolute"
          w="100%"
          h="100%"
          bg="#B2F5EA77"
          borderRadius="16px"
        />
      )}
      {currentRace && (
        <CardProgressOverlay borderRadius="16px" race={currentRace} />
      )}
      <CardTrackContent
        track={track}
        borderRadius="16px"
        imageBorderRadius="16px 16px 0 0"
      />
      {track.lastRace && (
        <Flex
          w="100%"
          h="100%"
          borderRadius="16px"
          bg="blackAlpha.800"
          position="absolute"
          top="0"
          left="0"
        >
          <Text margin="auto" fontSize="24px" color="white">
            Results
          </Text>
        </Flex>
      )}
    </Box>
  );
};

CardTrack.defaultProps = {
  prizes: [],
};

export default CardTrack;
